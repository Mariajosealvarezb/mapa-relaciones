import { NextResponse } from "next/server";
import { guardarRespuesta } from "@/lib/storage";
import { enviarCorreoMapa } from "@/lib/email";
import { TABLA } from "@/lib/supabase";
import type {
  Respuesta,
  IdentidadKey,
  DolorKey,
  UnicaCosaKey,
  NombreKey,
  IntentadoKey,
  ValorKey,
  PrecioKey,
} from "@/lib/encuesta-config";

// Usar el entorno Node (necesario para escribir el archivo temporal)
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---- DIAGNÓSTICO TEMPORAL (borrar después) ----
export async function GET() {
  const url = process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const diag: Record<string, unknown> = {
    urlSet: !!url,
    urlLen: url.length,
    urlStart: url.slice(0, 18),
    urlEnd: url.slice(-12),
    keySet: !!key,
    keyLen: key.length,
    tabla: TABLA,
    resendSet: !!process.env.RESEND_API_KEY,
    appUrl: process.env.APP_URL || "",
  };
  try {
    const reg = await guardarRespuesta({
      nombre: "DIAG",
      correo: "diag@ejemplo.com",
      consentimiento: true,
      identidad: "1",
      dolor: "d1",
      dolor_otro: "",
      unica_cosa: "a",
      unica_cosa_otro: "",
      nombre_membresia: "a",
      voz_cliente: "",
      intentado: [],
      valor_recurrente: [],
      lista_prioritaria: false,
      precio: "",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_content: "",
      utm_term: "",
      referrer: "",
    });
    diag.insert = "ok";
    diag.id = reg.id;
  } catch (e) {
    diag.insert = "error";
    diag.error = e instanceof Error ? e.message : String(e);
  }
  return NextResponse.json(diag);
}

function texto(v: unknown, max = 4000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

// Limpia un arreglo de selección múltiple dejando solo llaves válidas
function lista(v: unknown, validas: readonly string[]): string[] {
  if (!Array.isArray(v)) return [];
  return [...new Set(v.filter((x) => typeof x === "string" && validas.includes(x)))];
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  // ---- Validaciones de los campos obligatorios ----
  const nombre = texto(body.nombre, 120);
  const correo = texto(body.correo, 200).toLowerCase();
  const consentimiento = body.consentimiento === true;

  if (!nombre) {
    return NextResponse.json({ error: "Falta tu nombre." }, { status: 400 });
  }
  if (!EMAIL_RE.test(correo)) {
    return NextResponse.json(
      { error: "El correo no parece válido." },
      { status: 400 }
    );
  }
  if (!consentimiento) {
    return NextResponse.json(
      { error: "Debes aceptar el consentimiento." },
      { status: 400 }
    );
  }

  const enLista = (l: readonly string[], v: unknown): boolean =>
    typeof v === "string" && l.includes(v);

  if (
    !enLista(["1", "2", "3", "4"], body.identidad) ||
    !enLista(["d1", "d2", "d3", "d4", "d5", "otro"], body.dolor) ||
    !enLista(["a", "b", "c", "d", "e", "otro"], body.unica_cosa) ||
    !enLista(["a", "b", "c"], body.nombre_membresia)
  ) {
    return NextResponse.json(
      { error: "Faltan respuestas obligatorias." },
      { status: 400 }
    );
  }

  // Precio: opcional. Si viene, debe ser válido; si no, queda vacío.
  const precio: PrecioKey = enLista(["27", "33", "47", "na"], body.precio)
    ? (body.precio as PrecioKey)
    : "";

  // ---- Construir el registro y guardarlo ----
  const datos: Omit<Respuesta, "id" | "created_at"> = {
    nombre,
    correo,
    consentimiento,
    identidad: body.identidad as IdentidadKey,
    dolor: body.dolor as DolorKey,
    dolor_otro: texto(body.dolor_otro),
    unica_cosa: body.unica_cosa as UnicaCosaKey,
    unica_cosa_otro: texto(body.unica_cosa_otro),
    nombre_membresia: body.nombre_membresia as NombreKey,
    voz_cliente: texto(body.voz_cliente),
    intentado: lista(body.intentado, [
      "terapia",
      "libros",
      "cursos",
      "sola",
      "otro",
    ]) as IntentadoKey[],
    valor_recurrente: lista(body.valor_recurrente, [
      "contenido",
      "comunidad",
      "vivo",
      "retos",
      "biblioteca",
    ]) as ValorKey[],
    lista_prioritaria: body.lista_prioritaria === true,
    precio,
    // Origen del tráfico
    utm_source: texto(body.utm_source, 200),
    utm_medium: texto(body.utm_medium, 200),
    utm_campaign: texto(body.utm_campaign, 200),
    utm_content: texto(body.utm_content, 200),
    utm_term: texto(body.utm_term, 200),
    referrer: texto(body.referrer, 300),
  };

  const registro = await guardarRespuesta(datos);

  // Enviar el correo con el link al mapa (si falla, no rompe el flujo)
  try {
    await enviarCorreoMapa(registro);
  } catch (e) {
    console.error("[correo] No se pudo enviar:", e);
  }

  return NextResponse.json({ token: registro.id });
}
