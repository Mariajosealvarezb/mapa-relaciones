import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { estaAutenticado } from "@/lib/panel-auth";
import { listarRespuestas } from "@/lib/storage";
import { DOLORES } from "@/lib/encuesta-config";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST() {
  // Solo la dueña del panel (con sesión iniciada)
  if (!(await estaAutenticado())) {
    return NextResponse.json({ error: "No autorizada." }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Falta la API key de Anthropic. Agrégala en .env.local (ANTHROPIC_API_KEY) para activar el diagnóstico.",
      },
      { status: 503 }
    );
  }

  const respuestas = await listarRespuestas();

  // Reunir todas las respuestas abiertas
  const bloques: string[] = [];
  for (const r of respuestas) {
    const partes: string[] = [];
    if (r.voz_cliente?.trim())
      partes.push(`· "¿Qué te gustaría decir de ti dentro de un año?": ${r.voz_cliente.trim()}`);
    if (r.dolor_otro?.trim())
      partes.push(`· Su dolor, con sus palabras: ${r.dolor_otro.trim()}`);
    if (r.unica_cosa_otro?.trim())
      partes.push(`· La única cosa a resolver (otro): ${r.unica_cosa_otro.trim()}`);
    if (partes.length) bloques.push(`[${r.nombre}]\n${partes.join("\n")}`);
  }

  if (bloques.length === 0) {
    return NextResponse.json({
      reporte:
        "Todavía no hay respuestas abiertas suficientes para generar un diagnóstico. Vuelve cuando tengas algunas. 🤍",
    });
  }

  // Conteo del dolor principal (P4) como contexto
  const conteoDolor = DOLORES.map((d) => {
    const n = respuestas.filter((r) => r.dolor === d.key).length;
    return `- ${d.etiqueta}: ${n}`;
  });
  const nOtro = respuestas.filter((r) => r.dolor === "otro").length;
  if (nOtro) conteoDolor.push(`- Otro: ${nOtro}`);

  const system = `Eres una analista experta en investigación de audiencias y mensajes de marketing para una membresía dirigida a mujeres hispanohablantes de Latinoamérica que quieren dejar de depender emocionalmente en sus relaciones y fortalecer su autoestima. La tesis de la marca: la dependencia emocional no se resuelve consiguiendo a la persona correcta, sino volviendo a una misma y fortaleciendo la autoestima de raíz. Escribe SIEMPRE en español, en un tono cálido pero profesional y accionable. No inventes datos: básate solo en lo que dicen las respuestas.`;

  const prompt = `A continuación tienes las respuestas ABIERTAS de una encuesta a la comunidad (${bloques.length} mujeres respondieron con sus palabras). También el conteo de su "dolor principal" elegido.

== CONTEO DEL DOLOR PRINCIPAL (pregunta 4) ==
${conteoDolor.join("\n")}

== RESPUESTAS ABIERTAS ==
${bloques.join("\n\n")}

Genera un INFORME claro y bien estructurado en Markdown, con estas secciones exactas:

## 1. Dolores más repetidos
Lista los dolores/temores/deseos que más se repiten en el amor y las relaciones, con una idea de su frecuencia.

## 2. Palabras y frases exactas de tu audiencia
Citas TEXTUALES (entre comillas) de las palabras y frases reales que usan, agrupadas por tema. Sirven para copiar y pegar en la comunicación de la membresía.

## 3. Segmentos naturales
Los 2-4 grupos o perfiles que detectes entre las respuestas, con un nombre corto para cada uno y qué los caracteriza.

## 4. Recomendaciones de mensajes
3-6 ideas concretas de mensajes/ángulos para la membresía, basadas en lo anterior. Cada una breve y lista para usar.

Sé concreta y útil. Si algo no tiene suficiente evidencia, dilo con honestidad.`;

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 6000,
      thinking: { type: "adaptive" },
      output_config: { effort: "high" },
      system,
      messages: [{ role: "user", content: prompt }],
    });

    const reporte = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return NextResponse.json({ reporte });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    console.error("[diagnóstico]", e);
    return NextResponse.json(
      { error: "No se pudo generar el diagnóstico: " + msg },
      { status: 500 }
    );
  }
}
