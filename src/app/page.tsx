// LE SEUIL — la page d'accueil de Legendia (avant connexion).
//
// C'est la "porte d'entrée" décrite dans la structure : on y arrive depuis
// Discord, on y verra plus tard le bouton de connexion. Pour l'instant
// (Étape 0), elle est volontairement minimale mais à ton image : un logo,
// un titre, l'univers à venir, et un "bientôt" honnête.
//
// Pas de "use client" : Le Seuil reste un composant serveur statique, donc
// ultra-léger. Seul le bouton de connexion (importé ci-dessous) est interactif.
import { DiscordLoginButton } from "./_components/discord-login-button";

// Le logo "maison" de Legendia (même dessin que dans tes docs).
function LogoMaison() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path d="M3 21h18" />
      <path d="M5 21V8l7-4 7 4v13" />
      <path d="M9 21v-5h6v5" />
    </svg>
  );
}

// Le logo officiel Discord (même tracé que sur le bouton de connexion).
// On le redéfinit ici, en local, car ce bloc-ci est un composant serveur
// (pas de "use client") : il ne peut pas importer le bouton interactif.
function LogoDiscord() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

export default async function LeSeuil({
  searchParams,
}: {
  // Next.js passe les paramètres d'URL ici (sous forme de promesse).
  searchParams: Promise<{ acces?: string; erreur_connexion?: string }>;
}) {
  const params = await searchParams;

  // Le lien d'invitation PUBLIC vers le serveur Discord. Il vit dans une
  // variable d'environnement (jamais en dur) : préfixe NEXT_PUBLIC_ car ce
  // lien est public et peut donc être lu côté navigateur sans risque.
  const lienDiscord = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL;

  // Deux situations possibles au retour du callback :
  // - accès refusé : la personne n'est pas (encore) membre du serveur Discord ;
  // - erreur de connexion : un souci technique pendant l'échange OAuth.
  const accesRefuse = params.acces === "refuse";
  const erreurConnexion = params.erreur_connexion === "1";

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl text-center">
        {/* Logo + nom */}
        <div className="flex items-center justify-center gap-3">
          <span
            className="grid h-14 w-14 -rotate-6 place-items-center rounded-2xl text-white shadow-lg shadow-coral/40"
            // Dégradé corail → soleil en ligne : garanti d'être rendu, et
            // identique à l'angle de tes docs (140°).
            style={{
              backgroundImage:
                "linear-gradient(140deg, var(--color-coral), var(--color-sun))",
            }}
          >
            <LogoMaison />
          </span>
          <span className="font-display text-4xl font-semibold tracking-tight">
            Legendia
          </span>
        </div>

        {/* Étiquette "Le Seuil" */}
        <span className="mt-9 inline-block rounded-full border-2 border-indigo bg-card px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-indigo">
          Le Seuil
        </span>

        {/* Titre */}
        <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
          Bienvenue dans une autre vie.
        </h1>

        {/* Sous-titre */}
        <p className="mx-auto mt-5 max-w-xl text-base text-ink-soft sm:text-lg">
          Legendia est une plateforme originale dédiée au RP narratif. On y
          incarne des gens ordinaires, dans des univers où il fait bon vivre. On
          s’y croise, on s’y aime, on s’y chamaille. Plusieurs mondes vous y
          attendent — le premier, sous le soleil, ouvre bientôt.
        </p>

        {/* Connexion Discord — désormais fonctionnelle (Phase I) */}
        <div className="mt-10">
          <DiscordLoginButton />
        </div>

        {/* Accès refusé : un non-membre du serveur a poussé la porte.
            On la referme avec le sourire — et on lui montre le chemin. */}
        {accesRefuse && (
          <div className="mx-auto mt-8 max-w-md rounded-3xl border-2 border-coral/30 bg-card/80 px-6 py-7 shadow-lg shadow-coral/10">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Encore un pas avant d’entrer
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Legendia est une plateforme originale dédiée au RP narratif,
              ouverte aux membres de notre serveur Discord. C’est là qu’on se
              rencontre, qu’on lit la charte, et qu’on pousse ensemble la porte
              du site.
            </p>
            <a
              href={lienDiscord ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-discord px-6 py-3 font-semibold text-white shadow-lg shadow-discord/30 transition hover:brightness-110"
            >
              <LogoDiscord />
              Rejoindre le serveur Legendia
            </a>
            <p className="mt-4 text-sm text-ink-soft">
              Une fois sur le serveur, reviens ici te connecter — la porte sera
              grande ouverte. 🌺
            </p>
          </div>
        )}

        {/* Échec technique de la connexion : un mot court et rassurant. */}
        {erreurConnexion && (
          <div className="mx-auto mt-6 max-w-md rounded-2xl border-2 border-line-2 bg-card/70 px-5 py-4">
            <p className="font-semibold text-ink">
              La connexion n’a pas pu aboutir.
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Ce n’est rien — réessaie dans un instant.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
