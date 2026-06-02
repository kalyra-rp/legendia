// LA NAVIGATION PRINCIPALE — les 5 onglets de Legendia.
//
// "use client" : on a besoin de savoir quelle page est ouverte pour marquer
// l'onglet actif (usePathname, un hook qui ne tourne que dans le navigateur).
//
// Système responsive (mobile-first) :
//   • Par défaut (= mobile) : une barre fixée EN BAS, 5 cellules côte à côte,
//     atteignables au pouce.
//   • À partir de `md:` (≥ 768 px, donc tablette/desktop) : la MÊME barre se
//     transforme en colonne étroite fixée À GAUCHE.
// On n'écrit pas deux composants : on superpose des classes Tailwind. Les
// classes sans préfixe valent pour le mobile, celles préfixées `md:` ne
// s'activent qu'au-delà du point de rupture. C'est tout l'esprit mobile-first.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Un onglet. `href` absent = onglet pas encore ouvert (grisé, non cliquable).
type Onglet = {
  emoji: string;
  label: string;
  href?: string;
};

// Les 5 onglets, dans l'ordre voulu.
const ONGLETS: Onglet[] = [
  { emoji: "🏠", label: "Hall", href: "/hall" },
  { emoji: "🌅", label: "Univers", href: "/univers" },
  { emoji: "🏘️", label: "Ville" }, // bientôt
  { emoji: "🎭", label: "Carnet" }, // bientôt
  { emoji: "🔔", label: "Beffroi" }, // bientôt
];

export function NavPrincipale() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className={[
        // — Mobile : barre horizontale collée en bas —
        "fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around",
        "border-t-2 border-line-2 bg-cream/95 backdrop-blur",
        // léger respect de l'encoche/barre gestuelle des téléphones
        "pb-[env(safe-area-inset-bottom)]",
        // — Desktop (md+) : colonne verticale collée à gauche —
        "md:inset-x-auto md:left-0 md:top-0 md:bottom-0 md:w-20",
        "md:flex-col md:items-center md:justify-start md:gap-1 md:pt-6",
        "md:border-r-2 md:border-t-0",
      ].join(" ")}
    >
      {ONGLETS.map((onglet) => {
        // Onglet actif = page actuellement ouverte (on tolère les sous-pages).
        const actif =
          !!onglet.href &&
          (pathname === onglet.href || pathname.startsWith(onglet.href + "/"));

        return (
          <OngletCellule key={onglet.label} onglet={onglet} actif={actif} />
        );
      })}
    </nav>
  );
}

// Une cellule d'onglet. Trois états :
//   • ouvert + actif   → couleur corail, pastille douce, petit trait repère
//   • ouvert + inactif → discret, cliquable (Link)
//   • pas encore ouvert → grisé (~40 %), cadenas en superposition, non cliquable
function OngletCellule({ onglet, actif }: { onglet: Onglet; actif: boolean }) {
  // Mise en page commune à toutes les cellules (icône au-dessus, label dessous).
  const base =
    "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 " +
    "md:w-full md:flex-none md:py-3 select-none";

  // ——— Onglet à venir : grisé, verrouillé, non cliquable ———
  if (!onglet.href) {
    return (
      <span
        className={`${base} cursor-not-allowed opacity-40`}
        aria-disabled="true"
        title="Bientôt disponible"
      >
        <span className="relative text-xl leading-none">
          {onglet.emoji}
          {/* Petit cadenas en superposition, en haut à droite de l'icône. */}
          <span className="absolute -right-2 -top-1 text-[10px] leading-none">
            🔒
          </span>
        </span>
        <span className="text-[10px] font-medium md:text-[11px]">
          {onglet.label}
        </span>
      </span>
    );
  }

  // ——— Onglet ouvert : un vrai lien ———
  return (
    <Link
      href={onglet.href}
      aria-current={actif ? "page" : undefined}
      className={`${base} transition ${
        actif ? "text-coral-d" : "text-ink-soft hover:text-ink"
      }`}
    >
      {/* Repère de l'onglet actif : un petit trait corail. En bas de la cellule
          sur mobile, sur le bord gauche sur desktop. */}
      {actif && (
        <span
          aria-hidden="true"
          className={[
            "absolute rounded-full bg-coral",
            "left-1/2 bottom-0 h-0.5 w-7 -translate-x-1/2", // mobile : trait sous l'onglet
            "md:left-0 md:top-1/2 md:bottom-auto md:h-7 md:w-0.5 md:translate-x-0 md:-translate-y-1/2", // desktop : trait à gauche
          ].join(" ")}
        />
      )}

      {/* L'icône, posée sur une pastille corail douce quand l'onglet est actif. */}
      <span
        className={`grid h-9 w-9 place-items-center rounded-2xl text-xl leading-none transition ${
          actif ? "bg-coral/12" : ""
        }`}
      >
        {onglet.emoji}
      </span>
      <span className="text-[10px] font-medium md:text-[11px]">
        {onglet.label}
      </span>
    </Link>
  );
}
