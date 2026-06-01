// Client Supabase pour le NAVIGATEUR (composants "use client").
//
// À utiliser dans le code qui tourne côté navigateur : boutons, formulaires,
// abonnements temps réel, etc. Il s'appuie sur la clé "anon" (publique) — c'est
// normal qu'elle soit visible côté client, elle est faite pour ça. Les vrais
// secrets (clé service, clé Claude) ne passent JAMAIS par ici.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
