import { ImageResponse } from "next/og";

// Tarjeta de vista previa al compartir el link (Instagram, WhatsApp, etc.)
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "¿Cómo se ve el amor cuando te eliges a ti? · María José Álvarez B.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f8f8f6",
          color: "#540b14",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 110px",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#7d6960",
            marginBottom: 36,
          }}
        >
          María José Álvarez B.
        </div>
        <div style={{ fontSize: 70, fontWeight: 600, lineHeight: 1.1 }}>
          ¿Cómo se ve el amor cuando te eliges a ti?
        </div>
        <div style={{ fontSize: 30, color: "#7d6960", marginTop: 40 }}>
          Tu mapa para dejar de depender y volver a ti
        </div>
      </div>
    ),
    { ...size }
  );
}
