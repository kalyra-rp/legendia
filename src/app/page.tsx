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
          Le Seuil
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

        {/* Connexion Discord — désormais fonctionnelle (Phase I) */}
        <div className="mt-10">
          <DiscordLoginButton />
        </div>
      </div>
    </main>
  );
}
