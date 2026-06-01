// Vérifie qu'un utilisateur Discord est bien membre du serveur Legendia.
//
// ⚠️ Code STRICTEMENT serveur : il lit DISCORD_BOT_TOKEN (un secret). Ne jamais
// l'importer depuis un composant client ("use client").
//
// Choix de sécurité : "fail-closed". En cas de doute (config manquante, Discord
// injoignable, réponse inattendue), on renvoie `false` → accès refusé. Pour un
// portier, mieux vaut fermer la porte en cas d'incertitude que de l'ouvrir.

const API_DISCORD = "https://discord.com/api/v10";

export async function estMembreDuServeur(
  discordUserId: string,
): Promise<boolean> {
  const token = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!token || !guildId) {
    console.error(
      "[Discord] DISCORD_BOT_TOKEN ou DISCORD_GUILD_ID manquant — accès refusé par prudence.",
    );
    return false;
  }

  try {
    // On demande à Discord la fiche de CE membre dans CE serveur.
    // 200 = il en fait partie ; 404 = il n'y est pas.
    const res = await fetch(
      `${API_DISCORD}/guilds/${guildId}/members/${discordUserId}`,
      {
        headers: { Authorization: `Bot ${token}` },
        cache: "no-store", // jamais de cache : on veut l'état réel, en direct
      },
    );

    if (res.status === 200) return true;
    if (res.status === 404) return false;

    // Tout autre cas (401 jeton invalide, 429 trop d'appels, 5xx panne Discord…)
    // : on log pour pouvoir diagnostiquer, et on refuse par prudence.
    console.error(
      `[Discord] Réponse inattendue (${res.status}) lors de la vérification d'appartenance.`,
    );
    return false;
  } catch (e) {
    console.error("[Discord] Échec de l'appel à l'API :", e);
    return false;
  }
}
