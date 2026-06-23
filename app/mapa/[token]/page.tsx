import { notFound } from "next/navigation";
import { obtenerRespuesta } from "@/lib/storage";
import { construirMapa } from "@/lib/mapa";
import MapaInteractivo from "@/components/MapaInteractivo";

export const metadata = {
  title: "Tu mapa para volver a ti · María José Álvarez B.",
};

export default async function MapaPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const r = await obtenerRespuesta(token);
  if (!r) notFound();

  const datos = construirMapa(r);

  return (
    <MapaInteractivo datos={datos} token={r.id} yaEnLista={r.lista_prioritaria} />
  );
}
