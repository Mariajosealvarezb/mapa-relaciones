"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { DatosMapa } from "@/lib/mapa";

/* Destellos dorados deterministas (mismos en servidor y navegador) */
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260622);
const PARTICULAS = Array.from({ length: 46 }, () => ({
  l: rnd() * 100,
  t: rnd() * 100,
  s: 0.6 + rnd() * 2.4,
  d: rnd() * 4.5,
  dur: 2.6 + rnd() * 3.4,
}));

export default function MapaInteractivo({
  datos,
  token,
  yaEnLista = false,
}: {
  datos: DatosMapa;
  token?: string;
  yaEnLista?: boolean;
}) {
  const territorios = datos.territorios; // 1..4 (base → cima)
  const idxIntro = 0;
  const idxCierre = territorios.length + 1; // 5
  const totalSlides = territorios.length + 2; // 6

  const [activo, setActivo] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.55) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            setActivo(idx);
          }
        });
      },
      { threshold: [0.55] }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const irA = (i: number) =>
    refs.current[i]?.scrollIntoView({ behavior: "smooth" });
  const setRef = (i: number) => (el: HTMLElement | null) => {
    refs.current[i] = el;
  };

  const progreso = activo / (totalSlides - 1);

  return (
    <div className="fixed inset-0 bg-ink text-paper overflow-y-auto snap-y snap-mandatory sin-scrollbar">
      {/* Sendero (riel) que se dibuja a la izquierda */}
      <div className="pointer-events-none fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 h-[46vh] w-px bg-white/15 z-20">
        <div
          className="absolute top-0 left-0 w-px bg-white transition-[height] duration-700 ease-out"
          style={{ height: `${progreso * 100}%` }}
        />
        {territorios.map((t, i) => {
          const idx = i + 1;
          const pos = (idx / (totalSlides - 1)) * 100;
          const alcanzado = activo >= idx;
          return (
            <span
              key={t.n}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
                alcanzado ? "h-2 w-2 bg-white" : "h-1.5 w-1.5 bg-white/25"
              }`}
              style={{ left: "0px", top: `${pos}%` }}
            />
          );
        })}
      </div>

      {/* ---------- Slide 0 · Portada ---------- */}
      <section
        ref={setRef(idxIntro)}
        data-idx={idxIntro}
        className="relative min-h-[100dvh] snap-start snap-always flex flex-col items-center justify-center text-center px-8 py-16"
      >
        <Reveal show={activo === idxIntro} delay={0}>
          <Image
            src="/marca/logo-blanco.png"
            alt="María José Álvarez B."
            width={8001}
            height={1058}
            priority
            className="w-[150px] h-auto mx-auto"
          />
        </Reveal>
        <Reveal show={activo === idxIntro} delay={150}>
          <p className="text-[11px] tracking-[0.35em] uppercase text-white/50 mt-10">
            {datos.eyebrow}
          </p>
        </Reveal>
        <Reveal show={activo === idxIntro} delay={300}>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight mt-4 max-w-md">
            {datos.titulo}
          </h1>
        </Reveal>
        <div className="mt-7 max-w-sm space-y-3">
          {datos.bienvenida.map((p, j) => (
            <Reveal key={j} show={activo === idxIntro} delay={500 + j * 180}>
              <p className="text-white/80 text-[15px] leading-relaxed">{p}</p>
            </Reveal>
          ))}
        </div>
        <Reveal
          show={activo === idxIntro}
          delay={500 + datos.bienvenida.length * 180 + 100}
        >
          <button
            onClick={() => irA(1)}
            className="mt-10 inline-flex items-center justify-center rounded-full bg-paper px-9 py-4 text-ink text-base font-medium transition-transform duration-200 active:scale-95"
          >
            Comenzar el recorrido
          </button>
          <p className="mt-6 text-white/40 text-xs animate-pulse">
            Desliza hacia arriba ↑
          </p>
        </Reveal>
      </section>

      {/* ---------- Slides de territorios ---------- */}
      {territorios.map((t, i) => {
        const idx = i + 1;
        const esCima = t.n === 4;
        const siguiente = idx + 1;
        return (
          <section
            key={t.n}
            ref={setRef(idx)}
            data-idx={idx}
            className="relative min-h-[100dvh] snap-start snap-always flex flex-col justify-center px-7 py-16 overflow-hidden"
          >
            {esCima && <CieloCima visible={activo === idx} />}

            <div className="relative z-10 max-w-xl mx-auto w-full">
              <Reveal show={activo === idx} delay={100}>
                <p className="text-[11px] tracking-[0.3em] uppercase text-white/45">
                  {esCima ? "★ " : `0${t.n} · `}
                  {t.kicker}
                </p>
              </Reveal>
              <Reveal show={activo === idx} delay={250}>
                <h2 className="font-display text-[28px] sm:text-4xl leading-tight mt-3">
                  {t.titulo}
                </h2>
              </Reveal>
              <div className="mt-6 space-y-4">
                {t.bloques.map((b, j) => (
                  <Reveal key={j} show={activo === idx} delay={450 + j * 200}>
                    {b.tipo === "cita" ? (
                      <p className="font-display italic text-xl sm:text-2xl leading-snug text-white border-l-2 border-white/40 pl-4 py-1">
                        {b.texto}
                      </p>
                    ) : b.tipo === "linea" ? (
                      <p className="text-[15px] sm:text-base leading-relaxed text-white font-medium border-l-2 border-[#ecd3a0] pl-4">
                        {b.texto}
                      </p>
                    ) : (
                      <p className="text-white/85 text-[15px] sm:text-base leading-relaxed">
                        {b.texto}
                      </p>
                    )}
                  </Reveal>
                ))}
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => irA(siguiente)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3 text-paper text-sm font-medium transition-all duration-200 active:scale-95 hover:border-white"
                >
                  {esCima ? "Ver tu cierre" : "Continuar"} ↓
                </button>
              </div>
            </div>
          </section>
        );
      })}

      {/* ---------- Slide final · Cierre ---------- */}
      <section
        ref={setRef(idxCierre)}
        data-idx={idxCierre}
        className="relative min-h-[100dvh] snap-start snap-always flex flex-col items-center justify-center text-center px-8 py-16"
      >
        <div className="max-w-md mx-auto w-full">
          <Reveal show={activo === idxCierre} delay={100}>
            <div className="mx-auto w-10 border-t border-white/30" />
          </Reveal>
          <Reveal show={activo === idxCierre} delay={250}>
            <p className="font-display italic text-2xl sm:text-[30px] leading-snug mt-8">
              “{datos.fraseAncla}”
            </p>
          </Reveal>
          <div className="mt-8 space-y-3 text-left">
            {datos.ganchoFinal.map((p, j) => (
              <Reveal key={j} show={activo === idxCierre} delay={450 + j * 180}>
                <p className="text-white/80 text-[15px] leading-relaxed">{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal show={activo === idxCierre} delay={750}>
            {token ? (
              <BotonPrioritaria
                token={token}
                texto={datos.boton}
                confirmacion={datos.confirmacion}
                yaEnLista={yaEnLista}
              />
            ) : (
              <a
                href={datos.botonHref || "/"}
                className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-paper px-8 py-4 text-ink text-base font-semibold transition-all duration-200 active:scale-[0.98]"
              >
                {datos.boton}
              </a>
            )}
          </Reveal>
          <Reveal show={activo === idxCierre} delay={900}>
            <p className="text-white/65 text-[13px] leading-relaxed mt-8">
              {datos.telegram.intro}
            </p>
            <a
              href={datos.telegram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-white/90 underline underline-offset-4 decoration-white/30 hover:decoration-white hover:text-white transition-colors"
            >
              {datos.telegram.texto} →
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* ---------- Revelado delicado (fade + leve subida) ---------- */
function Reveal({
  show,
  delay = 0,
  children,
}: {
  show: boolean;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`transition-all duration-700 ease-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
      style={{ transitionDelay: show ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

/* ---------- Cielo de destellos dorados (clímax de la cima) ---------- */
function CieloCima({ visible }: { visible: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Resplandor cálido detrás del título */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[60vh] w-[60vh] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(233,203,139,0.10) 0%, rgba(233,203,139,0) 65%)",
        }}
      />
      {PARTICULAS.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.l}%`,
            top: `${p.t}%`,
            width: `${p.s}px`,
            height: `${p.s}px`,
            backgroundColor: "#ecd3a0",
            boxShadow: "0 0 6px 1px rgba(236,211,160,0.65)",
            animation: visible
              ? `twinkle ${p.dur}s ease-in-out ${p.d}s infinite`
              : "none",
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Botón de lista prioritaria (invertido: blanco) ---------- */
function BotonPrioritaria({
  token,
  texto,
  confirmacion,
  yaEnLista,
}: {
  token: string;
  texto: string;
  confirmacion: string;
  yaEnLista: boolean;
}) {
  const [estado, setEstado] = useState<"idle" | "cargando" | "listo">(
    yaEnLista ? "listo" : "idle"
  );
  const [error, setError] = useState("");

  async function unirse() {
    setEstado("cargando");
    setError("");
    try {
      const res = await fetch("/api/lista-prioritaria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) throw new Error();
      setEstado("listo");
    } catch {
      setError("No pudimos guardarlo. Inténtalo de nuevo.");
      setEstado("idle");
    }
  }

  if (estado === "listo") {
    return (
      <div className="mt-10 rounded-2xl border border-white/25 bg-white/5 p-6">
        <p className="text-[15px] leading-relaxed text-white">{confirmacion}</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <button
        onClick={unirse}
        disabled={estado === "cargando"}
        className="w-full inline-flex items-center justify-center rounded-full bg-paper px-8 py-4 text-ink text-base font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
      >
        {estado === "cargando" ? "Guardando…" : texto}
      </button>
      {error && <p className="text-sm text-[#ff8a8a] mt-3">{error}</p>}
    </div>
  );
}
