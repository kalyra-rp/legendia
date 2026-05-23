import Link from "next/link";

/**
 * Page affichée quand un utilisateur s'est authentifié via Discord
 * mais n'est PAS membre de notre serveur Legendia.
 * L'utilisateur a été déconnecté côté Supabase juste avant d'arriver ici.
 */
export default function JoinDiscordPage() {
  const inviteUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center dark:bg-zinc-950">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
        Rejoins d'abord le Discord
      </h1>

      <p className="mt-4 max-w-md text-base text-zinc-600 dark:text-zinc-400">
        Legendia est réservé aux membres du serveur Discord officiel. Rejoins
        le serveur, puis reviens te connecter.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {inviteUrl ? (
          <a
            href={inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-[#5865F2] px-5 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#4752C4]"
          >
            Rejoindre le Discord
          </a>
        ) : (
          <span className="text-sm text-red-600 dark:text-red-400">
            Lien d'invitation non configuré.
          </span>
        )}

        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-5 py-3 text-base font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          Réessayer
        </Link>
      </div>
    </main>
  );
}
