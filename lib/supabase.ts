/* ============================================================
   CLIENTE DE SUPABASE (solo servidor)
   Usa la llave de servicio (service role), que SOLO vive en el
   servidor. Nunca se expone al navegador.
   Si no hay credenciales configuradas, devuelve null y la app
   usa el guardado local (para poder probar sin cuenta todavía).
   ============================================================ */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cliente: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null; // sin configurar → modo local

  if (!cliente) {
    cliente = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return cliente;
}

// Tabla propia del mapa de RELACIONES (separada del mapa de ingresos,
// aunque vivan en el mismo proyecto de Supabase). Se puede sobreescribir
// con la variable de entorno SUPABASE_TABLA.
export const TABLA = process.env.SUPABASE_TABLA || "respuestas_relaciones";
