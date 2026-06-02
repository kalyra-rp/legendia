// LES TYPES DU LORE — le reflet TypeScript des tables de la migration 0002.
//
// On n'a pas (encore) branché la génération automatique des types Supabase.
// En attendant, on décrit ici, à la main, la forme des lignes qu'on lit en
// base. Ça nous donne l'autocomplétion et le filet de sécurité du typage dans
// les pages, sans dépendance lourde. Le jour où l'on génère les types Supabase,
// on pourra remplacer ces définitions par les types dérivés du schéma.
//
// ⚠️ Garder synchronisé avec supabase/migrations/0002_lore_univers.sql.

// Une « puce » de la fiche d'identité (stockée en JSONB dans univers).
export type FicheChip = {
  emoji: string;
  cle: string;
  valeur: string;
  detail?: string;
};

export type Univers = {
  id: string;
  slug: string;
  nom: string;
  sous_titre: string | null;
  description_courte: string | null;
  description_longue: string | null;
  statut: "ouvert" | "preview" | "ferme";
  couleur_principale: string | null;
  fiche_identite: FicheChip[];
  ordre: number;
};

export type Quartier = {
  id: string;
  univers_id: string;
  slug: string;
  nom: string;
  sous_titre: string | null;
  emoji: string | null;
  couleur: string | null;
  ordre: number;
  situation: string | null;
  ambiance: string | null;
  qui_y_vit: string | null;
  lieux_cles: string | null;
  accroche_rp: string | null;
};

export type Pnj = {
  id: string;
  univers_id: string;
  slug: string;
  prenom: string;
  nom: string | null;
  surnom: string | null;
  role_court: string | null;
  age: number | null;
  origine: string | null;
  role_metier: string | null;
  caractere: string | null;
  voix_parler: string | null;
  accroches_rp: string | null;
  couleur: string | null;
  avatar_initiale: string | null;
  statut: "pilier" | "figurant";
  ordre: number;
};

export type Lieu = {
  id: string;
  univers_id: string;
  quartier_id: string | null;
  slug: string;
  nom: string;
  sous_titre: string | null;
  emoji: string | null;
  couleur: string | null;
  ordre: number;
  description: string | null;
  accroche_rp: string | null;
  pnj_pilier_id: string | null;
};

// Un lieu enrichi de son PNJ-pilier déjà résolu (pour l'affichage).
export type LieuAvecPilier = Lieu & {
  pilier: Pnj | null;
};
