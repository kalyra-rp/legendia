import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "./_nav/Sidebar";
import { StatusBar } from "./_nav/StatusBar";

/**
 * Layout du groupe (app) — le « châssis de gare ».
 *
 * S'applique à toutes les pages connectées (Carnet, Monde, Codex, Réglages,
 * et tous leurs descendants). Les pages publiques (/login, /rejoindre-le-discord,
 * /arrivee, /auth/*) restent à la racine de app/ et n'héritent PAS de ce layout.
 *
 * Le layout fait deux choses :
 *   1. Pose les garde-fous : pas connecté → /login, pas de voyageur → /arrivee.
 *      Ça factorise un check qui était dupliqué dans plusieurs pages.
 *   2. Charge l'identité minimum (voyageur + monde courant) pour alimenter la
 *      sidebar et la barre de statut, qui sont visibles partout.
 *
 * Composition visuelle :
 *   - Sidebar fixée à gauche en desktop, barre horizontale en mobile.
 *   - StatusBar fine et sticky en haut de la zone centrale.
 *   - Zone centrale `<main>` qui contient `{children}` avec une largeur
 *     confortable et centrée (supprime l'impression de débordement).
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: voyageur } = await supabase
    .from("voyageurs")
    .select("id, name, avatar_url, hue, rank_name, current_world_id")
    .eq("user_id", user.id)
    .maybeSingle<{
      id: string;
      name: string;
      avatar_url: string | null;
      hue: number | null;
      rank_name: string | null;
      current_world_id: string | null;
    }>();

  if (!voyageur) redirect("/arrivee");

  // Monde courant (pour la barre de statut). Peut être null.
  const { data: world } = voyageur.current_world_id
    ? await supabase
        .from("worlds")
        .select("id, name")
        .eq("id", voyageur.current_world_id)
        .maybeSingle<{ id: string; name: string }>()
    : { data: null };

  return (
    <div className="min-h-screen">
      <Sidebar
        voyageur={{
          name: voyageur.name,
          avatar_url: voyageur.avatar_url,
          hue: voyageur.hue,
          rank_name: voyageur.rank_name,
        }}
      />

      {/* Décalage à gauche en desktop pour laisser la place à la sidebar fixée.
         La zone centrale impose un cadre : max-width généreux et padding,
         ce qui supprime l'impression de débordement qu'on avait avant. */}
      <div className="md:pl-64">
        <StatusBar worldName={world?.name ?? null} />
        <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 sm:py-16">
          {children}
        </main>
      </div>
    </div>
  );
}
