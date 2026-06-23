/* ============================================================
   CONFIGURACIÓN DE LA ENCUESTA — fuente única de la verdad
   Mapa de relaciones · "Para dejar de depender emocionalmente del otro"
   Estos textos los usan tanto la encuesta como el panel.
   (Los textos del MAPA viven aparte, en contenido-mapa.ts)
   ============================================================ */

// ---- Llaves (identificadores cortos de cada opción) ----
export type IdentidadKey = "1" | "2" | "3" | "4";
export type DolorKey = "d1" | "d2" | "d3" | "d4" | "d5" | "otro";
export type UnicaCosaKey = "a" | "b" | "c" | "d" | "e" | "otro";
export type NombreKey = "a" | "b" | "c";
export type IntentadoKey = "terapia" | "libros" | "cursos" | "sola" | "otro";
export type ValorKey =
  | "contenido"
  | "comunidad"
  | "vivo"
  | "retos"
  | "biblioteca";
export type PrecioKey = "27" | "33" | "47" | "na" | "";

export type Opcion = {
  key: string;
  etiqueta: string;
  texto?: string; // frase ligada (P3) o texto largo de la opción
  img?: string;
};

// ---- PREGUNTA 3 · Identidad (imagen) → alimenta {frase_identidad} ----
// La mujer NO ve el texto: solo elige la imagen. La frase queda guardada
// y se devuelve textual en La Cima del mapa.
export const IDENTIDADES: Opcion[] = [
  {
    key: "1",
    etiqueta: "Mujer sola en la suite (bata, rosas, champán)",
    texto: "Conmigo, ya estoy completa.",
    img: "/identidades/identidad-1.jpg",
  },
  {
    key: "2",
    etiqueta: "Pareja en pasión junto a la piscina",
    texto: "Sé lo que valgo y dejé de negociarlo.",
    img: "/identidades/identidad-2.jpg",
  },
  {
    key: "3",
    etiqueta: "La boda (novia y novio en el altar)",
    texto: "Cada vez que me elijo, vuelvo a casa.",
    img: "/identidades/identidad-3.jpg",
  },
  {
    key: "4",
    etiqueta: "Pareja con cariño en la mesa del café",
    texto: "Amo sin abandonarme.",
    img: "/identidades/identidad-4.jpg",
  },
];

// ---- PREGUNTA 4 · Su dolor → selecciona la línea D1–D5 en cada territorio ----
export const DOLORES: Opcion[] = [
  {
    key: "d1",
    etiqueta:
      "Necesito su aprobación para estar tranquila; si él no está bien conmigo, yo tampoco.",
  },
  {
    key: "d2",
    etiqueta:
      "Me da miedo quedarme sola, así que aguanto más de lo que debería.",
  },
  {
    key: "d3",
    etiqueta:
      "No logro soltar: vuelvo una y otra vez, aunque sepa que no me hace bien.",
  },
  {
    key: "d4",
    etiqueta:
      "Complazco tanto para que me quieran que termino abandonándome a mí misma.",
  },
  {
    key: "d5",
    etiqueta:
      "Los celos y la inseguridad no me dejan en paz; comparo y dudo todo el tiempo.",
  },
];

// ---- PREGUNTA 5 · La única cosa a resolver ----
export const UNICA_COSA: Opcion[] = [
  { key: "a", etiqueta: "Dejar de depender de alguien para sentirme bien." },
  { key: "b", etiqueta: "Perder el miedo a quedarme sola." },
  { key: "c", etiqueta: "Soltar de una vez lo que me hace daño y no volver." },
  {
    key: "d",
    etiqueta: "Poner límites y dejar de complacer para que me quieran.",
  },
  { key: "e", etiqueta: "Confiar en mí, sin celos ni comparaciones." },
];

// ---- PREGUNTA 6 · Nombre de la membresía ----
export const NOMBRES_MEMBRESIA: Opcion[] = [
  { key: "a", etiqueta: "Autoestima de Mujer Libre" },
  { key: "b", etiqueta: "Autoestima para Amar sin Depender" },
  { key: "c", etiqueta: "Autoestima para Volver a Ti" },
];

// ---- PREGUNTA 8 · Qué has intentado antes (multi-selección) ----
export const INTENTADO: Opcion[] = [
  { key: "terapia", etiqueta: "Terapia" },
  { key: "libros", etiqueta: "Libros y podcasts" },
  { key: "cursos", etiqueta: "Cursos o talleres" },
  { key: "sola", etiqueta: "Sola, todavía nada" },
  { key: "otro", etiqueta: "Otro" },
];

// ---- PREGUNTA 9 · Qué te haría quedarte (multi-selección) ----
export const VALOR_RECURRENTE: Opcion[] = [
  { key: "contenido", etiqueta: "Contenido nuevo cada semana" },
  { key: "comunidad", etiqueta: "Comunidad y acompañamiento" },
  { key: "vivo", etiqueta: "Encuentros en vivo" },
  { key: "retos", etiqueta: "Retos y prácticas guiadas" },
  { key: "biblioteca", etiqueta: "Biblioteca de recursos" },
];

// ---- PREGUNTA 10 · Lista prioritaria (Sí/No → booleano) ----
export const LISTA_OPCIONES: { key: "si" | "no"; etiqueta: string }[] = [
  { key: "si", etiqueta: "Sí, quiero ser de las primeras." },
  { key: "no", etiqueta: "Por ahora solo quiero mi mapa." },
];

// ---- PREGUNTA 11 · Cuota mensual justa (precio, opcional) ----
export const PRECIOS: Opcion[] = [
  { key: "27", etiqueta: "$27 al mes" },
  { key: "33", etiqueta: "$33 al mes" },
  { key: "47", etiqueta: "$47 al mes" },
  { key: "na", etiqueta: "Prefiero no decir" },
];

// ---- Textos de cabecera de cada pregunta (también usados por el panel) ----
export const PREGUNTAS = {
  p1: {
    titulo: "Antes de empezar, ¿cómo te llamas?",
    sub: "Quiero hablarte por tu nombre en todo el recorrido.",
  },
  p2: {
    titulo: "¿A dónde te envío tu mapa cuando lo termines?",
    sub: "",
  },
  p3: {
    titulo: "No empieces pensando en él. Empieza por ti.",
    sub: "¿Con qué imagen te sientes más identificada de cómo quieres que se vea tu vida amorosa?",
  },
  p4: {
    titulo:
      "Seamos honestas, solo tú y yo. ¿Qué es lo que más te pesa hoy en el amor?",
    sub: "Elige lo que más se parezca a ti ahora mismo.",
  },
  p5: {
    titulo:
      "Si esta membresía pudiera ayudarte a resolver UNA sola cosa en los próximos meses, ¿qué elegirías?",
    sub: "Quédate con la que más lo cambiaría todo para ti.",
  },
  p6: {
    titulo:
      "Estoy creando un espacio para sostener todo esto en el tiempo. Si tuviera que ponerle nombre, ¿con cuál te sientes más identificada?",
    sub: "",
  },
  p7: {
    titulo:
      "Una cosa más, y esta es solo para ti. Si esto funcionara de verdad, ¿qué te gustaría poder decir de ti dentro de un año?",
    sub: "Escríbelo como te salga, aunque sean dos líneas. No hay forma incorrecta de decirlo.",
  },
  p8: {
    titulo:
      "Antes de este mapa, ya lo habías intentado de otras formas. ¿Por dónde has pasado?",
    sub: "No hay respuesta correcta. Puedes elegir varias.",
  },
  p9: {
    titulo:
      "Imagina un espacio para sostener este cambio, no un día, sino mes a mes. ¿Qué te haría volver cada vez?",
    sub: "Puedes elegir varias.",
  },
  p10: {
    titulo:
      "Ese espacio abre pronto, y las primeras tendrán un lugar especial. ¿Quieres ser de las primeras en entrar?",
    sub: "",
  },
  p11: {
    titulo:
      "Última, y puedes saltarla si quieres. Si este espacio te acompañara cada mes, ¿cuál se te haría una cuota mensual justa?",
    sub: "Esto no es un compromiso ni una compra: solo me ayuda a hacerlo accesible para mujeres como tú.",
  },
} as const;

export const CONSENTIMIENTO_TEXTO =
  "Sí, quiero recibir mi mapa y los correos de Majo.";

export const CONSENTIMIENTO_NOTA =
  "Te escribiré con cosas que de verdad te sirvan para volver a ti. Nada de spam, y puedes salirte cuando quieras.";

// ---- Origen del tráfico (UTM / fuente) ----
export type Fuente = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  referrer: string;
};

export const FUENTE_VACIA: Fuente = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  utm_term: "",
  referrer: "",
};

// ---- Forma de una respuesta guardada ----
export type Respuesta = {
  id: string; // token aleatorio para el link del mapa
  created_at: string; // ISO
  nombre: string;
  correo: string;
  consentimiento: boolean;
  identidad: IdentidadKey; // P3 (imagen) → frase_identidad
  dolor: DolorKey; // P4 → línea D1–D5 del mapa
  dolor_otro: string; // P4 "otro" (opcional)
  unica_cosa: UnicaCosaKey; // P5
  unica_cosa_otro: string; // P5 "otro" (opcional)
  nombre_membresia: NombreKey; // P6
  voz_cliente: string; // P7 (texto abierto, opcional)
  intentado: IntentadoKey[]; // P8 (multi)
  valor_recurrente: ValorKey[]; // P9 (multi)
  lista_prioritaria: boolean; // P10 (Sí/No)
  precio: PrecioKey; // P11 (opcional)
  // Origen del tráfico
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  referrer: string;
};

// Busca el texto largo (o etiqueta) de una opción por su llave
export function textoDe(opciones: Opcion[], key: string): string {
  const o = opciones.find((x) => x.key === key);
  return o?.texto ?? o?.etiqueta ?? "";
}

// Busca solo la etiqueta de una opción por su llave
export function etiquetaDe(opciones: Opcion[], key: string): string {
  return opciones.find((x) => x.key === key)?.etiqueta ?? key;
}
