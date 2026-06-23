import { estaAutenticado, tokenEsperado } from "@/lib/panel-auth";
import { listarRespuestas } from "@/lib/storage";
import PanelLogin from "@/components/PanelLogin";
import PanelDashboard from "@/components/PanelDashboard";

export const metadata = { title: "Panel privado · MJAB" };
export const dynamic = "force-dynamic"; // siempre datos frescos

export default async function PanelPage() {
  // Si no hay contraseña configurada, avisar
  if (tokenEsperado() === null) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-2xl text-ink">Panel sin configurar</h1>
          <p className="text-muted mt-3 text-sm leading-relaxed">
            Define una contraseña en el archivo <code>.env.local</code> con la
            variable <code>PANEL_PASSWORD</code> y reinicia la app.
          </p>
        </div>
      </main>
    );
  }

  if (!(await estaAutenticado())) {
    return <PanelLogin />;
  }

  const respuestas = await listarRespuestas();
  const tieneIA = !!process.env.ANTHROPIC_API_KEY;

  return <PanelDashboard respuestas={respuestas} tieneIA={tieneIA} />;
}
