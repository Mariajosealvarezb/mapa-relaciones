import { ImageResponse } from "next/og";

// Icono de marca (favicon): monograma "MJ" blanco sobre negro.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#540b14",
          color: "#f8f8f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        MJ
      </div>
    ),
    { ...size }
  );
}
