-- ============================================================
--  CONFIGURACIÓN DE LA BASE DE DATOS EN SUPABASE
--  Mapa de RELACIONES (tabla separada del mapa de ingresos)
--  Copia TODO esto y pégalo en: Supabase → SQL Editor → New query → Run
-- ============================================================

create table if not exists public.respuestas_relaciones (
  id                text primary key,
  created_at        timestamptz not null default now(),
  nombre            text not null,
  correo            text not null,
  consentimiento    boolean not null default false,
  identidad         text not null,            -- P3 (imagen) → frase_identidad
  dolor             text not null,            -- P4 → línea D1–D5 del mapa
  dolor_otro        text default '',
  unica_cosa        text not null,            -- P5
  unica_cosa_otro   text default '',
  nombre_membresia  text not null,            -- P6
  voz_cliente       text default '',          -- P7 (abierta)
  intentado         text[] default '{}',      -- P8 (multi)
  valor_recurrente  text[] default '{}',      -- P9 (multi)
  lista_prioritaria boolean not null default false,  -- P10
  precio            text default '',          -- P11 (opcional)
  -- Origen del tráfico (UTM / fuente)
  utm_source        text default '',
  utm_medium        text default '',
  utm_campaign      text default '',
  utm_content       text default '',
  utm_term          text default '',
  referrer          text default ''
);

-- Activar Row Level Security (la base queda PRIVADA por defecto).
alter table public.respuestas_relaciones enable row level security;

-- No creamos ninguna política para el público (anon).
-- Resultado: NADIE puede leer ni escribir con la llave pública.
-- Tu servidor usa la llave de servicio (service role), que pasa por
-- encima de RLS de forma segura. Solo el backend escribe y lee. ✓
