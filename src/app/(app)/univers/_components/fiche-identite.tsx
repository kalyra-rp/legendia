// LA FICHE D'IDENTITÉ — la grille de « puces » (fact chips) d'un univers.
//
// Reprend le bloc « .facts » de la bible HTML : une grille responsive de
// petites cartes (emoji, clé en mono majuscules, valeur en serif, détail).
// Les données viennent du champ JSONB `fiche_identite` de la table univers.
import type { FicheChip } from "@/lib/lore/types";

export function FicheIdentite({ chips }: { chips: FicheChip[] }) {
  if (!chips || chips.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {chips.map((chip) => (
        <div
          key={chip.cle}
          className="rounded-2xl border-2 border-line bg-card p-4 shadow-sm"
        >
          <div className="mb-1.5 text-xl leading-none">{chip.emoji}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-faint">
            {chip.cle}
          </div>
          <div className="font-display text-base font-bold leading-tight text-ink">
            {chip.valeur}
          </div>
          {chip.detail && (
            <div className="mt-0.5 text-xs text-ink-soft">{chip.detail}</div>
          )}
        </div>
      ))}
    </div>
  );
}
