"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type OpenSceneState = { error: string } | null;

/**
 * Server Action : ouvrir une nouvelle scène dans un lieu.
 *
 * Étapes :
 *   1. valider le titre + les partenaires (1 à 3 cochés → 2 à 4 participants) ;
 *   2. récupérer le lieu (pour son world_id) et mon voyageur ;
 *   3. s'assurer que j'ai une incarnation dans CE monde (sinon la créer) ;
 *   4. insérer la scène (status='open', created_by=moi) ;
 *   5. insérer les scene_participants (moi + chaque partenaire coché) ;
 *   6. rediriger vers la scène fraîchement créée.
 *
 * On retourne un objet d'erreur lisible en cas de souci ; un succès passe
 * par `redirect()` qui jette une exception NEXT_REDIRECT (gérée par Next).
 */
export async function openScene(
  _prev: OpenSceneState,
  formData: FormData,
): Promise<OpenSceneState> {
  const locationId = String(formData.get("locationId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const partnerIds = formData.getAll("partnerIds").map(String);

  if (!locationId) return { error: "Lieu manquant." };
  if (title.length < 2) return { error: "Donne un titre à ta scène (2+ caractères)." };
  if (partnerIds.length < 1) return { error: "Choisis au moins un partenaire." };
  if (partnerIds.length > 3) return { error: "Maximum 3 partenaires (4 participants en tout)." };

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Session expirée." };

  // Le lieu — pour connaître son monde.
  const { data: location } = await supabase
    .from("locations")
    .select("id, world_id")
    .eq("id", locationId)
    .maybeSingle<{ id: string; world_id: string }>();
  if (!location) return { error: "Lieu introuvable." };

  // Mon voyageur (validé requis pour participer).
  const { data: voyageur } = await supabase
    .from("voyageurs")
    .select("id, name, status")
    .eq("user_id", user.id)
    .maybeSingle<{ id: string; name: string; status: string }>();
  if (!voyageur) return { error: "Tu n'as pas encore de Voyageur." };
  if (voyageur.status !== "valide") {
    return { error: "Ton Voyageur n'est pas encore validé." };
  }

  // Mon incarnation dans ce monde (créée à la volée si absente).
  let myIncarnationId: string | null = null;
  {
    const { data: existing } = await supabase
      .from("incarnations")
      .select("id")
      .eq("voyageur_id", voyageur.id)
      .eq("world_id", location.world_id)
      .maybeSingle<{ id: string }>();

    if (existing) {
      myIncarnationId = existing.id;
    } else {
      const { data: created, error: incErr } = await supabase
        .from("incarnations")
        .insert({
          voyageur_id: voyageur.id,
          world_id: location.world_id,
          title: voyageur.name, // titre par défaut = nom du voyageur
        })
        .select("id")
        .single();
      if (incErr || !created) {
        return { error: `Création de l'incarnation refusée : ${incErr?.message ?? "inconnu"}` };
      }
      myIncarnationId = created.id;
    }
  }

  // Insertion de la scène.
  const { data: scene, error: sceneErr } = await supabase
    .from("scenes")
    .insert({
      world_id: location.world_id,
      location_id: location.id,
      title,
      status: "open",
      created_by: user.id,
    })
    .select("id")
    .single();
  if (sceneErr || !scene) {
    return { error: `Création de la scène refusée : ${sceneErr?.message ?? "inconnu"}` };
  }

  // Ajout des participants : moi + chaque incarnation cochée, dans l'ordre.
  // Set pour dédupliquer au cas où.
  // `position` impose le tour : 0 = créateur (= moi, j'écris en premier),
  // 1, 2, 3 = partenaires cochés dans l'ordre où ils l'ont été.
  const uniqueIncIds = Array.from(new Set([myIncarnationId!, ...partnerIds]));
  const participants = uniqueIncIds.map((incId, index) => ({
    scene_id: scene.id,
    incarnation_id: incId,
    world_id: location.world_id,
    position: index,
  }));

  const { error: partErr } = await supabase
    .from("scene_participants")
    .insert(participants);
  if (partErr) {
    return { error: `Ajout des participants refusé : ${partErr.message}` };
  }

  redirect(`/monde/scene/${scene.id}`);
}
