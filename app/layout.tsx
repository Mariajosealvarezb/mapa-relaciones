import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// Títulos: Playfair Display (aire editorial, como el logo)
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Textos y botones: Inter
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL || "https://relaciones.mariajosealvarezb.com"
  ),
  title: "¿Cómo se ve el amor cuando te eliges a ti? · María José Álvarez B.",
  description:
    "Un mapa para dejar de depender emocionalmente y volver a ti. Responde y recibe tu mapa interactivo personalizado.",
  openGraph: {
    title: "¿Cómo se ve el amor cuando te eliges a ti?",
    description:
      "Un mapa para dejar de depender emocionalmente y volver a ti. Recibe tu mapa interactivo personalizado.",
    siteName: "María José Álvarez B.",
    locale: "es_ES",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Color de la barra del navegador en celular
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
