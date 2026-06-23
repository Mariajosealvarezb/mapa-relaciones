/* ============================================================
   GUARDADO DE RESPUESTAS
   Dos modos automáticos:
     • Si Supabase está configurado (variables de entorno) → Supabase
     • Si no → archivo local .data/respuestas.json (para pruebas)
   El resto de la app usa estas funciones sin saber cuál se usa.
   ============================================================ */

import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import type { Respuesta } from "./encuesta-config";
import { getSupabase, TABLA } from "./supabase";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "respuestas.json");

// Genera un identificador aleatorio corto y seguro para la URL
// (sin datos personales). Ej: "k3f9ax7q2m"
export function generarToken(): string {
  const alfabeto = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = randomBytes(12);
  let id = "";
  for (let i = 0; i < bytes.length; i++) {
    id += alfabeto[bytes[i] % alfabeto.length];
  }
  return id;
}

/* ---------------- Guardar una respuesta nueva ---------------- */
export async function guardarRespuesta(
  datos: Omit<Respuesta, "id" | "created_at">
): Promise<Respuesta> {
  const registro: Respuesta = {
    id: generarToken(),
    created_at: new Date().toISOString(),
    ...datos,
  };

  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from(TABLA).insert(registro);
    if (error) throw new Error("Supabase insert: " + error.message);
    return registro;
  }

  // Modo local
  const lista = await leerLocal();
  lista.push(registro);
  await escribirLocal(lista);
  return registro;
}

/* ---------------- Obtener una respuesta por token ---------------- */
export async function obtenerRespuesta(id: string): Promise<Respuesta | null> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from(TABLA)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error("Supabase select: " + error.message);
    return (data as Respuesta) ?? null;
  }

  const lista = await leerLocal();
  return lista.find((r) => r.id === id) ?? null;
}

/* ---------------- Marcar lista prioritaria ---------------- */
export async function marcarListaPrioritaria(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from(TABLA)
      .update({ lista_prioritaria: true })
      .eq("id", id)
      .select("id");
    if (error) throw new Error("Supabase update: " + error.message);
    return (data?.length ?? 0) > 0;
  }

  const lista = await leerLocal();
  const r = lista.find((x) => x.id === id);
  if (!r) return false;
  r.lista_prioritaria = true;
  await escribirLocal(lista);
  return true;
}

/* ---------------- Listar todas (para el panel) ---------------- */
export async function listarRespuestas(): Promise<Respuesta[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from(TABLA)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Supabase list: " + error.message);
    return (data as Respuesta[]) ?? [];
  }

  const lista = await leerLocal();
  return lista.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

/* ---------------- Helpers del modo local ---------------- */
async function leerLocal(): Promise<Respuesta[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as Respuesta[];
  } catch {
    return [];
  }
}

async function escribirLocal(lista: Respuesta[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(lista, null, 2), "utf8");
}
