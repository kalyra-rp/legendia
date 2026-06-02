// LE HALL — l'accueil de l'espace connecté.
//
// L'accès est déjà garanti par le layout du groupe (app) : inutile de revérifier
// la session/Discord ici. On lit juste le pseudo pour saluer la personne.
//
// Server Component : on calcule la salutation côté serveur. Legendia est une
// plateforme MULTI-UNIVERS (Saint-Pierre n'est que le premier) : le Hall reste
// donc neutre, calé sur le fuseau de la majorité des joueurs (Europe/Paris,
// qui couvre aussi la Belgique), avec des mots doux propres à la plateforme.
import { createClient } from "@/lib/supabase/server";

// On force le rendu dynamique : la salutation dépend de l'heure courante, on
// ne veut donc pas que Next mette la page en cache.
export const dynamic = "force-dynamic";

// Choisit titre + petit mot poétique selon l'heure (4 moments de la journée).
function salutation(heure: number, pseudo: string) {
  if (heure >= 5 && heure < 12) {
    return {
      titre: `Bonjour ${pseudo}`,
      mot: "La plateforme s’éveille doucement.",
    };
  }
  if (heure >= 12 && heure < 18) {
    return {
      titre: `Bel après-midi ${pseudo}`,
      mot: "Les histoires se tissent à leur rythme.",
    };
  }
  if (heure >= 18 && heure < 22) {
    return {
      titre: `Belle soirée ${pseudo}`,
      mot: "L’heure douce des relectures.",
    };
  }
  return {
    titre: `Belle nuit ${pseudo}`,
    mot: "La plateforme veille en silence.",
  };
}

export default async function HallPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Lecture du pseudo (le layout a déjà validé la session ; user existe donc).
  const { data: profil } = await supabase
    .from("profils")
    .select("pseudo")
    .eq("id", user!.id)
    .single();

  const meta = user!.user_metadata ?? {};
  const pseudo =
    profil?.pseudo ??
    meta.full_name ??
    meta.name ??
    meta.user_name ??
    "voyageur·euse";

  // L'heure de la MAJORITÉ DES JOUEURS, quel que soit le fuseau du serveur
  // (Vercel est en UTC). Intl nous donne l'heure locale du fuseau "Europe/Paris"
  // (qui couvre aussi la Belgique). Neutre vis-à-vis des univers.
  const heure = Number(
    new Intl.DateTimeFormat("fr-FR", {
      hour: "numeric",
      hour12: false,
      timeZone: "Europe/Paris",
    }).format(new Date()),
  );

  const { titre, mot } = salutation(heure, pseudo);

  return (
    <section className="flex flex-1 flex-col items-center justify-center text-center">
      <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
        {titre}
      </h1>
      <p className="mt-4 max-w-sm font-display text-lg italic text-ink-soft">
        {mot}
      </p>
    </section>
  );
}
