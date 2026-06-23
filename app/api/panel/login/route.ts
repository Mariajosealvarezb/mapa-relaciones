import { NextResponse } from "next/server";
import { COOKIE_PANEL, tokenEsperado } from "@/lib/panel-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const esperada = process.env.PANEL_PASSWORD;
  if (!esperada) {
    return NextResponse.json(
      { error: "El panel no tiene contraseña configurada." },
      { status: 500 }
    );
  }

  if (body.password !== esperada) {
    return NextResponse.json(
      { error: "Contraseña incorrecta." },
      { status: 401 }
    );
  }

  const token = tokenEsperado()!;
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_PANEL, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });
  return res;
}
