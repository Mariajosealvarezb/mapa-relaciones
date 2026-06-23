/* ============================================================
   CORREO DE BIENVENIDA (Resend)
   Envía a cada mujer el correo con el botón [VER MI MAPA]
   apuntando al link permanente de su mapa.
   Si Resend no está configurado, simplemente no envía (modo local).
   ============================================================ */

import { Resend } from "resend";
import { MAPA } from "./contenido-mapa";
import type { Respuesta } from "./encuesta-config";

const ip = (t: string, nombre: string) => t.replaceAll("{nombre}", nombre);

export async function enviarCorreoMapa(r: Respuesta): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[correo] Resend no configurado — se omite el envío.");
    return;
  }

  const from =
    process.env.EMAIL_FROM ||
    "María José Álvarez B. <info@mariajosealvarezb.com>";
  const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );
  const mapaUrl = `${appUrl}/mapa/${r.id}`;
  const c = MAPA.correo;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: r.correo,
    subject: ip(c.asunto, r.nombre),
    html: construirHtml(r.nombre, mapaUrl),
    text: construirTexto(r.nombre, mapaUrl),
  });

  if (error) {
    throw new Error("Resend: " + JSON.stringify(error));
  }
}

function construirHtml(nombre: string, mapaUrl: string): string {
  const c = MAPA.correo;
  const parrafos = c.parrafos
    .map(
      (p) =>
        `<p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#111111;">${ip(
          p,
          nombre
        )}</p>`
    )
    .join("");

  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f5f2;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5f2;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:40px 32px 8px;text-align:center;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:1px;color:#000000;">María José Álvarez B.</div>
        </td></tr>
        <tr><td style="padding:24px 32px 8px;font-family:Helvetica,Arial,sans-serif;">
          ${parrafos}
        </td></tr>
        <tr><td style="padding:8px 32px 8px;text-align:center;">
          <a href="${mapaUrl}" style="display:inline-block;background:#000000;color:#ffffff;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;padding:15px 34px;border-radius:999px;">${c.boton} →</a>
        </td></tr>
        <tr><td style="padding:24px 32px 0;font-family:Helvetica,Arial,sans-serif;">
          <p style="margin:0;font-size:16px;line-height:1.6;color:#111111;">${c.despedida}</p>
          <p style="margin:4px 0 0;font-family:Georgia,serif;font-size:17px;color:#000000;">${c.firma}</p>
        </td></tr>
        <tr><td style="padding:24px 32px 40px;font-family:Helvetica,Arial,sans-serif;">
          <p style="margin:0;font-size:13px;line-height:1.6;color:#6b6b6b;">${ip(
            c.posdata,
            nombre
          )}</p>
        </td></tr>
      </table>
      <p style="max-width:480px;margin:18px auto 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#9a9a9a;text-align:center;">
        Si el botón no funciona, copia este enlace:<br>${mapaUrl}
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}

function construirTexto(nombre: string, mapaUrl: string): string {
  const c = MAPA.correo;
  return [
    ...c.parrafos.map((p) => ip(p, nombre)),
    "",
    `${c.boton}: ${mapaUrl}`,
    "",
    c.despedida,
    c.firma,
    "",
    ip(c.posdata, nombre),
  ].join("\n");
}
