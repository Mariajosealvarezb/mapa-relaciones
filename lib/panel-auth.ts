/* ============================================================
   ACCESO AL PANEL (contraseña)
   La contraseña vive en la variable de entorno PANEL_PASSWORD.
   Al entrar bien, se guarda una "ficha" (token) en una cookie
   segura del navegador; el panel comprueba esa ficha.
   ============================================================ */

import crypto from "crypto";
import { cookies } from "next/headers";

export const COOKIE_PANEL = "panel_session";

// Token derivado de la contraseña (no guardamos la contraseña en claro)
export function tokenEsperado(): string | null {
  const pass = process.env.PANEL_PASSWORD;
  if (!pass) return null;
  return crypto.createHash("sha256").update("mjab:" + pass).digest("hex");
}

export async function estaAutenticado(): Promise<boolean> {
  const esperado = tokenEsperado();
  if (!esperado) return false;
  const store = await cookies();
  return store.get(COOKIE_PANEL)?.value === esperado;
}
