// LA CARTE D'UN LIEU — un décor du quartier, avec son PNJ-pilier en encart.
//
// Reçoit un lieu déjà enrichi de son pilier (résolu côté page). On affiche :
// l'en-tête (emoji + nom + sous-titre), la description et l'accroche RP en
// markdown, puis — s'il existe — l'encart du PNJ qui anime le lieu.
import { Markdown } from "../../_components/markdown";
import { PnjEncart } from "./pnj-encart";
import type { LieuAvecPilier } from "@/lib/lore/types";

export function LieuCarte({ lieu }: { lieu: LieuAvecPilier }) {
  const accent = lieu.couleur ?? "#ff6b5e";

  return (
    <article
      style={{ borderInlineStartColor: accent }}
      className="rounded-2xl border-2 border-line border-s-4 bg-card p-5 shadow-sm"
    >
      <header className="flex items-center gap-2.5">
        {lieu.emoji && <span className="text-xl leading-none">{lieu.emoji}</span>}
        <div>
          <h4 className="font-display text-lg font-bold leading-tight text-ink">
            {lieu.nom}
          </h4>
          {lieu.sous_titre && (
            <p className="text-xs italic text-ink-soft">{lieu.sous_titre}</p>
          )}
        </div>
      </header>

      {lieu.description && (
        <div className="mt-3 text-sm">
          <Markdown>{lieu.description}</Markdown>
        </div>
      )}

      {/* L'accroche RP : l'invitation à jouer, mise en valeur. */}
      {lieu.accroche_rp && (
        <div
          className="mt-3 rounded-xl border border-line bg-cream/60 p-3 text-sm"
          style={{ borderInlineStartColor: accent, borderInlineStartWidth: 3 }}
        >
          <div className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.15em] text-faint">
            Accroche RP
          </div>
          <Markdown>{lieu.accroche_rp}</Markdown>
        </div>
      )}

      {/* Le PNJ-pilier rattaché, s'il y en a un. */}
      {lieu.pilier && (
        <div className="mt-4">
          <PnjEncart pnj={lieu.pilier} />
        </div>
      )}
    </article>
  );
}
