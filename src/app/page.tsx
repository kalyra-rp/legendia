// LE SEUIL — la page d'accueil de Legendia (avant connexion).
//
// C'est la "porte d'entrée" décrite dans la structure : on y arrive depuis
// Discord, on y verra plus tard le bouton de connexion. Pour l'instant
// (Étape 0), elle est volontairement minimale mais à ton image : un logo,
// un titre, l'univers à venir, et un "bientôt" honnête.
//
// Pas de "use client" : c'est un composant serveur statique, donc ultra-léger
// et instantané à charger. Il n'y a aucune interactivité ici (le bouton est
// désactivé), donc rien à exécuter côté navigateur.

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

// Le petit logo Discord (marque officielle), pour le bouton de connexion.
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

export default function LeSeuil() {
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
          Le Seuil · bientôt
        </span>

        {/* Titre */}
        <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
          Une vie douce vous attend à{" "}
          <span className="text-coral">Saint-Pierre</span>.
        </h1>

        {/* Sous-titre */}
        <p className="mx-auto mt-5 max-w-xl text-base text-ink-soft sm:text-lg">
          Legendia est un studio de jeu de rôle textuel où l’on incarne des
          habitants ordinaires et où l’on vit, au rythme de l’île. Le premier
          univers —{" "}
          <strong className="font-semibold text-ink">Saint-Pierre</strong>, à La
          Réunion — ouvre bientôt ses portes.
        </p>

        {/* Connexion Discord (annoncée, pas encore active) */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="inline-flex cursor-not-allowed items-center gap-2.5 rounded-full bg-discord px-7 py-3.5 font-semibold text-white opacity-55"
          >
            <LogoDiscord />
            Se connecter avec Discord
          </button>
          <span className="font-mono text-[11px] uppercase tracking-wider text-faint">
            Connexion disponible très bientôt
          </span>
        </div>
      </div>
    </main>
  );
}
