// LE VERROU D'ACCÈS — réutilisable par toutes les pages "membre connecté".
//
// On factorise ici, en UN SEUL endroit, les trois contrôles d'entrée :
//   (1) y a-t-il une session valide ?               → sinon, retour au Seuil
//   (2) la personne est-elle TOUJOURS sur Discord ? → sinon, on referme la porte
//   (3) lecture de son profil (pseudo, avatar, rôle) pour habiller l'interface
//
// C'est exactement le "verrou durci" de la Phase I (cf. auth/callback), mais
// rejoué à CHAQUE entrée dans l'espace connecté. Pourquoi le rejouer ? Parce
// que le callback ne vérifie l'appartenance Discord qu'au moment du login :
// si quelqu'un quitte (ou est banni du) serveur APRÈS s'être connecté, sa
// session resterait valide. En revérifiant ici, on tient la promesse du
// CLAUDE.md : « si la personne quitte ou est bannie du Discord, elle perd
// l'accès au site ».
//
// ⚠️ Code STRICTEMENT serveur (il lit les cookies de session et appelle
// l'API Discord avec un secret). À n'utiliser que dans des Server Components,
// Server Actions ou routes API — jamais sous "use client".
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { estMembreDuServeur } from "@/lib/discord/verifier-appartenance";

// La forme du profil tel qu'on le consomme dans l'interface.
export type ProfilMembre = {
  pseudo: string;
  avatar?: string;
  role: string;
};

export async function exigerMembre(): Promise<ProfilMembre> {
  const supabase = await createClient();

  // (1) getUser() VALIDE la session auprès de Supabase (on ne fait pas
  //     confiance au seul cookie local). Pas d'utilisateur → dehors.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // (2) Appartenance Discord, en direct. On retrouve l'identifiant Discord
  //     là où Supabase l'a rangé (mêmes champs que dans le callback OAuth).
  const discordId =
    user.user_metadata?.provider_id ??
    user.user_metadata?.sub ??
    user.identities?.find((i) => i.provider === "discord")?.id;

  const autorise = discordId
    ? await estMembreDuServeur(String(discordId))
    : false;

  if (!autorise) {
    // La porte se referme : on coupe la session et on renvoie au Seuil avec
    // l'indicateur "acces=refuse" (le Seuil affiche alors un mot doux + le
    // lien pour rejoindre le serveur).
    await supabase.auth.signOut();
    redirect("/?acces=refuse");
  }

  // (3) Lecture du profil. Grâce à la RLS, cette requête ne peut renvoyer que
  //     la ligne de l'utilisateur connecté.
  const { data: profil } = await supabase
    .from("profils")
    .select("pseudo, avatar_url, role")
    .eq("id", user.id)
    .single();

  // On privilégie la table `profils` ; à défaut, on retombe sur les
  // métadonnées Discord (utile juste après l'inscription).
  const meta = user.user_metadata ?? {};
  const pseudo =
    profil?.pseudo ??
    meta.full_name ??
    meta.name ??
    meta.user_name ??
    user.email ??
    "voyageur·euse";
  const avatar = (profil?.avatar_url ?? meta.avatar_url) as string | undefined;
  const role = profil?.role ?? "membre";

  return { pseudo, avatar, role };
}
