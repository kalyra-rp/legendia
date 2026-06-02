// L'ENCART PNJ-PILIER — la petite fiche d'un personnage, posée dans un lieu.
//
// Affiché en encart sur la carte d'un lieu (le « pilier » qui l'anime). On
// montre l'essentiel : pastille à l'initiale, prénom/surnom, rôle court, et
// la « voix / parler » + le caractère en markdown (le matériau du MJ).
import { Markdown } from "../../_components/markdown";
import type { Pnj } from "@/lib/lore/types";

export function PnjEncart({ pnj }: { pnj: Pnj }) {
  const accent = pnj.couleur ?? "#5b53d6";
  const initiale =
    pnj.avatar_initiale ?? pnj.prenom?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="rounded-xl border border-line bg-cream/60 p-4">
      <div className="flex items-center gap-3">
        {/* Pastille à l'initiale, teintée de la couleur du PNJ */}
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-lg font-bold text-card"
          style={{ backgroundColor: accent }}
        >
          {initiale}
        </span>
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-base font-bold text-ink">
              {pnj.prenom}
              {pnj.nom ? ` ${pnj.nom}` : ""}
            </span>
            {pnj.surnom && (
              <span className="truncate text-xs italic text-ink-soft">
                « {pnj.surnom} »
              </span>
            )}
          </div>
          {pnj.role_court && (
            <div className="text-xs text-ink-soft">{pnj.role_court}</div>
          )}
        </div>
        <span className="ml-auto shrink-0 rounded-full border border-indigo/30 bg-indigo/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-indigo">
          Pilier
        </span>
      </div>

      {/* La « voix / parler » : ce qui aide le MJ à jouer juste. */}
      {pnj.voix_parler && (
        <div className="mt-3">
          <div className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.15em] text-faint">
            Sa voix
          </div>
          <div className="text-sm">
            <Markdown>{pnj.voix_parler}</Markdown>
          </div>
        </div>
      )}

      {pnj.caractere && (
        <div className="mt-3">
          <div className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.15em] text-faint">
            Son caractère
          </div>
          <div className="text-sm">
            <Markdown>{pnj.caractere}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
