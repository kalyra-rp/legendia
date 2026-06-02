// LE MENU PROFIL — en haut à droite, sur toutes les pages connectées.
//
// "use client" : il s'ouvre/se ferme au clic (état local), se referme quand on
// clique ailleurs ou qu'on appuie sur Échap. Tout ça vit dans le navigateur.
//
// Les données (pseudo, avatar, rôle) sont LUES CÔTÉ SERVEUR par le layout puis
// passées en props : ce composant ne touche jamais à la base ni à l'auth.
"use client";

import { useEffect, useRef, useState } from "react";
import { seDeconnecter } from "../actions";

type Props = {
  pseudo: string;
  avatar?: string;
  role: string;
};

// Habillage du badge de rôle (mêmes teintes que dans Le Hall de la Phase I).
const ROLE_STYLE: Record<string, string> = {
  admin: "border-coral text-coral-d",
  moderateur: "border-sun-d text-sun-d",
  membre: "border-leaf-d text-leaf-d",
};
const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  moderateur: "Modérateur",
  membre: "Membre",
};

export function MenuProfil({ pseudo, avatar, role }: Props) {
  const [ouvert, setOuvert] = useState(false);
  // On garde une référence au conteneur pour détecter les clics « à l'extérieur ».
  const conteneurRef = useRef<HTMLDivElement>(null);

  // Fermer le menu : clic en dehors, ou touche Échap. On ne pose ces écouteurs
  // que lorsque le menu est ouvert (et on les retire en le fermant).
  useEffect(() => {
    if (!ouvert) return;

    function surClicExterieur(e: MouseEvent) {
      if (
        conteneurRef.current &&
        !conteneurRef.current.contains(e.target as Node)
      ) {
        setOuvert(false);
      }
    }
    function surEchap(e: KeyboardEvent) {
      if (e.key === "Escape") setOuvert(false);
    }

    document.addEventListener("mousedown", surClicExterieur);
    document.addEventListener("keydown", surEchap);
    return () => {
      document.removeEventListener("mousedown", surClicExterieur);
      document.removeEventListener("keydown", surEchap);
    };
  }, [ouvert]);

  // Initiale de repli si l'avatar Discord manque.
  const initiale = pseudo.trim().charAt(0).toUpperCase() || "?";

  return (
    <div ref={conteneurRef} className="fixed right-4 top-4 z-50">
      {/* L'avatar cliquable. */}
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={ouvert}
        aria-label="Ouvrir le menu du profil"
        className="grid h-11 w-11 place-items-center overflow-hidden rounded-full border-2 border-line-2 bg-card shadow-md transition hover:border-coral focus:outline-none focus:ring-2 focus:ring-coral/40"
      >
        {avatar ? (
          // <img> simple (pas next/image) pour éviter de déclarer le domaine
          // Discord dans la config, comme dans Le Hall de la Phase I.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-lg font-semibold text-indigo">
            {initiale}
          </span>
        )}
      </button>

      {/* Le menu déroulant. */}
      {ouvert && (
        <div
          role="menu"
          aria-label="Menu du profil"
          className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border-2 border-line-2 bg-card p-2 shadow-xl"
        >
          {/* En-tête : pseudo + badge de rôle. */}
          <div className="px-3 py-2">
            <p className="truncate font-display text-base font-semibold text-ink">
              {pseudo}
            </p>
            <span
              className={`mt-1.5 inline-block rounded-full border-2 bg-card px-3 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] ${
                ROLE_STYLE[role] ?? ROLE_STYLE.membre
              }`}
            >
              {ROLE_LABEL[role] ?? role}
            </span>
          </div>

          <div className="my-1 h-px bg-line" />

          {/* Réglages — grisé, pas encore disponible. */}
          <span
            aria-disabled="true"
            title="Bientôt disponible"
            className="flex cursor-not-allowed items-center justify-between rounded-xl px-3 py-2 text-sm text-ink-soft opacity-50"
          >
            <span className="flex items-center gap-2">⚙️ Réglages</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.15em]">
              bientôt
            </span>
          </span>

          {/* Déconnexion — un formulaire qui déclenche l'action serveur. */}
          <form action={seDeconnecter}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-ink transition hover:bg-coral/10 hover:text-coral-d"
            >
              🚪 Se déconnecter
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
