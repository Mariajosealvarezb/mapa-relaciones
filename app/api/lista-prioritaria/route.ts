import { NextResponse } from "next/server";
import { marcarListaPrioritaria } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token : "";
  if (!token) {
    return NextResponse.json({ error: "Falta el token." }, { status: 400 });
  }

  const ok = await marcarListaPrioritaria(token);
  if (!ok) {
    return NextResponse.json({ error: "Mapa no encontrado." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
