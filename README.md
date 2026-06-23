# Mapa interactivo · "Para dejar de depender emocionalmente del otro"

Encuesta de 11 pasos que entrega a cada mujer un **mapa personalizado** de 4
territorios sobre su dependencia emocional. Captura el correo (lead) y calienta
audiencia para la futura membresía.

Es un **clon** del mapa de ingresos (`exito.mariajosealvarezb.com`): mismo stack,
mismo Supabase y Resend, **tabla de datos separada** y copy/imágenes nuevas.

## Flujo
`/` (landing) → `/encuesta` (11 preguntas) → guarda + envía correo → `/mapa/{token}`
(mapa personalizado) → CTA membresía + Telegram. Panel privado en `/panel`.

## Personalización del mapa
- **P1 → {nombre}**: se teje en todos los territorios.
- **P4 → dolor (D1–D5)**: elige UNA línea en CADA territorio (las etiquetas D1–D5
  nunca se muestran). Si eligen "otro", el mapa usa la línea D1 como respaldo.
- **P3 → imagen → frase de identidad**: se devuelve textual en La Cima.

## Correr en local
```bash
npm run dev      # http://localhost:3000
```
Sin Supabase configurado, guarda en `.data/respuestas.json` (modo local de prueba).

## Editar textos (sin tocar lógica)
- Preguntas y opciones: `lib/encuesta-config.ts`
- Textos del mapa (4 territorios, correo, cierre): `lib/contenido-mapa.ts`
- Landing: `app/page.tsx`

## Variables de entorno (`.env.local`)
Ver `.env.example`. Reusa el mismo Supabase/Resend del mapa de ingresos.
`SUPABASE_TABLA=respuestas_relaciones` mantiene los datos separados.

## Antes de salir al aire — lo que falta de Majo
1. **Subdominio** definitivo (sugerido `relaciones.mariajosealvarezb.com`) → ponerlo en `APP_URL` en Vercel.
2. **4 imágenes** reales en `public/identidades/identidad-1..4.jpg` (hoy hay placeholders; ver `public/identidades/LEEME.txt`).
3. **Paleta de marca** (opcional): se ajusta en `app/globals.css`.
4. **Link de Telegram** y **destino del CTA membresía** en `lib/contenido-mapa.ts`.
5. Crear la **tabla** en Supabase: correr `supabase-setup.sql` en el SQL Editor.

## Deploy
Proyecto nuevo en Vercel (framework Next.js, ver `vercel.json`), apuntar el
subdominio, y cargar las variables de entorno. Guía general en `GUIA-DESPLIEGUE.md`.
