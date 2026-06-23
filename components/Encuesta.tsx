"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "./Lightbox";
import {
  IDENTIDADES,
  DOLORES,
  UNICA_COSA,
  NOMBRES_MEMBRESIA,
  INTENTADO,
  VALOR_RECURRENTE,
  LISTA_OPCIONES,
  PRECIOS,
  PREGUNTAS,
  CONSENTIMIENTO_TEXTO,
  CONSENTIMIENTO_NOTA,
  FUENTE_VACIA,
  type Fuente,
  type Opcion,
} from "@/lib/encuesta-config";

const TOTAL = 11;

type Answers = {
  nombre: string;
  correo: string;
  consentimiento: boolean;
  identidad: string;
  dolor: string;
  dolor_otro: string;
  unica_cosa: string;
  unica_cosa_otro: string;
  nombre_membresia: string;
  voz_cliente: string;
  intentado: string[];
  valor_recurrente: string[];
  lista: "" | "si" | "no";
  precio: string;
};

const VACIO: Answers = {
  nombre: "",
  correo: "",
  consentimiento: false,
  identidad: "",
  dolor: "",
  dolor_otro: "",
  unica_cosa: "",
  unica_cosa_otro: "",
  nombre_membresia: "",
  voz_cliente: "",
  intentado: [],
  valor_recurrente: [],
  lista: "",
  precio: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Encuesta() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..10
  const [a, setA] = useState<Answers>(VACIO);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  const fuente = useRef<Fuente>(FUENTE_VACIA);
  const avanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Capturar el origen del tráfico (UTM + referrer) al cargar
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const v = (k: string) => p.get(k)?.slice(0, 200) ?? "";
      fuente.current = {
        utm_source: v("utm_source"),
        utm_medium: v("utm_medium"),
        utm_campaign: v("utm_campaign"),
        utm_content: v("utm_content"),
        utm_term: v("utm_term"),
        referrer: (document.referrer || "").slice(0, 300),
      };
    } catch {
      // sin acceso a window: queda vacío
    }
  }, []);

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setA((prev) => ({ ...prev, [k]: v }));

  const toggle = (k: "intentado" | "valor_recurrente", valor: string) =>
    setA((prev) => {
      const yaEsta = prev[k].includes(valor);
      return {
        ...prev,
        [k]: yaEsta ? prev[k].filter((x) => x !== valor) : [...prev[k], valor],
      };
    });

  // ¿Se puede continuar desde el paso actual?
  function puedeContinuar(): boolean {
    switch (step) {
      case 0:
        return a.nombre.trim().length > 0;
      case 1:
        return EMAIL_RE.test(a.correo.trim()) && a.consentimiento;
      case 2:
        return !!a.identidad;
      case 3:
        return !!a.dolor;
      case 4:
        return !!a.unica_cosa;
      case 5:
        return !!a.nombre_membresia;
      case 6:
        return true; // opcional
      case 7:
        return true; // opcional (multi)
      case 8:
        return true; // opcional (multi)
      case 9:
        return a.lista !== ""; // requerido: sí o no
      case 10:
        return true; // opcional / saltable
      default:
        return false;
    }
  }

  function irAtras() {
    setError("");
    if (avanceTimer.current) clearTimeout(avanceTimer.current);
    setStep((s) => Math.max(0, s - 1));
  }

  function irAdelante() {
    setError("");
    if (!puedeContinuar()) return;
    if (step === TOTAL - 1) {
      enviar();
      return;
    }
    setStep((s) => Math.min(TOTAL - 1, s + 1));
  }

  // Auto-avance suave en preguntas de una sola elección sin campos extra
  function elegirYAvanzar<K extends keyof Answers>(k: K, v: Answers[K]) {
    set(k, v);
    setError("");
    if (avanceTimer.current) clearTimeout(avanceTimer.current);
    avanceTimer.current = setTimeout(() => {
      setStep((s) => Math.min(TOTAL - 1, s + 1));
    }, 320);
  }

  async function enviar() {
    setEnviando(true);
    setError("");
    try {
      const payload = {
        nombre: a.nombre,
        correo: a.correo,
        consentimiento: a.consentimiento,
        identidad: a.identidad,
        dolor: a.dolor,
        dolor_otro: a.dolor === "otro" ? a.dolor_otro : "",
        unica_cosa: a.unica_cosa,
        unica_cosa_otro: a.unica_cosa === "otro" ? a.unica_cosa_otro : "",
        nombre_membresia: a.nombre_membresia,
        voz_cliente: a.voz_cliente,
        intentado: a.intentado,
        valor_recurrente: a.valor_recurrente,
        lista_prioritaria: a.lista === "si",
        precio: a.precio,
        ...fuente.current,
      };
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Algo salió mal. Inténtalo de nuevo.");
        setEnviando(false);
        return;
      }
      router.push(`/mapa/${data.token}`);
    } catch {
      setError("No pudimos enviar tus respuestas. Revisa tu conexión.");
      setEnviando(false);
    }
  }

  const progreso = ((step + 1) / TOTAL) * 100;
  const esUltimo = step === TOTAL - 1;

  return (
    <main className="min-h-[100dvh] flex flex-col px-6 pb-8 pt-5 max-w-xl mx-auto w-full">
      {/* Barra superior: logo pequeño + progreso */}
      <div className="shrink-0">
        <div className="flex items-center justify-between">
          <Image
            src="/marca/logo-negro.png"
            alt="María José Álvarez B."
            width={8001}
            height={1058}
            className="w-[120px] h-auto"
          />
          <span className="text-xs text-muted tabular-nums">
            {step + 1} / {TOTAL}
          </span>
        </div>
        <div className="mt-3 h-[3px] w-full bg-line rounded-full overflow-hidden">
          <div
            className="h-full bg-ink rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {/* Cuerpo de la pregunta (se reanima en cada paso) */}
      <div
        key={step}
        className="flex-1 flex flex-col justify-center py-8 animate-fade-in-up"
      >
        {renderPaso()}
        {error && (
          <p className="mt-5 text-sm text-[#b00020] text-center">{error}</p>
        )}
      </div>

      {/* Botonera inferior */}
      <div className="shrink-0 flex items-center gap-3">
        {step > 0 ? (
          <button
            onClick={irAtras}
            disabled={enviando}
            className="text-sm text-muted px-4 py-3 active:scale-95 transition-transform disabled:opacity-40"
          >
            ← Atrás
          </button>
        ) : (
          <Link
            href="/"
            className="text-sm text-muted px-4 py-3 active:scale-95 transition-transform"
          >
            ← Inicio
          </Link>
        )}
        <div className="flex-1" />
        {/* La última pregunta es saltable */}
        {esUltimo && !a.precio && (
          <button
            onClick={enviar}
            disabled={enviando}
            className="text-sm text-muted underline underline-offset-4 px-3 py-3 disabled:opacity-40"
          >
            Saltar
          </button>
        )}
        <button
          onClick={irAdelante}
          disabled={!puedeContinuar() || enviando}
          className="inline-flex items-center justify-center rounded-full bg-ink px-8 py-4 text-paper text-base font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {enviando
            ? "Creando tu mapa…"
            : esUltimo
            ? "Ver mi mapa"
            : "Continuar"}
        </button>
      </div>

      {zoom && (
        <Lightbox src={zoom.src} alt={zoom.alt} onClose={() => setZoom(null)} />
      )}
    </main>
  );

  // ---------------------------------------------------------------
  function renderPaso() {
    switch (step) {
      // P1 · Nombre
      case 0:
        return (
          <Pregunta titulo={PREGUNTAS.p1.titulo} sub={PREGUNTAS.p1.sub}>
            <input
              autoFocus
              type="text"
              value={a.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && irAdelante()}
              placeholder="Escribe tu nombre"
              className="w-full bg-transparent border-b border-line focus:border-ink outline-none py-3 text-2xl font-display text-ink placeholder:text-muted/50 transition-colors"
            />
          </Pregunta>
        );

      // P2 · Correo + consentimiento
      case 1:
        return (
          <Pregunta titulo={PREGUNTAS.p2.titulo}>
            <input
              autoFocus
              type="email"
              inputMode="email"
              autoCapitalize="off"
              value={a.correo}
              onChange={(e) => set("correo", e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              className="w-full bg-transparent border-b border-line focus:border-ink outline-none py-3 text-xl text-ink placeholder:text-muted/50 transition-colors"
            />
            <label className="mt-7 flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={a.consentimiento}
                onChange={(e) => set("consentimiento", e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-black cursor-pointer"
              />
              <span className="text-[15px] text-ink leading-relaxed">
                {CONSENTIMIENTO_TEXTO}
              </span>
            </label>
            <p className="mt-3 ml-8 text-xs text-muted/70 leading-relaxed">
              {CONSENTIMIENTO_NOTA}
            </p>
          </Pregunta>
        );

      // P3 · Identidad (4 imágenes, sin texto a la vista)
      case 2:
        return (
          <Pregunta titulo={PREGUNTAS.p3.titulo} sub={PREGUNTAS.p3.sub}>
            <div className="grid grid-cols-2 gap-3">
              {IDENTIDADES.map((m) => (
                <TarjetaImagen
                  key={m.key}
                  opcion={m}
                  seleccionada={a.identidad === m.key}
                  sinEtiqueta
                  onSelect={() => {
                    set("identidad", m.key);
                    setError("");
                  }}
                  onZoom={() => setZoom({ src: m.img!, alt: "Opción de imagen" })}
                />
              ))}
            </div>
          </Pregunta>
        );

      // P4 · Dolor + "otro"
      case 3:
        return (
          <Pregunta titulo={PREGUNTAS.p4.titulo} sub={PREGUNTAS.p4.sub}>
            <ListaOpciones
              opciones={DOLORES}
              valor={a.dolor}
              onSelect={(k) => {
                set("dolor", k);
                setError("");
              }}
              conOtro
              otroActivo={a.dolor === "otro"}
              onOtro={() => {
                set("dolor", "otro");
                setError("");
              }}
            />
            {a.dolor === "otro" && (
              <textarea
                autoFocus
                value={a.dolor_otro}
                onChange={(e) => set("dolor_otro", e.target.value)}
                rows={3}
                placeholder="Cuéntame con tus palabras…"
                className="mt-3 w-full bg-soft rounded-2xl border border-line focus:border-ink outline-none p-4 text-base text-ink placeholder:text-muted/50 resize-none transition-colors"
              />
            )}
          </Pregunta>
        );

      // P5 · La única cosa + "otro"
      case 4:
        return (
          <Pregunta titulo={PREGUNTAS.p5.titulo} sub={PREGUNTAS.p5.sub}>
            <ListaOpciones
              opciones={UNICA_COSA}
              valor={a.unica_cosa}
              onSelect={(k) => {
                set("unica_cosa", k);
                setError("");
              }}
              conOtro
              otroActivo={a.unica_cosa === "otro"}
              onOtro={() => {
                set("unica_cosa", "otro");
                setError("");
              }}
            />
            {a.unica_cosa === "otro" && (
              <textarea
                autoFocus
                value={a.unica_cosa_otro}
                onChange={(e) => set("unica_cosa_otro", e.target.value)}
                rows={3}
                placeholder="Cuéntame con tus palabras…"
                className="mt-3 w-full bg-soft rounded-2xl border border-line focus:border-ink outline-none p-4 text-base text-ink placeholder:text-muted/50 resize-none transition-colors"
              />
            )}
          </Pregunta>
        );

      // P6 · Nombre de la membresía (auto-avance)
      case 5:
        return (
          <Pregunta titulo={PREGUNTAS.p6.titulo}>
            <ListaOpciones
              opciones={NOMBRES_MEMBRESIA}
              valor={a.nombre_membresia}
              onSelect={(k) => elegirYAvanzar("nombre_membresia", k)}
            />
          </Pregunta>
        );

      // P7 · Voz de cliente (texto abierto, opcional)
      case 6:
        return (
          <Pregunta titulo={PREGUNTAS.p7.titulo} sub={PREGUNTAS.p7.sub} opcional>
            <textarea
              autoFocus
              value={a.voz_cliente}
              onChange={(e) => set("voz_cliente", e.target.value)}
              rows={5}
              placeholder="Escribe con tus palabras…"
              className="w-full bg-soft rounded-2xl border border-line focus:border-ink outline-none p-4 text-base text-ink placeholder:text-muted/50 resize-none transition-colors"
            />
          </Pregunta>
        );

      // P8 · Qué has intentado (multi)
      case 7:
        return (
          <Pregunta titulo={PREGUNTAS.p8.titulo} sub={PREGUNTAS.p8.sub} opcional>
            <MultiOpciones
              opciones={INTENTADO}
              valores={a.intentado}
              onToggle={(k) => toggle("intentado", k)}
            />
          </Pregunta>
        );

      // P9 · Valor recurrente (multi)
      case 8:
        return (
          <Pregunta titulo={PREGUNTAS.p9.titulo} sub={PREGUNTAS.p9.sub} opcional>
            <MultiOpciones
              opciones={VALOR_RECURRENTE}
              valores={a.valor_recurrente}
              onToggle={(k) => toggle("valor_recurrente", k)}
            />
          </Pregunta>
        );

      // P10 · Lista prioritaria (Sí/No, auto-avance)
      case 9:
        return (
          <Pregunta titulo={PREGUNTAS.p10.titulo}>
            <ListaOpciones
              opciones={LISTA_OPCIONES}
              valor={a.lista}
              onSelect={(k) => elegirYAvanzar("lista", k as Answers["lista"])}
            />
          </Pregunta>
        );

      // P11 · Precio (opcional / saltable)
      case 10:
        return (
          <Pregunta titulo={PREGUNTAS.p11.titulo} sub={PREGUNTAS.p11.sub}>
            <ListaOpciones
              opciones={PRECIOS}
              valor={a.precio}
              onSelect={(k) => {
                set("precio", k);
                setError("");
              }}
            />
          </Pregunta>
        );

      default:
        return null;
    }
  }
}

/* ---------- Sub-componentes de presentación ---------- */

function Pregunta({
  titulo,
  sub,
  opcional,
  children,
}: {
  titulo: string;
  sub?: string;
  opcional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl leading-snug text-ink">
        {titulo}
      </h1>
      {sub && (
        <p className="mt-2 text-[15px] text-muted leading-relaxed">{sub}</p>
      )}
      {opcional && (
        <p className="mt-2 text-xs uppercase tracking-wider text-muted/70">
          Opcional
        </p>
      )}
      <div className="mt-7">{children}</div>
    </div>
  );
}

function ListaOpciones({
  opciones,
  valor,
  onSelect,
  conOtro,
  otroActivo,
  onOtro,
}: {
  opciones: { key: string; etiqueta: string }[];
  valor: string;
  onSelect: (key: string) => void;
  conOtro?: boolean;
  otroActivo?: boolean;
  onOtro?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {opciones.map((o) => {
        const activa = valor === o.key;
        return (
          <Fila
            key={o.key}
            activa={activa}
            etiqueta={o.etiqueta}
            onClick={() => onSelect(o.key)}
          />
        );
      })}
      {conOtro && (
        <Fila
          activa={!!otroActivo}
          etiqueta="Otro"
          onClick={() => onOtro?.()}
        />
      )}
    </div>
  );
}

function MultiOpciones({
  opciones,
  valores,
  onToggle,
}: {
  opciones: Opcion[];
  valores: string[];
  onToggle: (key: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {opciones.map((o) => {
        const activa = valores.includes(o.key);
        return (
          <Fila
            key={o.key}
            activa={activa}
            etiqueta={o.etiqueta}
            cuadrada
            onClick={() => onToggle(o.key)}
          />
        );
      })}
    </div>
  );
}

function Fila({
  activa,
  etiqueta,
  onClick,
  cuadrada,
}: {
  activa: boolean;
  etiqueta: string;
  onClick: () => void;
  cuadrada?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-2xl border p-4 transition-all duration-200 active:scale-[0.99] ${
        activa
          ? "border-ink bg-soft shadow-[0_1px_0_0_#000]"
          : "border-line hover:border-muted/40"
      }`}
    >
      <span className="flex items-start gap-3">
        <span
          className={`mt-0.5 h-5 w-5 shrink-0 ${
            cuadrada ? "rounded-md" : "rounded-full"
          } border flex items-center justify-center text-[11px] ${
            activa
              ? "border-ink bg-ink text-paper"
              : "border-muted/40 text-transparent"
          }`}
        >
          ✓
        </span>
        <span className="text-[15px] leading-relaxed text-ink">{etiqueta}</span>
      </span>
    </button>
  );
}

function TarjetaImagen({
  opcion,
  seleccionada,
  onSelect,
  onZoom,
  sinEtiqueta,
}: {
  opcion: Opcion;
  seleccionada: boolean;
  onSelect: () => void;
  onZoom: () => void;
  sinEtiqueta?: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      className={`group relative block w-full text-left rounded-2xl border overflow-hidden transition-all duration-200 active:scale-[0.99] ${
        seleccionada ? "border-ink ring-2 ring-ink" : "border-line"
      }`}
    >
      <div className="relative aspect-[4/5] bg-soft">
        <Image
          src={opcion.img!}
          alt={sinEtiqueta ? "Opción de imagen" : opcion.etiqueta}
          fill
          sizes="(max-width: 640px) 50vw, 300px"
          className="object-cover"
        />
        {/* Botón de zoom */}
        <span
          role="button"
          tabIndex={0}
          aria-label="Ampliar imagen"
          onClick={(e) => {
            e.stopPropagation();
            onZoom();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              onZoom();
            }
          }}
          className="absolute top-2 right-2 z-10 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-base shadow-sm active:scale-90 transition-transform"
        >
          🔍
        </span>
        {/* Marca de selección */}
        {seleccionada && (
          <span className="absolute bottom-2 left-2 z-10 h-7 w-7 rounded-full bg-ink text-paper flex items-center justify-center text-sm">
            ✓
          </span>
        )}
      </div>
      {!sinEtiqueta && (
        <div className={`px-3 py-2 ${seleccionada ? "bg-soft" : "bg-paper"}`}>
          <span className="text-xs leading-tight font-medium text-ink">
            {opcion.etiqueta}
          </span>
        </div>
      )}
    </button>
  );
}
