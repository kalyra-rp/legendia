"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Faceclaim } from "@/components/Faceclaim";
import { SignOutButton } from "./SignOutButton";

type VoyageurMini = {
  name: string;
  avatar_url: string | null;
  hue: number | null;
  rank_name?: string | null;
};

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

/* ─────────────────────────────────────────────────────────────────────────
   Liste des destinations affichées sur le « panneau du quai ».
   Petits pictos SVG sobres (1px stroke), couleur héritée du parent.
   ───────────────────────────────────────────────────────────────────────── */
const ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Carnet",
    icon: (
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
        <rect x="3" y="2" width="10" height="12" rx="0.5" />
        <line x1="3" y1="5" x2="13" y2="5" />
      </svg>
    ),
  },
  {
    href: "/monde",
    label: "Monde",
    icon: (
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
        <circle cx="8" cy="8" r="5.5" />
        <path d="M2.5 8h11M8 2.5c1.8 2 1.8 9 0 11M8 2.5c-1.8 2-1.8 9 0 11" />
      </svg>
    ),
  },
  {
    href: "/codex",
    label: "Codex",
    icon: (
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
        <path d="M4 2v12M8 2v12M12 2v12" />
        <line x1="3" y1="14" x2="13" y2="14" />
      </svg>
    ),
  },
  {
    href: "/reglages",
    label: "Réglages",
    icon: (
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
        <circle cx="8" cy="8" r="2.2" />
        <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" />
      </svg>
    ),
  },
];

function isActive(pathname: string, href: string): boolean {
  // Pour le Carnet ( / ), match exact uniquement (sinon il s'allumerait partout).
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Sidebar « quai de gare ».
 *
 * - Desktop (md+) : colonne verticale fixée à gauche.
 * - Mobile : bascule en barre horizontale en haut, faceclaim et nom à gauche,
 *   destinations à droite (scrollables si besoin). Pas de drawer / burger :
 *   un layout responsive Tailwind suffit, zéro JS supplémentaire.
 *
 * Client Component car on a besoin de `usePathname()` pour mettre en valeur
 * l'item actif. Les données viennent en props du Server Component layout.
 */
export function Sidebar({ voyageur }: { voyageur: VoyageurMini }) {
  const pathname = usePathname();

  return (
    <aside
      className={[
        // Layout : barre horizontale en mobile, sidebar verticale en md+
        "flex w-full flex-row items-center gap-4 border-b border-line bg-paper px-4 py-3",
        "md:fixed md:left-0 md:top-0 md:bottom-0 md:z-30 md:w-64 md:flex-col md:items-stretch md:gap-0 md:overflow-y-auto md:border-b-0 md:border-r md:px-0 md:py-0",
      ].join(" ")}
    >
      {/* ── Identité Voyageur (haut de sidebar) ── */}
      <div className="flex items-center gap-3 md:flex-col md:items-start md:p-6 md:pb-5">
        <Faceclaim
          name={voyageur.name}
          avatarUrl={voyageur.avatar_url}
          hue={voyageur.hue}
          size="md"
        />
        <div className="min-w-0 md:mt-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
            voyageur
          </p>
          <p className="truncate font-display text-base font-medium text-ink md:text-lg">
            {voyageur.name}
          </p>
          {voyageur.rank_name && (
            <p className="hidden font-serif text-xs italic text-muted md:block">
              {voyageur.rank_name}
            </p>
          )}
        </div>
      </div>

      {/* ── Trait cuivre vertical (rail / ligne de quai) — desktop uniquement ── */}
      <span
        aria-hidden
        className="hidden md:mx-6 md:block md:h-px md:bg-copper md:opacity-40"
      />

      {/* ── Destinations ── */}
      <nav
        aria-label="Navigation principale"
        className={[
          "ml-auto flex flex-row items-center gap-1 overflow-x-auto",
          "md:ml-0 md:mt-2 md:flex-col md:items-stretch md:gap-1 md:overflow-visible md:px-3",
        ].join(" ")}
      >
        {ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group relative flex items-center gap-3 rounded-md px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-200 md:py-2.5 md:text-[11px]",
                active
                  ? "text-verdigris-deep"
                  : "text-muted hover:text-ink",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              {/* Marqueur cuivre (poinçon) à gauche pour l'item actif — desktop seulement */}
              {active && (
                <span
                  aria-hidden
                  className="hidden md:absolute md:-left-3 md:top-1/2 md:block md:h-1.5 md:w-1.5 md:-translate-y-1/2 md:rotate-45 md:bg-copper"
                />
              )}
              <span
                className={[
                  "flex-none transition-colors",
                  active ? "text-verdigris" : "text-line group-hover:text-muted",
                ].join(" ")}
              >
                {item.icon}
              </span>
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Pied de sidebar : déconnexion ── */}
      <div className="hidden md:mt-auto md:block md:border-t md:border-line md:px-6 md:py-5">
        <SignOutButton />
      </div>

      {/* Sur mobile, le bouton signout est compact à droite */}
      <div className="md:hidden">
        <SignOutButton />
      </div>
    </aside>
  );
}
