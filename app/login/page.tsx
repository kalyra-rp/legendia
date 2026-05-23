"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDiscordLogin() {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    // Lance le flux OAuth Discord. Supabase gère la redirection vers Discord,
    // puis revient sur notre /auth/callback avec un code à échanger.
    // Les scopes :
    //   - identify : infos publiques du compte Discord
    //   - email    : l'email associé
    //   - guilds   : la liste des serveurs (nécessaire pour vérifier
    //                l'appartenance à notre serveur Legendia)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "identify email guilds",
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center dark:bg-zinc-950">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
        Legendia
      </h1>
      <p className="mt-4 max-w-md text-base text-zinc-600 dark:text-zinc-400">
        Connecte-toi avec Discord pour accéder à la plateforme.
      </p>

      <button
        type="button"
        onClick={handleDiscordLogin}
        disabled={loading}
        className="mt-8 inline-flex items-center justify-center rounded-md bg-[#5865F2] px-5 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#4752C4] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Redirection…" : "Se connecter avec Discord"}
      </button>

      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </main>
  );
}
