"use client";

import { useMemo, useState } from "react";
import {
  IDENTIDADES,
  DOLORES,
  UNICA_COSA,
  NOMBRES_MEMBRESIA,
  INTENTADO,
  VALOR_RECURRENTE,
  PRECIOS,
  etiquetaDe,
  type Opcion,
  type Respuesta,
} from "@/lib/encuesta-config";

// Para votaciones añadimos la fila "Otro" donde aplica
const DOLORES_VOTO: Opcion[] = [...DOLORES, { key: "otro", etiqueta: "Otro" }];
const UNICA_VOTO: Opcion[] = [...UNICA_COSA, { key: "otro", etiqueta: "Otro" }];

export default function PanelDashboard({
  respuestas,
  tieneIA,
}: {
  respuestas: Respuesta[];
  tieneIA: boolean;
}) {
  const total = respuestas.length;
  const prioritarias = respuestas.filter((r) => r.lista_prioritaria).length;
  const pctPrioritarias = total ? Math.round((prioritarias / total) * 100) : 0;

  // Respuestas por día
  const porDia = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of respuestas) {
      const dia = r.created_at.slice(0, 10);
      m.set(dia, (m.get(dia) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [respuestas]);
  const maxDia = Math.max(1, ...porDia.map(([, n]) => n));

  async function salir() {
    await fetch("/api/panel/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <main className="min-h-[100dvh] max-w-3xl mx-auto px-5 sm:px-8 py-8">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-[0.25em] uppercase text-muted">
            Panel privado · Relaciones
          </p>
          <h1 className="font-display text-3xl text-ink mt-1">
            Resultados de tu encuesta
          </h1>
        </div>
        <button
          onClick={salir}
          className="text-xs text-muted underline underline-offset-4 hover:text-ink"
        >
          Salir
        </button>
      </div>

      {total === 0 ? (
        <p className="text-muted mt-10">
          Todavía no hay respuestas. Cuando tu comunidad empiece a responder,
          aquí verás todo. 🤍
        </p>
      ) : (
        <>
          {/* ---------- RESUMEN ---------- */}
          <section className="mt-10 grid grid-cols-2 gap-3">
            <Tarjeta valor={String(total)} etiqueta="Respuestas totales" />
            <Tarjeta
              valor={`${pctPrioritarias}%`}
              etiqueta={`Quieren ser de las primeras (${prioritarias})`}
              destacar
            />
          </section>

          <Bloque titulo="Respuestas por día">
            <div className="space-y-2">
              {porDia.map(([dia, n]) => (
                <div key={dia} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-xs text-muted tabular-nums">
                    {formatoDia(dia)}
                  </span>
                  <div className="flex-1 h-5 bg-soft rounded-md overflow-hidden">
                    <div
                      className="h-full bg-ink rounded-md"
                      style={{ width: `${(n / maxDia) * 100}%` }}
                    />
                  </div>
                  <span className="w-7 text-right text-xs text-ink tabular-nums">
                    {n}
                  </span>
                </div>
              ))}
            </div>
          </Bloque>

          {/* ---------- CONTACTOS / CORREOS ---------- */}
          <Contactos respuestas={respuestas} />

          {/* ---------- FUENTES DE TRÁFICO ---------- */}
          <Fuentes respuestas={respuestas} total={total} />

          {/* ---------- VOTACIONES ---------- */}
          <h2 className="font-display text-2xl text-ink mt-14">Votaciones</h2>
          <p className="text-sm text-muted mt-1">
            Para entender a tu audiencia y decidir nombre, precio y mensaje.
          </p>

          <Votacion
            titulo="Identidad / imagen (P3)"
            opciones={IDENTIDADES}
            etiquetaPersonal={(o) => o.texto || o.etiqueta}
            valores={respuestas.map((r) => r.identidad)}
            total={total}
          />
          <Votacion
            titulo="Lo que más pesa hoy · dolor (P4)"
            opciones={DOLORES_VOTO}
            valores={respuestas.map((r) => r.dolor)}
            total={total}
          />
          <Votacion
            titulo="La única cosa a resolver (P5)"
            opciones={UNICA_VOTO}
            valores={respuestas.map((r) => r.unica_cosa)}
            total={total}
          />
          <Votacion
            titulo="Nombre de la membresía (P6)"
            opciones={NOMBRES_MEMBRESIA}
            valores={respuestas.map((r) => r.nombre_membresia)}
            total={total}
          />
          <VotacionMulti
            titulo="Qué han intentado antes (P8)"
            opciones={INTENTADO}
            valores={respuestas.map((r) => r.intentado)}
            total={total}
          />
          <VotacionMulti
            titulo="Qué las haría quedarse · mes a mes (P9)"
            opciones={VALOR_RECURRENTE}
            valores={respuestas.map((r) => r.valor_recurrente)}
            total={total}
          />
          <Votacion
            titulo="Cuota mensual justa · precio (P11)"
            opciones={PRECIOS}
            valores={respuestas.map((r) => r.precio)}
            total={total}
          />

          {/* ---------- RESPUESTAS ABIERTAS ---------- */}
          <RespuestasAbiertas respuestas={respuestas} />

          {/* ---------- DIAGNÓSTICO ---------- */}
          <Diagnostico tieneIA={tieneIA} />

          {/* ---------- EXPORTAR ---------- */}
          <section className="mt-14 mb-6">
            <button
              onClick={() => descargarCSV(respuestas)}
              className="rounded-full border border-ink px-7 py-3 text-sm font-medium text-ink transition-all active:scale-95 hover:bg-soft"
            >
              ⬇ Exportar todo a CSV
            </button>
          </section>
        </>
      )}
    </main>
  );
}

/* ---------- Tarjeta de resumen ---------- */
function Tarjeta({
  valor,
  etiqueta,
  destacar,
}: {
  valor: string;
  etiqueta: string;
  destacar?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 border ${
        destacar ? "bg-ink text-paper border-ink" : "bg-soft border-line"
      }`}
    >
      <div className="font-display text-4xl">{valor}</div>
      <div
        className={`text-xs mt-1 ${destacar ? "text-paper/70" : "text-muted"}`}
      >
        {etiqueta}
      </div>
    </div>
  );
}

function Bloque({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h3 className="text-sm font-medium text-ink mb-3">{titulo}</h3>
      {children}
    </section>
  );
}

/* ---------- Bloque de votación (selección única) ---------- */
function Votacion({
  titulo,
  opciones,
  valores,
  total,
  etiquetaPersonal,
}: {
  titulo: string;
  opciones: Opcion[];
  valores: string[];
  total: number;
  etiquetaPersonal?: (o: Opcion) => string;
}) {
  const filas = opciones
    .map((o) => {
      const n = valores.filter((v) => v === o.key).length;
      return { o, n, pct: total ? Math.round((n / total) * 100) : 0 };
    })
    .sort((a, b) => b.n - a.n);

  const ganadora = filas[0]?.n ?? 0;

  return (
    <section className="mt-8">
      <h3 className="text-sm font-medium text-ink mb-3">{titulo}</h3>
      <div className="space-y-3">
        {filas.map(({ o, n, pct }) => {
          const lider = n === ganadora && n > 0;
          return (
            <BarraFila
              key={o.key}
              etiqueta={etiquetaPersonal ? etiquetaPersonal(o) : o.etiqueta}
              n={n}
              pct={pct}
              lider={lider}
            />
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Bloque de votación (selección múltiple) ---------- */
function VotacionMulti({
  titulo,
  opciones,
  valores,
  total,
}: {
  titulo: string;
  opciones: Opcion[];
  valores: string[][];
  total: number;
}) {
  const filas = opciones
    .map((o) => {
      const n = valores.filter((arr) => arr.includes(o.key)).length;
      return { o, n, pct: total ? Math.round((n / total) * 100) : 0 };
    })
    .sort((a, b) => b.n - a.n);

  const ganadora = filas[0]?.n ?? 0;

  return (
    <section className="mt-8">
      <h3 className="text-sm font-medium text-ink mb-3">
        {titulo}{" "}
        <span className="text-muted/70 font-normal">(pueden elegir varias)</span>
      </h3>
      <div className="space-y-3">
        {filas.map(({ o, n, pct }) => (
          <BarraFila
            key={o.key}
            etiqueta={o.etiqueta}
            n={n}
            pct={pct}
            lider={n === ganadora && n > 0}
          />
        ))}
      </div>
    </section>
  );
}

function BarraFila({
  etiqueta,
  n,
  pct,
  lider,
}: {
  etiqueta: string;
  n: number;
  pct: number;
  lider: boolean;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-1">
        <span className="text-[13px] leading-snug text-ink">
          {etiqueta}
          {lider && <span className="ml-2 text-[10px]">🏆</span>}
        </span>
        <span className="shrink-0 text-xs text-muted tabular-nums">
          {n} · {pct}%
        </span>
      </div>
      <div className="h-3 bg-soft rounded-md overflow-hidden">
        <div
          className={`h-full rounded-md ${lider ? "bg-ink" : "bg-muted/50"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ---------- Fuentes de tráfico (UTM / referrer) ---------- */
function Fuentes({
  respuestas,
  total,
}: {
  respuestas: Respuesta[];
  total: number;
}) {
  const filas = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of respuestas) {
      const f = (r.utm_source || origenDeReferrer(r.referrer) || "directo").toLowerCase();
      m.set(f, (m.get(f) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [respuestas]);

  const ganadora = filas[0]?.[1] ?? 0;

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl text-ink">De dónde vienen</h2>
      <p className="text-sm text-muted mt-1 mb-4">
        Origen de cada registro (UTM o referente). Útil para no depender de un
        solo canal.
      </p>
      <div className="space-y-3">
        {filas.map(([fuente, n]) => (
          <BarraFila
            key={fuente}
            etiqueta={fuente}
            n={n}
            pct={total ? Math.round((n / total) * 100) : 0}
            lider={n === ganadora && n > 0}
          />
        ))}
      </div>
    </section>
  );
}

function origenDeReferrer(ref: string): string {
  if (!ref) return "";
  try {
    return new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/* ---------- Respuestas abiertas con buscador ---------- */
function RespuestasAbiertas({ respuestas }: { respuestas: Respuesta[] }) {
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    return respuestas
      .map((r) => {
        const abiertas: { etiqueta: string; texto: string }[] = [];
        if (r.voz_cliente?.trim())
          abiertas.push({
            etiqueta: "Dentro de un año (P7)",
            texto: r.voz_cliente.trim(),
          });
        if (r.dolor_otro?.trim())
          abiertas.push({ etiqueta: "Su dolor · otro (P4)", texto: r.dolor_otro.trim() });
        if (r.unica_cosa_otro?.trim())
          abiertas.push({
            etiqueta: "Única cosa · otro (P5)",
            texto: r.unica_cosa_otro.trim(),
          });
        return { r, abiertas };
      })
      .filter((x) => x.abiertas.length > 0);
  }, [respuestas]);

  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter(
      (x) =>
        x.r.nombre.toLowerCase().includes(t) ||
        x.abiertas.some((a) => a.texto.toLowerCase().includes(t))
    );
  }, [items, q]);

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl text-ink">Respuestas abiertas</h2>
      <p className="text-sm text-muted mt-1 mb-4">
        Lo que escribieron con sus propias palabras ({items.length}).
      </p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por nombre o palabra…"
        className="w-full bg-soft rounded-xl border border-line focus:border-ink outline-none px-4 py-3 text-sm text-ink mb-5 transition-colors"
      />
      {filtrados.length === 0 ? (
        <p className="text-sm text-muted">Sin resultados.</p>
      ) : (
        <div className="space-y-4">
          {filtrados.map((x) => (
            <div key={x.r.id} className="rounded-2xl border border-line p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-ink">{x.r.nombre}</span>
                <span className="text-xs text-muted">
                  {formatoDia(x.r.created_at.slice(0, 10))}
                </span>
              </div>
              <div className="space-y-2">
                {x.abiertas.map((a, i) => (
                  <div key={i}>
                    <span className="text-[10px] uppercase tracking-wide text-muted/70">
                      {a.etiqueta}
                    </span>
                    <p className="text-[14px] text-ink/85 leading-relaxed">
                      {a.texto}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- Contactos / lista de correos ---------- */
function Contactos({ respuestas }: { respuestas: Respuesta[] }) {
  const [q, setQ] = useState("");
  const [copiado, setCopiado] = useState(false);

  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return respuestas;
    return respuestas.filter(
      (r) =>
        r.nombre.toLowerCase().includes(t) ||
        r.correo.toLowerCase().includes(t)
    );
  }, [respuestas, q]);

  async function copiarCorreos() {
    const correos = filtrados.map((r) => r.correo).join(", ");
    try {
      await navigator.clipboard.writeText(correos);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Si el navegador bloquea el portapapeles, no hacemos nada
    }
  }

  return (
    <section className="mt-14">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-display text-2xl text-ink">Tus contactos</h2>
        <button
          onClick={copiarCorreos}
          className="rounded-full border border-ink px-4 py-2 text-xs font-medium text-ink transition-all active:scale-95 hover:bg-soft"
        >
          {copiado ? "¡Copiados! ✓" : "Copiar correos"}
        </button>
      </div>
      <p className="text-sm text-muted mt-1 mb-4">
        Tu lista de espera: {respuestas.length} correos. ⭐ = quiere ser de las
        primeras.
      </p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por nombre o correo…"
        className="w-full bg-soft rounded-xl border border-line focus:border-ink outline-none px-4 py-3 text-sm text-ink mb-4 transition-colors"
      />
      <div className="rounded-2xl border border-line overflow-hidden divide-y divide-line">
        {filtrados.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div className="min-w-0">
              <div className="text-sm text-ink truncate">
                {r.lista_prioritaria && <span className="mr-1">⭐</span>}
                {r.nombre}
              </div>
              <a
                href={`mailto:${r.correo}`}
                className="text-xs text-muted truncate block hover:text-ink hover:underline"
              >
                {r.correo}
              </a>
            </div>
            <span className="shrink-0 text-xs text-muted">
              {formatoDia(r.created_at.slice(0, 10))}
            </span>
          </div>
        ))}
        {filtrados.length === 0 && (
          <div className="px-4 py-3 text-sm text-muted">Sin resultados.</div>
        )}
      </div>
    </section>
  );
}

/* ---------- Diagnóstico con IA ---------- */
function Diagnostico({ tieneIA }: { tieneIA: boolean }) {
  const [estado, setEstado] = useState<"idle" | "cargando" | "listo">("idle");
  const [reporte, setReporte] = useState("");
  const [error, setError] = useState("");

  async function generar() {
    setEstado("cargando");
    setError("");
    try {
      const res = await fetch("/api/panel/diagnostico", { method: "POST" });
      const d = await res.json();
      if (!res.ok) {
        setError(d.error || "No se pudo generar.");
        setEstado("idle");
        return;
      }
      setReporte(d.reporte);
      setEstado("listo");
    } catch {
      setError("Error de conexión.");
      setEstado("idle");
    }
  }

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl text-ink">Diagnóstico con IA</h2>
      <p className="text-sm text-muted mt-1 mb-4">
        Analiza todas las respuestas abiertas y te devuelve dolores, citas
        textuales, segmentos y recomendaciones de mensajes.
        {!tieneIA && (
          <span className="block mt-1 text-[#b00020]">
            ⚠️ Aún no está activado (falta la API key de Anthropic).
          </span>
        )}
      </p>

      <button
        onClick={generar}
        disabled={estado === "cargando"}
        className="rounded-full bg-ink px-7 py-3 text-sm font-medium text-paper transition-all active:scale-95 disabled:opacity-50"
      >
        {estado === "cargando"
          ? "Analizando… (puede tardar ~1 min)"
          : "Generar diagnóstico"}
      </button>

      {error && <p className="text-sm text-[#b00020] mt-3">{error}</p>}

      {estado === "listo" && (
        <div className="mt-6 rounded-2xl border border-line bg-soft p-5">
          <MarkdownSimple texto={reporte} />
        </div>
      )}
    </section>
  );
}

/* ---------- Render simple de Markdown ---------- */
function MarkdownSimple({ texto }: { texto: string }) {
  const lineas = texto.split("\n");
  const out: React.ReactNode[] = [];
  let lista: string[] = [];

  const cerrarLista = (key: number) => {
    if (lista.length) {
      out.push(
        <ul key={`ul-${key}`} className="list-disc pl-5 space-y-1 my-2">
          {lista.map((li, i) => (
            <li key={i} className="text-[14px] text-ink/85 leading-relaxed">
              {negritas(li)}
            </li>
          ))}
        </ul>
      );
      lista = [];
    }
  };

  lineas.forEach((linea, i) => {
    const l = linea.trimEnd();
    if (/^##\s+/.test(l)) {
      cerrarLista(i);
      out.push(
        <h3 key={i} className="font-display text-lg text-ink mt-4 mb-1">
          {l.replace(/^##\s+/, "")}
        </h3>
      );
    } else if (/^###\s+/.test(l)) {
      cerrarLista(i);
      out.push(
        <h4 key={i} className="text-sm font-semibold text-ink mt-3 mb-1">
          {l.replace(/^###\s+/, "")}
        </h4>
      );
    } else if (/^[-·*]\s+/.test(l)) {
      lista.push(l.replace(/^[-·*]\s+/, ""));
    } else if (l.trim() === "") {
      cerrarLista(i);
    } else {
      cerrarLista(i);
      out.push(
        <p key={i} className="text-[14px] text-ink/85 leading-relaxed my-2">
          {negritas(l)}
        </p>
      );
    }
  });
  cerrarLista(lineas.length);

  return <div>{out}</div>;
}

function negritas(texto: string): React.ReactNode {
  const partes = texto.split(/(\*\*[^*]+\*\*)/g);
  return partes.map((p, i) =>
    /^\*\*[^*]+\*\*$/.test(p) ? (
      <strong key={i} className="text-ink font-semibold">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

/* ---------- Exportar CSV ---------- */
function descargarCSV(respuestas: Respuesta[]) {
  const cols = [
    "fecha",
    "nombre",
    "correo",
    "consentimiento",
    "identidad",
    "dolor",
    "unica_cosa",
    "nombre_membresia",
    "voz_cliente_P7",
    "intentado_P8",
    "valor_recurrente_P9",
    "lista_prioritaria",
    "precio",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "referrer",
    "id_mapa",
  ];
  const celda = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const dolorTexto = (r: Respuesta) =>
    r.dolor === "otro"
      ? `Otro: ${r.dolor_otro}`
      : etiquetaDe(DOLORES, r.dolor);
  const unicaTexto = (r: Respuesta) =>
    r.unica_cosa === "otro"
      ? `Otro: ${r.unica_cosa_otro}`
      : etiquetaDe(UNICA_COSA, r.unica_cosa);
  const filas = respuestas.map((r) =>
    [
      r.created_at,
      r.nombre,
      r.correo,
      r.consentimiento ? "sí" : "no",
      etiquetaDe(IDENTIDADES, r.identidad),
      dolorTexto(r),
      unicaTexto(r),
      etiquetaDe(NOMBRES_MEMBRESIA, r.nombre_membresia),
      r.voz_cliente,
      r.intentado.map((k) => etiquetaDe(INTENTADO, k)).join("; "),
      r.valor_recurrente.map((k) => etiquetaDe(VALOR_RECURRENTE, k)).join("; "),
      r.lista_prioritaria ? "sí" : "no",
      r.precio ? etiquetaDe(PRECIOS, r.precio) : "",
      r.utm_source,
      r.utm_medium,
      r.utm_campaign,
      r.utm_content,
      r.utm_term,
      r.referrer,
      r.id,
    ]
      .map(celda)
      .join(",")
  );
  const csv = "﻿" + [cols.join(","), ...filas].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `respuestas-relaciones-mjab.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------- Utilidades ---------- */
function formatoDia(iso: string): string {
  const [, m, d] = iso.split("-");
  const meses = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
  ];
  return `${d} ${meses[Number(m) - 1] ?? ""}`;
}
