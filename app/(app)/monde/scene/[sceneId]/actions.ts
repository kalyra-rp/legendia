"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type PublishPostState =
  | { error: string }
  | { ok: true; clearKey: number }
  | null;

/**
 * Server Action : publier un post dans une scène.
 *
 * - On valide le texte (non vide).
 * - On retrouve mon incarnation dans le monde de la scène (la RLS des posts
 *   exige que l'auteur soit participant ; si je ne le suis pas, l'insert
 *   sera refusé et on le remonte proprement).
 * - On insère le post.
 * - On bump `scenes.updated_at` pour que la scène remonte dans les listes.
 * - On revalide la page pour ré-afficher la liste à jour.
 *
 * On retourne un { ok: true, clearKey } unique pour que le composant client
 * détecte un nouveau succès (même contenu envoyé deux fois → clearKey
 * différent) et puisse reset son textarea.
 */
export async function publishPost(
  _prev: PublishPostState,
  formData: FormData,
): Promise<PublishPostState> {
  const sceneId = String(formData.get("sceneId") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (!sceneId) return { error: "Scène manquante." };
  if (body.length < 1) return { error: "Écris quelque chose avant de publier." };

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Session expirée." };

  const { data: scene } = await supabase
    .from("scenes")
    .select("id, world_id")
    .eq("id", sceneId)
    .maybeSingle<{ id: string; world_id: string }>();
  if (!scene) return { error: "Scène introuvable." };

  const { data: voyageur } = await supabase
    .from("voyageurs")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle<{ id: string }>();
  if (!voyageur) return { error: "Tu n'as pas encore de Voyageur." };

  const { data: incarnation } = await supabase
    .from("incarnations")
    .select("id")
    .eq("voyageur_id", voyageur.id)
    .eq("world_id", scene.world_id)
    .maybeSingle<{ id: string }>();
  if (!incarnation) {
    return { error: "Tu n'as pas d'incarnation dans ce monde." };
  }

  // ─── Enforcement du tour fixe (A → B → A…) ───
  // On recalcule TOUJOURS côté serveur. Le client (page) calcule la même
  // chose pour l'UX, mais c'est ici que la garde est posée.
  //
  // Formule : turnIndex = postsCount mod participantsCount ; le participant
  // dont position = turnIndex est celui qui peut écrire maintenant.
  const [participantsRes, postsCountRes] = await Promise.all([
    supabase
      .from("scene_participants")
      .select("incarnation_id, position")
      .eq("scene_id", scene.id)
      .order("position", { ascending: true, nullsFirst: false }),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("scene_id", scene.id),
  ]);

  const participants = participantsRes.data ?? [];
  if (participants.length === 0) {
    return { error: "Cette scène n'a aucun participant." };
  }

  const postsCount = postsCountRes.count ?? 0;
  const turnIndex = postsCount % participants.length;
  const turnIncarnationId = participants[turnIndex]?.incarnation_id;

  if (turnIncarnationId !== incarnation.id) {
    return { error: "Ce n'est pas ton tour d'écrire." };
  }

  // L'insert. La RLS reste l'autorité finale.
  const { error: insErr } = await supabase.from("posts").insert({
    world_id: scene.world_id,
    scene_id: scene.id,
    incarnation_id: incarnation.id,
    author_id: user.id,
    body,
  });
  if (insErr) {
    return { error: `Publication refusée : ${insErr.message}` };
  }

  // Bump updated_at pour faire remonter la scène dans la liste du lieu.
  await supabase
    .from("scenes")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", scene.id);

  revalidatePath(`/monde/scene/${sceneId}`);
  return { ok: true, clearKey: Date.now() };
}
