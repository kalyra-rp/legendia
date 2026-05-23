import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback OAuth Discord.
 *
 * Flux complet :
 *   1. Échanger le `code` reçu de Discord contre une session Supabase.
 *   2. Récupérer le `provider_token` (= access token Discord) depuis cette
 *      session. ATTENTION : ce token n'est disponible qu'ICI, juste après
 *      l'échange. Supabase ne le persiste pas — c'est pour ça qu'on vérifie
 *      l'appartenance au serveur immédiatement.
 *   3. Appeler l'API Discord pour lister les serveurs de l'utilisateur.
 *   4. Vérifier que notre serveur Legendia est dans la liste.
 *   5. Si OUI → upsert du profil + redirection vers l'app.
 *      Si NON → signOut + redirection vers la page d'invitation.
 *
 * La vérification est rejouée à CHAQUE connexion : si quelqu'un quitte
 * le Discord, il perd l'accès au prochain login.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();

  // 1. Échange code → session.
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session) {
    return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
  }

  // 2. provider_token = access token Discord (éphémère).
  const providerToken = data.session.provider_token;
  if (!providerToken) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?error=no_provider_token`);
  }

  // 3. Liste des serveurs de l'utilisateur.
  const guildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: { Authorization: `Bearer ${providerToken}` },
    cache: "no-store",
  });

  if (!guildsRes.ok) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?error=guilds_fetch_failed`);
  }

  const guilds = (await guildsRes.json()) as Array<{ id: string }>;
  const targetGuildId = process.env.NEXT_PUBLIC_DISCORD_GUILD_ID;

  if (!targetGuildId) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?error=server_misconfigured`);
  }

  // 4. Membre du serveur Legendia ?
  const isMember = guilds.some((g) => g.id === targetGuildId);
  if (!isMember) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/rejoindre-le-discord`);
  }

  // 5. Upsert du profil. Les métadonnées Discord sont placées par Supabase
  // dans `user.user_metadata`. On essaie plusieurs clés pour tomber sur la
  // bonne (Discord a changé son schéma de pseudo récemment).
  const user = data.session.user;
  const meta = user.user_metadata ?? {};
  const discordId: string | null =
    (meta.provider_id as string | undefined) ??
    (meta.sub as string | undefined) ??
    null;
  const discordUsername: string | null =
    (meta.custom_claims as { global_name?: string } | undefined)?.global_name ??
    (meta.user_name as string | undefined) ??
    (meta.name as string | undefined) ??
    (meta.full_name as string | undefined) ??
    null;

  const { error: upsertError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      discord_id: discordId,
      discord_username: discordUsername,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  // L'upsert peut échouer si la table n'existe pas encore (cf. SQL à exécuter).
  // On laisse passer en log plutôt que bloquer l'utilisateur ; on pourra
  // rendre ça bloquant une fois le schéma en place.
  if (upsertError) {
    console.warn("[auth/callback] upsert profiles failed:", upsertError.message);
  }

  return NextResponse.redirect(`${origin}/`);
}
