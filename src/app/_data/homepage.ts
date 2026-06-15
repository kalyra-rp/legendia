// ============================================================
// Données statiques de la homepage (V1).
// Tout est figé ici pour l'instant ; le jour où ça viendra de
// Supabase, on remplace cette source SANS toucher au rendu.
// NB : textes d'ambiance = PLACEHOLDER, à valider avec la bible
// de l'univers avant d'être considérés comme canon.
// ============================================================

export type Plaque = {
  numeral: string; // chiffre romain affiché (I, II, III)
  title: string;
  blurb: string;
  href: string;
};

export const plaques: Plaque[] = [
  {
    numeral: "I",
    title: "L'Atlas",
    blurb:
      "La ville lieu par lieu : ses seuils, ses refuges, et les endroits où l'empreinte affleure.",
    href: "/atlas",
  },
  {
    numeral: "II",
    title: "Le Registre",
    blurb:
      "L'encyclopédie du monde caché : les Deep, leurs strates, et les degrés du savoir.",
    href: "/registre",
  },
  {
    numeral: "III",
    title: "La Gazette de Savannah",
    blurb:
      "La chronique de la ville, semaine après semaine — ce qui ouvre, ce qui s'y dit, et ce qui, parfois, ne s'explique pas tout à fait.",
    href: "/gazette",
  },
];

export type Inscription = {
  date: string;
  lieu: string;
  texte: string;
};

export const inscriptions: Inscription[] = [
  {
    date: "6 juin 2026",
    lieu: "Forsyth Park",
    texte:
      "Le marché du samedi a rouvert sous les chênes. On s'y est attardé plus que de raison — personne ne sait dire pourquoi l'après-midi a paru si court.",
  },
  {
    date: "21 mai 2026",
    lieu: "River Street",
    texte:
      "Un salon de thé a ouvert au bout de la rue. La patronne connaît déjà le prénom de chacun, même de ceux qui n'étaient jamais venus.",
  },
  {
    date: "3 mai 2026",
    lieu: "Bonaventure",
    texte:
      "Une famille s'est installée dans la vieille maison de l'allée. Les chiens du quartier font un petit détour devant la grille, mais on dit les nouveaux venus charmants.",
  },
];
