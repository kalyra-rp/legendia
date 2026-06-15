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
    title: "Le Dossier",
    blurb:
      "L'enquête vivante — ce qui s'inscrit, mois après mois, et que nul n'ose clore.",
    href: "/dossier",
  },
];

export type Inscription = {
  date: string;
  lieu: string;
  texte: string;
};

export const inscriptions: Inscription[] = [
  {
    date: "12 mai 2026",
    lieu: "Bonaventure",
    texte:
      "Une procession de chiens errants observée à l'aube près du carré ancien. Aucun ne s'est approché des grilles.",
  },
  {
    date: "3 avril 2026",
    lieu: "River Street",
    texte:
      "Trois montres arrêtées à la même minute, déposées chez le même horloger. Le client n'a pas laissé de nom.",
  },
  {
    date: "27 février 2026",
    lieu: "Forsyth Park",
    texte:
      "La fontaine a gelé une nuit sans gel. Au matin, plus rien — sinon une odeur de marais.",
  },
];
