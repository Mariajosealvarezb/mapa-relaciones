/* ============================================================
   ENSAMBLA EL MAPA PERSONALIZADO
   Toma una respuesta y devuelve los textos ya personalizados,
   listos para mostrar (con {nombre} y {frase_identidad} reemplazados,
   y la línea D1–D5 del dolor elegido en cada territorio).
   ============================================================ */

import { MAPA } from "./contenido-mapa";
import { IDENTIDADES, textoDe, type Respuesta, type DolorKey } from "./encuesta-config";

// Reemplaza las llaves por los valores reales
function interpolar(
  texto: string,
  vars: { nombre: string; frase_identidad: string }
): string {
  return texto
    .replaceAll("{nombre}", vars.nombre)
    .replaceAll("{frase_identidad}", vars.frase_identidad);
}

// Bloques que componen cada territorio (orden de aparición)
export type Bloque =
  | { tipo: "parrafo"; texto: string }
  | { tipo: "cita"; texto: string } // ejercicio / frase de identidad
  | { tipo: "linea"; texto: string }; // línea personalizada por dolor (destacada)

export type Territorio = {
  n: number;
  kicker: string;
  titulo: string;
  bloques: Bloque[];
};

export type DatosMapa = {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  bienvenida: string[];
  territorios: Territorio[]; // en orden 1..4 (base → cima)
  fraseAncla: string;
  ganchoFinal: string[];
  boton: string;
  confirmacion: string;
  telegram: { intro: string; texto: string; url: string };
  botonHref?: string; // solo en el mapa general (link en vez de guardar en lista)
};

// Las líneas válidas del mapa son d1..d5. Si eligió "otro", usamos d1.
function lineaDolor(
  lineas: Record<"d1" | "d2" | "d3" | "d4" | "d5", string>,
  dolor: DolorKey
): string {
  const k = dolor === "otro" ? "d1" : dolor;
  return lineas[k];
}

export function construirMapa(r: Respuesta): DatosMapa {
  const fraseIdentidad = textoDe(IDENTIDADES, r.identidad);
  const vars = { nombre: r.nombre, frase_identidad: fraseIdentidad };
  const ip = (t: string) => interpolar(t, vars);
  const P = (texto: string): Bloque => ({ tipo: "parrafo", texto: ip(texto) });
  const C = (texto: string): Bloque => ({ tipo: "cita", texto: ip(texto) });
  const L = (texto: string): Bloque => ({ tipo: "linea", texto: ip(texto) });

  const t1 = MAPA.territorio1;
  const t2 = MAPA.territorio2;
  const t3 = MAPA.territorio3;
  const t4 = MAPA.territorio4;

  return {
    eyebrow: MAPA.encabezado.eyebrow,
    titulo: MAPA.encabezado.titulo,
    subtitulo: MAPA.encabezado.subtitulo,
    bienvenida: MAPA.encabezado.bienvenida.map(ip),
    territorios: [
      {
        n: 1,
        kicker: t1.kicker,
        titulo: t1.titulo,
        bloques: [...t1.cuerpo.map(P), L(lineaDolor(t1.lineas, r.dolor))],
      },
      {
        n: 2,
        kicker: t2.kicker,
        titulo: t2.titulo,
        bloques: [
          ...t2.cuerpo.map(P),
          P(t2.movimiento),
          C(t2.cita),
          ...t2.cierre.map(P),
          L(lineaDolor(t2.lineas, r.dolor)),
        ],
      },
      {
        n: 3,
        kicker: t3.kicker,
        titulo: t3.titulo,
        bloques: [
          ...t3.cuerpo.map(P),
          C(t3.cita),
          ...t3.cierre.map(P),
          L(lineaDolor(t3.lineas, r.dolor)),
        ],
      },
      {
        n: 4,
        kicker: t4.kicker,
        titulo: t4.titulo,
        bloques: [
          ...t4.cuerpoAntes.map(P),
          C(fraseIdentidad), // {frase_identidad} como cita destacada
          ...t4.cuerpoDespues.map(P),
          L(lineaDolor(t4.lineas, r.dolor)),
        ],
      },
    ],
    fraseAncla: MAPA.fraseAncla,
    ganchoFinal: MAPA.cierre.map(ip),
    boton: MAPA.boton,
    confirmacion: ip(MAPA.confirmacion),
    telegram: {
      intro: MAPA.telegram.intro,
      texto: MAPA.telegram.texto,
      url: MAPA.telegram.url,
    },
  };
}

// Mapa GENERAL: uno solo para enviar a todas (sin nombre ni respuestas).
export function construirMapaGeneral(): DatosMapa {
  const g = MAPA.general;
  const P = (texto: string): Bloque => ({ tipo: "parrafo", texto });

  return {
    eyebrow: MAPA.encabezado.eyebrow,
    titulo: MAPA.encabezado.titulo,
    subtitulo: MAPA.encabezado.subtitulo,
    bienvenida: [...g.bienvenida],
    territorios: [
      { n: 1, kicker: MAPA.territorio1.kicker, titulo: MAPA.territorio1.titulo, bloques: g.territorio1.map(P) },
      { n: 2, kicker: MAPA.territorio2.kicker, titulo: MAPA.territorio2.titulo, bloques: g.territorio2.map(P) },
      { n: 3, kicker: MAPA.territorio3.kicker, titulo: MAPA.territorio3.titulo, bloques: g.territorio3.map(P) },
      { n: 4, kicker: MAPA.territorio4.kicker, titulo: MAPA.territorio4.titulo, bloques: g.territorio4.map(P) },
    ],
    fraseAncla: g.fraseAncla,
    ganchoFinal: [g.gancho],
    boton: g.boton,
    confirmacion: "",
    telegram: {
      intro: MAPA.telegram.intro,
      texto: MAPA.telegram.texto,
      url: MAPA.telegram.url,
    },
    botonHref: g.botonHref,
  };
}
