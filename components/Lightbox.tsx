"use client";

import { useEffect, useState } from "react";

// Visor de imagen a pantalla completa, con zoom al tocar.
export default function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-fade-in">
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="text-white/90 text-sm border border-white/30 rounded-full px-4 py-2 active:scale-95 transition-transform"
        >
          ✕ Cerrar
        </button>
      </div>

      <div
        className="flex-1 overflow-auto flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          onClick={(e) => {
            e.stopPropagation();
            setZoom((z) => !z);
          }}
          className={`max-h-full max-w-full object-contain rounded-lg transition-transform duration-300 ${
            zoom ? "scale-[1.8] cursor-zoom-out" : "scale-100 cursor-zoom-in"
          }`}
        />
      </div>

      <p className="text-center text-white/60 text-xs pb-7 px-6">
        Toca la imagen para acercar · Toca fuera para cerrar
      </p>
    </div>
  );
}
