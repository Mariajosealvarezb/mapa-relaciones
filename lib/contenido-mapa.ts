/* ════════════════════════════════════════════════════════════════
   TEXTOS DEL MAPA — archivo editable
   Mapa de relaciones · "Para dejar de depender emocionalmente del otro"
   ────────────────────────────────────────────────────────────────
   María José: puedes corregir cualquier frase aquí.
   Reglas simples para no romper nada:
     • Edita SOLO el texto que está entre los acentos graves `...`
     • NO borres las llaves {nombre} ni {frase_identidad}: se reemplazan
       solos por el nombre de la persona y por la frase de la imagen que eligió.
     • Las "lineas" (d1..d5) son las versiones por DOLOR. La usuaria solo ve
       la frase de SU dolor; nunca ve las etiquetas d1..d5.
   ════════════════════════════════════════════════════════════════ */

export const MAPA = {
  // ---------- Portada del mapa (igual para todas) ----------
  encabezado: {
    eyebrow: `Un mapa para volver a ti`,
    titulo: `¿Cómo se ve el amor cuando te eliges a ti?`,
    subtitulo: `Tu mapa para dejar de depender y volver a ti`,
    // Texto de bienvenida (se teje con {nombre})
    bienvenida: [
      `Hola, {nombre}.`,
      `Lo que tienes enfrente no es una guía ni un test más. Es un mapa. Tu mapa.`,
      `En los próximos minutos vas a recorrer cuatro territorios que explican algo que probablemente ya sentías, pero no habías podido nombrar: por qué te pasa lo que te pasa en el amor.`,
      `Te adelanto el destino, para que no te asustes en el camino: esto no se trata de él. Se trata de ti. Y esa es, justamente, la parte que sí puedes cambiar.`,
      `Ve sin prisa. Lee como si te hablaras a ti misma. Y deja que el mapa te lleve de regreso a donde todo empieza: tú.`,
    ],
  },

  // ═══════════ TERRITORIO 1 · LA BASE — TU AUTOESTIMA ═══════════
  territorio1: {
    kicker: `La base`,
    titulo: `Tu autoestima`,
    cuerpo: [
      `Aquí empieza todo, {nombre}. No en él. En ti.`,
      `Lo que vives hoy en tus relaciones no habla de cuánto amas. Habla de cuánto crees merecer.`,
      `Porque el trato que aceptas tiene siempre el tamaño exacto del amor que te tienes. Nunca pides más de lo que, en el fondo, crees valer. Y cuando crees valer poco, terminas llamándole amor a quedarte donde te duele.`,
      `No dependes porque lo ames demasiado. Dependes porque aprendiste a quererte poco.`,
      `Esa es la raíz. Y es la mejor noticia de todo el mapa: si el problema empezara en él, no tendrías nada que hacer. Pero empieza en ti. Y eso —justo eso— es lo único que sí está en tus manos cambiar.`,
    ],
    lineas: {
      d1: `Por eso buscas en su aprobación la certeza que todavía no te das tú.`,
      d2: `Por eso la soledad te asusta tanto: no es quedarte sin él, es quedarte a solas con la mujer que aún no aprendiste a acompañar.`,
      d3: `Por eso vuelves: no extrañas tanto quién era él, extrañas quién creías ser cuando alguien te elegía.`,
      d4: `Por eso te encoges para caber en su vida: aprendiste que para que te quieran tienes que desaparecer un poco.`,
      d5: `Por eso comparas y vigilas: cuando no confías en tu propio valor, cualquier otra parece la amenaza.`,
    },
  },

  // ═══════════ TERRITORIO 2 · LA ESTRUCTURA — TUS LÍMITES Y PATRONES ═══════════
  territorio2: {
    kicker: `La estructura`,
    titulo: `Tus límites y tus patrones`,
    cuerpo: [
      `La dependencia no se sostiene sola. Se sostiene en dos cosas: los límites que no pones y un patrón que repites sin verlo.`,
      `El patrón es ese guion que se enciende solo. Callas para no incomodar. Cedes para no perderlo. Te explicas de más. Te haces pequeña y le llamas amor.`,
      `Lo más difícil del patrón no es romperlo. Es verlo. Porque mientras no tiene nombre, parece tu personalidad. Cuando tiene nombre, vuelve a ser una elección.`,
    ],
    movimiento: `Tu primer movimiento, esta semana: completa esta frase, en voz alta o por escrito:`,
    cita: `"Cuando tengo miedo de perder a alguien, yo suelo ______."`,
    cierre: [
      `Una sola línea. Sin adornarla, sin justificarla.`,
      `Esa frase es tu patrón. Y nombrarlo es la primera vez que dejas de obedecerlo en automático. Lo que se nombra, se puede elegir.`,
    ],
    lineas: {
      d1: `Tu patrón casi siempre suena a: "prefiero su aprobación antes que mi propia paz."`,
      d2: `Tu patrón casi siempre suena a: "me quedo aunque me lastime, con tal de no quedarme sola."`,
      d3: `Tu patrón casi siempre suena a: "sé que no me hace bien, pero vuelvo igual."`,
      d4: `Tu patrón casi siempre suena a: "digo que sí por fuera mientras por dentro grito que no."`,
      d5: `Tu patrón casi siempre suena a: "si no lo vigilo, lo pierdo."`,
    },
  },

  // ═══════════ TERRITORIO 3 · LA EXPANSIÓN — TUS VÍNCULOS ═══════════
  territorio3: {
    kicker: `La expansión`,
    titulo: `Tus vínculos`,
    cuerpo: [
      `Cuando vuelves a ti, también cambia la forma en que eliges, sostienes y sueltas.`,
      `Hay vínculos que te suman y vínculos que te cobran. Y durante mucho tiempo confundiste la intensidad con el amor: si dolía, pensabas, debía ser importante.`,
      `Pero un vínculo que te cuesta a ti misma no es amor, es dependencia. El amor que te hace bien no te pide desaparecer para caber en él.`,
      `Llévate esta pregunta. Úsala con quien quieras —pareja, ex, casi-algo, una amistad:`,
    ],
    cita: `"¿Esta relación me devuelve a mí o me aleja de mí?"`,
    cierre: [
      `No tienes que contestarla hoy. Solo deja que empiece a filtrar. Vas a notar que ya sabías la respuesta; solo te faltaba permiso para escucharla.`,
    ],
    lineas: {
      d1: `Pruébala con esa persona cuya aprobación pesa más que tu propia opinión.`,
      d2: `Pruébala con ese vínculo al que te aferras más por miedo al vacío que por amor.`,
      d3: `Pruébala con ese ex al que vuelves: ¿te devuelve a ti, o solo te aleja otra vez de ti?`,
      d4: `Pruébala con esa relación donde llevas tiempo diciendo que sí mientras te abandonas.`,
      d5: `Pruébala con ese vínculo donde vives en guardia: ¿el amor de verdad se siente así de inseguro?`,
    },
  },

  // ═══════════ TERRITORIO 4 · LA CIMA — TU VERSIÓN DE LA LIBERTAD ═══════════
  // Inserta {frase_identidad} (la frase ligada a la imagen que eligió en P3)
  territorio4: {
    kicker: `La cima`,
    titulo: `Tu versión de la libertad emocional`,
    cuerpoAntes: [
      `Llegaste a la cima, {nombre}. Y quiero que veas algo: aquí no te espera nadie nuevo. Te esperas tú.`,
      `Esta es la mujer que elegiste al empezar el mapa:`,
    ],
    // Aquí va, como cita destacada, la {frase_identidad}
    cuerpoDespues: [
      `No es una meta lejana. No es la versión de ti que existirá cuando por fin alguien te elija bien. Ya vive en ti. La reconociste porque la llevas dentro.`,
      `La libertad emocional no llega el día que encuentras a la persona correcta. Llega cuando dejas de necesitar que alguien te complete para sentirte entera.`,
      `Esa distancia entre quien eres hoy y ella no se cierra encontrando a alguien. Se cierra volviendo a ti, una elección a la vez.`,
    ],
    lineas: {
      d1: `Y ella ya no necesita que nadie le confirme cuánto vale: lo sabe desde adentro.`,
      d2: `Y ella ya no le teme a la soledad: descubrió que su mejor compañía es ella misma.`,
      d3: `Y ella ya no regresa a lo que la lastima: entendió que soltar también es una forma de quererse.`,
      d4: `Y ella ya no se abandona para que la quieran: pone límites y sigue siendo amada.`,
      d5: `Y ella ya no se compara ni vigila: confía, porque su valor no depende de nadie más.`,
    },
  },

  // ---------- Cierre del mapa (igual para todas) ----------
  fraseAncla: `Volver a ti nunca fue egoísmo. Fue el principio del amor.`,

  cierre: [
    `Este mapa fue tu primer paso de vuelta a casa, {nombre}.`,
    `Hoy viste la raíz, nombraste tu patrón y te llevaste una pregunta que va a cambiar la forma en que eliges. Eso ya es tuyo. Nadie te lo quita.`,
    `Pero ver el camino no es lo mismo que recorrerlo acompañada. Sostener este cambio —los días en que quieras volver al patrón viejo, en que el miedo grite más fuerte, en que dudes— es lo que estamos construyendo dentro de la membresía: un lugar para fortalecer tu autoestima de raíz y dejar de abandonarte, paso a paso y en comunidad.`,
    `Voy a abrir las puertas pronto, y quiero que las primeras en entrar sean mujeres como tú: las que ya decidieron volver a sí mismas.`,
  ],

  // Botón de lista prioritaria + confirmación
  boton: `Quiero ser de las primeras`,
  confirmacion: `Listo, {nombre} 🤍 Estás en la lista prioritaria. Te avisaré antes que a nadie, con condiciones especiales de fundadora.`,

  // Texto antes del enlace de Telegram + el enlace
  telegram: {
    intro: `Y mientras tanto, no te vayas lejos. Te espero en mi Telegram, donde comparto lo que no pongo en ningún otro lugar y donde voy a avisar primero cuando se abran las puertas.`,
    texto: `Unirme al Telegram de Majo`,
    url: `https://t.me/mariajosealvarez_betin`,
  },

  // ---------- Correo que recibe cada mujer ----------
  correo: {
    asunto: `{nombre}, tu mapa para volver a ti está listo 🤍`,
    parrafos: [
      `Hola {nombre},`,
      `Gracias por hacer este recorrido conmigo. Me quedo con todo lo que me contaste.`,
      `Como te prometí, aquí está tu regalo: tu mapa interactivo para dejar de depender emocionalmente y volver a ti, creado con tus propias respuestas. Guárdalo y vuelve a él cada vez que necesites recordar por dónde se empieza de verdad: por ti.`,
    ],
    boton: `VER MI MAPA`,
    despedida: `Con cariño,`,
    firma: `María José Álvarez B.`,
    posdata: `P.D. Estoy creando un espacio para sostener este cambio en el tiempo. Si pediste ser de las primeras, serás de las primeras en saberlo. 🤍`,
  },

  // ---------- MAPA GENERAL (uno solo para enviar a todas) ----------
  // Versión universal, sin nombre ni respuestas individuales. Vive en /regalo
  general: {
    bienvenida: [
      `Lo que tienes enfrente no es una guía ni un test más. Es un mapa para volver a ti.`,
      `Vas a recorrer cuatro territorios que explican algo que quizá ya sentías, pero no habías podido nombrar: por qué te pasa lo que te pasa en el amor.`,
      `Te adelanto el destino: esto no se trata de él. Se trata de ti. Y esa es, justamente, la parte que sí puedes cambiar.`,
    ],
    territorio1: [
      `Aquí empieza todo. No en él. En ti.`,
      `Lo que vives hoy en tus relaciones no habla de cuánto amas. Habla de cuánto crees merecer. El trato que aceptas tiene siempre el tamaño exacto del amor que te tienes.`,
      `No dependes porque lo ames demasiado. Dependes porque aprendiste a quererte poco. Esa es la raíz —y es lo único que sí está en tus manos cambiar.`,
    ],
    territorio2: [
      `La dependencia se sostiene en dos cosas: los límites que no pones y un patrón que repites sin verlo.`,
      `Lo más difícil del patrón no es romperlo. Es verlo. Porque mientras no tiene nombre, parece tu personalidad. Cuando tiene nombre, vuelve a ser una elección.`,
      `Tu primer movimiento, esta semana: completa esta frase, "Cuando tengo miedo de perder a alguien, yo suelo ______." Nombrarlo es la primera vez que dejas de obedecerlo en automático.`,
    ],
    territorio3: [
      `Cuando vuelves a ti, cambia la forma en que eliges, sostienes y sueltas.`,
      `Un vínculo que te cuesta a ti misma no es amor, es dependencia. El amor que te hace bien no te pide desaparecer para caber en él.`,
      `Llévate esta pregunta y úsala con quien quieras: "¿Esta relación me devuelve a mí o me aleja de mí?". Ya sabías la respuesta; solo te faltaba permiso para escucharla.`,
    ],
    territorio4: [
      `En la cima no te espera nadie nuevo. Te esperas tú.`,
      `La libertad emocional no llega el día que encuentras a la persona correcta. Llega cuando dejas de necesitar que alguien te complete para sentirte entera.`,
      `Esa distancia entre quien eres hoy y ella no se cierra encontrando a alguien. Se cierra volviendo a ti, una elección a la vez.`,
    ],
    fraseAncla: `Volver a ti nunca fue egoísmo. Fue el principio del amor.`,
    gancho: `Ver el camino no es lo mismo que recorrerlo acompañada. Sostener este cambio en el tiempo es lo que estamos construyendo dentro de la membresía: un lugar para fortalecer tu autoestima de raíz y dejar de abandonarte, paso a paso y en comunidad.`,
    boton: `Quiero ser de las primeras`,
    botonHref: `/`,
  },
} as const;
