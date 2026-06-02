// LA SIDEBAR DES CHAPITRES — le sommaire navigable de la bible.
//
// Reprend les 6 chapitres de la table des matières de la bible HTML. Pour
// l'instant, seul le Chapitre I « La ville & ses quartiers » a du contenu :
// il est donc actif (lien d'ancre vers la section). Les 5 autres sont là, mais
// grisés et non cliquables — ils se rempliront en sessions suivantes.
//
// Server Component : ce ne sont que des liens d'ancre, pas besoin de "use client".

type Chapitre = {
  num: string;
  titre: string;
  ancre?: string; // présent = chapitre actif (cliquable)
};

const CHAPITRES: Chapitre[] = [
  { num: "I", titre: "La ville & ses quartiers", ancre: "chapitre-1" },
  { num: "II", titre: "Les lieux de vie" },
  { num: "III", titre: "Le Sud accessible" },
  { num: "IV", titre: "La vie quotidienne & la culture" },
  { num: "V", titre: "Le calendrier de l’île" },
  { num: "VI", titre: "Jouer ici : cadre & ton" },
];

export function SidebarChapitres({ accent }: { accent: string }) {
  return (
    <nav aria-label="Chapitres de la bible" className="flex flex-col gap-1.5">
      <div className="mb-1 px-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
        Sommaire
      </div>
      {CHAPITRES.map((ch) => {
        // Chapitre actif → lien d'ancre, repère coloré.
        if (ch.ancre) {
          return (
            <a
              key={ch.num}
              href={`#${ch.ancre}`}
              className="group flex items-center gap-3 rounded-xl border-2 border-line bg-card px-3 py-2.5 transition hover:border-s-4"
              style={{ borderInlineStartColor: accent, borderInlineStartWidth: 4 }}
            >
              <span
                className="font-display text-sm font-bold italic"
                style={{ color: accent }}
              >
                {ch.num}.
              </span>
              <span className="text-sm font-medium text-ink">{ch.titre}</span>
            </a>
          );
        }
        // Chapitre à venir → grisé, verrouillé, non cliquable.
        return (
          <span
            key={ch.num}
            aria-disabled="true"
            title="Bientôt"
            className="flex cursor-not-allowed items-center gap-3 rounded-xl border-2 border-transparent px-3 py-2.5 opacity-50"
          >
            <span className="font-display text-sm font-bold italic text-faint">
              {ch.num}.
            </span>
            <span className="text-sm text-ink-soft">{ch.titre}</span>
            <span className="ml-auto text-[10px]">🔒</span>
          </span>
        );
      })}
    </nav>
  );
}
