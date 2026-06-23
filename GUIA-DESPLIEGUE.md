# Guía para publicar tu app en internet

Lenguaje simple, paso a paso. Tómalo con calma; cada parte se hace una sola vez.

Resumen del camino:
**GitHub** (guarda el código) → **Vercel** (lo pone en internet) → **GoDaddy** (conecta tu dominio).

Tus cuentas de **Supabase** (base de datos) y **Resend** (correos) ya quedaron configuradas. ✅

---

## PARTE 1 — GitHub (guardar el código en la nube)

GitHub es como un Google Drive para código. Vercel lo lee de ahí.

1. Crea una cuenta en [github.com](https://github.com) (si ya la tienes, inicia sesión).
2. Arriba a la derecha, clic en **+** → **New repository**.
   - **Repository name:** `exito-mjab`
   - Déjalo en **Private** (privado).
   - **NO** marques "Add a README".
   - Clic en **Create repository**.
3. GitHub te mostrará unos comandos. **No los uses**; en vez de eso, dime el nombre
   de tu usuario de GitHub y yo te doy el comando exacto para subir el código (o lo
   subimos juntas desde la Terminal).

> Tu archivo de llaves secretas (`.env.local`) NO se sube — está protegido.

---

## PARTE 2 — Vercel (poner la app en internet, gratis)

1. Crea una cuenta en [vercel.com](https://vercel.com) usando **"Continue with GitHub"**
   (así quedan conectados).
2. En el panel de Vercel, clic en **Add New… → Project**.
3. Busca el repositorio `exito-mjab` y clic en **Import**.
4. Antes de dar Deploy, abre **Environment Variables** y agrega estas (una por una;
   copia los valores desde tu archivo `.env.local`):

   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | (tu valor) |
   | `SUPABASE_SERVICE_ROLE_KEY` | (tu valor) |
   | `RESEND_API_KEY` | (tu valor) |
   | `EMAIL_FROM` | `María José Álvarez B. <info@mariajosealvarezb.com>` |
   | `APP_URL` | `https://exito.mariajosealvarezb.com` |
   | `PANEL_PASSWORD` | (tu contraseña, elige una nueva y segura) |
   | `ANTHROPIC_API_KEY` | (opcional; déjala vacía si no usarás el diagnóstico aún) |

5. Clic en **Deploy**. Espera 1-2 minutos. Cuando termine, tendrás una dirección
   tipo `exito-mjab.vercel.app`. ¡Ya está en internet!

> ⚠️ Importante: en `APP_URL` pon ya tu dominio final (`https://exito.mariajosealvarezb.com`)
> para que el link del mapa en los correos apunte ahí.

---

## PARTE 3 — Conectar tu subdominio (GoDaddy)

Queremos que la app viva en **exito.mariajosealvarezb.com**.

**En Vercel:**
1. Tu proyecto → **Settings** → **Domains**.
2. Escribe `exito.mariajosealvarezb.com` → **Add**.
3. Vercel te mostrará un registro **CNAME** para agregar (algo como
   `cname.vercel-dns.com`). Déjalo a la vista.

**En GoDaddy:**
1. Entra a [godaddy.com](https://godaddy.com) → tu dominio `mariajosealvarezb.com`
   → **DNS** (Administrar DNS).
2. **Add New Record** (Agregar registro):
   - **Type:** CNAME
   - **Name:** `exito`
   - **Value:** el valor que te dio Vercel (ej. `cname.vercel-dns.com`)
   - **TTL:** 1 hora (o el que venga por defecto)
   - **Save**.
3. Vuelve a Vercel; en unos minutos (a veces hasta 1 hora) el dominio aparecerá como
   **Valid/Verified** ✅.

Listo: tu app vivirá en **https://exito.mariajosealvarezb.com** 🎉
Esa es la dirección que compartes en Instagram.

---

## PARTE 4 — Antes de lanzar (limpieza)

1. **Borra las respuestas de prueba** para empezar limpia:
   - Entra a [supabase.com](https://supabase.com) → tu proyecto → **Table Editor**
     → tabla `respuestas` → selecciona las filas de ejemplo → **Delete**.
   - (O pídeme que las borre yo).
2. Haz **una prueba real** desde tu celular en `exito.mariajosealvarezb.com`:
   encuesta → mapa → revisa que te llegó el correo con el botón que abre tu mapa.

---

## Cómo subir un cambio (cuando edites algo, ej. textos del mapa)

Cada vez que cambies algo en tu computador y lo quieras publicar:

1. En la Terminal, dentro de la carpeta del proyecto:
   ```
   git add -A
   git commit -m "Cambié unos textos"
   git push
   ```
2. Vercel lo detecta solo y vuelve a publicar en ~1 minuto. ✨

> Si prefieres, pídeme que lo suba yo cuando estemos trabajando juntas.

---

## Encender el diagnóstico con IA (cuando quieras)

1. Crea tu API key en [console.anthropic.com](https://console.anthropic.com)
   (carga un poco de saldo, ~$5).
2. En Vercel → Settings → Environment Variables → edita `ANTHROPIC_API_KEY`
   con tu llave → **Save**.
3. Deployments → último → **···** → **Redeploy**.

¡Y el botón "Generar diagnóstico" quedará activo!
