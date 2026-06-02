// LA FICHE D'UN QUARTIER — ses 5 rubriques + ses lieux rattachés.
//
// Un quartier se décrit en 5 rubriques de prose (markdown) : Situation,
// Ambiance, Qui y vit, Lieux-clés, Accroche RP. En dessous, on déroule les
// lieux du quartier (chacun avec, éventuellement, son PNJ-pilier en encart).
import { Markdown } from "../../_components/markdown";
import { LieuCarte } from "./lieu-carte";
import type { Quartier, LieuAvecPilier } from "@/lib/lore/types";

// Une rubrique = un titre + un contenu markdown. On ne rend que celles qui
// ont du contenu, pour ne pas afficher de sections vides.
function Rubrique({ titre, contenu }: { titre: string; contenu: string | null }) {
  if (!contenu) return null;
  return (
    <div>
      <h3 className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
        {titre}
      </h3>
      <div className="text-sm">
        <Markdown>{contenu}</Markdown>
      </div>
    </div>
  );
}

export function QuartierFiche({
  quartier,
  lieux,
}: {
  quartier: Quartier;
  lieux: LieuAvecPilier[];
}) {
  const accent = quartier.couleur ?? "#1fb6ad";

  return (
    <section
      className="rounded-3xl border-2 border-line bg-card/70 p-6 shadow-sm"
      style={{ borderTopColor: accent, borderTopWidth: 4 }}
    >
      {/* En-tête du quartier */}
      <header className="flex items-center gap-3">
        {quartier.emoji && (
          <span className="text-2xl leading-none">{quartier.emoji}</span>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl font-bold leading-tight text-ink">
              {quartier.nom}
            </h2>
            {/* L'étiquette : le rôle narratif du quartier, en un mot. */}
            {quartier.etiquette && (
              <span
                className="rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-card"
                style={{ backgroundColor: accent }}
              >
                {quartier.etiquette}
              </span>
            )}
          </div>
          {quartier.sous_titre && (
            <p className="font-display text-sm italic" style={{ color: accent }}>
              {quartier.sous_titre}
            </p>
          )}
        </div>
      </header>

      {/* Les 5 rubriques de prose */}
      <div className="mt-5 flex flex-col gap-4">
        <Rubrique titre="Situation" contenu={quartier.situation} />
        <Rubrique titre="Ambiance" contenu={quartier.ambiance} />
        <Rubrique titre="Qui y vit" contenu={quartier.qui_y_vit} />
        <Rubrique titre="Lieux-clés" contenu={quartier.lieux_cles} />
        <Rubrique titre="Accroche RP" contenu={quartier.accroche_rp} />
      </div>

      {/* Les lieux rattachés au quartier */}
      {lieux.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            Les lieux du quartier
          </h3>
          <div className="flex flex-col gap-4">
            {lieux.map((lieu) => (
              <LieuCarte key={lieu.id} lieu={lieu} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
