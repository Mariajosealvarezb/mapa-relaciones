"use client";

import { useState } from "react";

export default function PanelLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const res = await fetch("/api/panel/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "No se pudo entrar.");
        setCargando(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Error de conexión.");
      setCargando(false);
    }
  }

  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-6">
      <form
        onSubmit={entrar}
        className="w-full max-w-sm text-center"
      >
        <p className="text-xs tracking-[0.25em] uppercase text-muted">Privado</p>
        <h1 className="font-display text-3xl text-ink mt-3">Tu panel</h1>
        <p className="text-muted text-sm mt-2 mb-8">
          Ingresa tu contraseña para ver los resultados.
        </p>
        <input
          autoFocus
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full bg-transparent border-b border-line focus:border-ink outline-none py-3 text-center text-lg text-ink transition-colors"
        />
        {error && <p className="text-sm text-[#b00020] mt-4">{error}</p>}
        <button
          type="submit"
          disabled={cargando || !password}
          className="mt-8 w-full rounded-full bg-ink px-8 py-4 text-paper font-medium transition-all active:scale-[0.98] disabled:opacity-40"
        >
          {cargando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
