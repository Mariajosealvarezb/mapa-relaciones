import { NextResponse } from "next/server";
import { COOKIE_PANEL } from "@/lib/panel-auth";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_PANEL, "", { path: "/", maxAge: 0 });
  return res;
}
