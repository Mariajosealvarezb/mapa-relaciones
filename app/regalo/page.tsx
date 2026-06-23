import { construirMapaGeneral } from "@/lib/mapa";
import MapaInteractivo from "@/components/MapaInteractivo";

export const metadata = {
  title: "Tu mapa para volver a ti · María José Álvarez B.",
};

// Mapa GENERAL: un solo link para enviar a todas (sin personalizar).
export default function RegaloPage() {
  const datos = construirMapaGeneral();
  return <MapaInteractivo datos={datos} />;
}
