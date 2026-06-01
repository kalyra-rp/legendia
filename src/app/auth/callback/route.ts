// Route de retour OAuth : Supabase nous renvoie ici après Discord.
//
// C'est un "Route Handler" (pas une page) : il fait un travail technique puis
// redirige. Étapes : (1) échanger le code contre une session, (2) vérifier que
// l'utilisateur est bien membre du serveur Discord, (3) entrer ou refuser.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { estMembreDuServeur } from "@/lib/discord/verifier-appartenance";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/hall";

  // On calcule une fois la "base" des redirections : en prod derrière Vercel,
  // le vrai domaine est dans x-forwarded-host (pas l'URL interne).
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocal = process.env.NODE_ENV === "development";
  const base = isLocal
    ? origin
    : forwardedHost
      ? `https://${forwardedHost}`
      : origin;

  // Pas de code → on n'a rien à échanger.
  if (!code) {
    return NextResponse.redirect(`${base}/?erreur_connexion=1`);
  }

  const supabase = await createClient();

  // (1) Échange du code contre une session (pose les cookies).
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${base}/?erreur_connexion=1`);
  }

  // (2) Vérification d'appartenance au serveur.
  // On récupère l'identifiant Discord, rangé par Supabase dans le profil auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const discordId =
    user?.user_metadata?.provider_id ??
    user?.user_metadata?.sub ??
    user?.identities?.find((i) => i.provider === "discord")?.id;

  const autorise = discordId
    ? await estMembreDuServeur(String(discordId))
    : false;

  if (!autorise) {
    // (3a) Porte fermée : on annule la session et on renvoie au Seuil avec
    // un indicateur, pour afficher un message doux.
    await supabase.auth.signOut();
    return NextResponse.redirect(`${base}/?acces=refuse`);
  }

  // (3b) Membre confirmé → bienvenue.
  return NextResponse.redirect(`${base}${next}`);
}
