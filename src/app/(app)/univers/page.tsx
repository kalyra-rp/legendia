// LES UNIVERS — la carte des mondes de Legendia.
//
// Server Component : on lit la table `univers` côté serveur (la RLS autorise
// tout membre connecté à la lire). Pour l'instant, seul Saint-Pierre 974 y est ;
// la page affichera donc une seule carte, mais le code gère déjà la liste.
//
// L'accès est garanti par le layout du groupe (app) — pas besoin de revérifier
// la session ici.
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Univers } from "@/lib/lore/types";

// La salutation/le contenu dépendent de la base et de la session : rendu
// dynamique, pas de mise en cache.
export const dynamic = "force-dynamic";

// Petite étiquette de statut, couleur selon l'état de l'univers.
function BadgeStatut({ statut }: { statut: Univers["statut"] }) {
  const styles: Record<Univers["statut"], string> = {
    ouvert: "border-leaf bg-leaf/10 text-leaf-d",
    preview: "border-sun bg-sun/15 text-sun-d",
    ferme: "border-line-2 bg-cream-2 text-faint",
  };
  const libelle: Record<Univers["statut"], string> = {
    ouvert: "Ouvert",
    preview: "En préparation",
    ferme: "Fermé",
  };
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] ${styles[statut]}`}
    >
      {libelle[statut]}
    </span>
  );
}

export default async function UniversPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("univers")
    .select(
      "id, slug, nom, sous_titre, description_courte, statut, couleur_principale, ordre",
    )
    .order("ordre", { ascending: true });

  const univers = (data ?? []) as Univers[];

  return (
    <section className="mx-auto w-full max-w-3xl py-4">
      {/* En-tête de la page */}
      <span className="inline-block rounded-full border-2 border-indigo bg-card px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-indigo">
        Les Univers
      </span>
      <h1 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
        Les mondes de Legendia
      </h1>
      <p className="mt-3 max-w-lg text-ink-soft">
        Chaque univers est une ville, une époque, une ambiance. On entre,
        on y vit une vie ordinaire — au rythme du lieu.
      </p>

      {/* La liste des univers (une carte chacun) */}
      {univers.length === 0 ? (
        <p className="mt-10 text-ink-soft">
          Aucun univers pour l’instant. Le premier arrive très bientôt 🌺
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {univers.map((u) => {
            // Couleur d'accent dynamique (vient de la base) → variable CSS inline.
            const accent = u.couleur_principale ?? "#1fb6ad";
            return (
              <Link
                key={u.id}
                href={`/univers/${u.slug}`}
                style={{ borderInlineStartColor: accent }}
                className="group relative overflow-hidden rounded-2xl border-2 border-line border-s-4 bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-bold leading-tight text-ink">
                      {u.nom}
                    </h2>
                    {u.sous_titre && (
                      <p
                        className="mt-0.5 font-display text-sm italic"
                        style={{ color: accent }}
                      >
                        {u.sous_titre}
                      </p>
                    )}
                  </div>
                  <BadgeStatut statut={u.statut} />
                </div>

                {u.description_courte && (
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {u.description_courte}
                  </p>
                )}

                <span
                  className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] transition group-hover:gap-2"
                  style={{ color: accent }}
                >
                  Entrer dans la bible →
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
