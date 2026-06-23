import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-between px-6 py-10 sm:py-16">
      {/* Logo */}
      <header className="w-full flex justify-center pt-2">
        <Image
          src="/marca/logo-negro.png"
          alt="María José Álvarez B."
          width={8001}
          height={1058}
          priority
          className="w-[220px] sm:w-[260px] h-auto"
        />
      </header>

      {/* Contenido central */}
      <section className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
        <p className="animate-fade-in text-xs tracking-[0.25em] uppercase text-muted mb-6">
          Co-creando la membresía
        </p>

        <h1 className="animate-fade-in-up font-display text-4xl sm:text-5xl leading-[1.1] text-ink">
          ¿Cómo se ve el amor cuando te eliges a ti?
        </h1>

        <p className="animate-fade-in-up text-muted text-base leading-relaxed mt-6">
          Gracias por ser parte de la creación de esta membresía. A continuación
          podrás contarme cómo vives hoy el amor y tus relaciones, y ayudarme a
          elegir algunos elementos de esta nueva etapa: nombre, contenido y
          mensaje. Al terminar, recibes tu mapa personalizado para volver a ti.
        </p>

        <Link
          href="/encuesta"
          className="animate-fade-in-up mt-10 inline-flex items-center justify-center rounded-full bg-ink px-9 py-4 text-paper text-base font-medium transition-transform duration-200 active:scale-[0.97] hover:opacity-90"
        >
          Comenzar
        </Link>

        <p className="text-xs text-muted mt-5">
          Toma menos de 3 minutos · Tus respuestas son confidenciales
        </p>
      </section>

      {/* Pie */}
      <footer className="text-center text-[11px] text-muted/70 pb-2">
        © María José Álvarez B.
      </footer>
    </main>
  );
}
