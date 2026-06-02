// LA BIBLE D'UN UNIVERS — /univers/[slug]
//
// Server Component : on lit tout le lore de l'univers côté serveur (RLS :
// lecture ouverte à tout membre connecté), puis on assemble la page.
//
// Cette session, seul le Chapitre I « La ville & ses quartiers » a vocation à
// afficher du contenu. Tant qu'aucun quartier n'est en base, on montre un mot
// d'attente à sa place — le contenu créatif (Centre-ville…) arrivera ensuite.
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Markdown } from "../_components/markdown";
import { FicheIdentite } from "../_components/fiche-identite";
import { SidebarChapitres } from "./_components/sidebar-chapitres";
import { QuartierFiche } from "./_components/quartier-fiche";
import type {
  Univers,
  Quartier,
  Lieu,
  Pnj,
  LieuAvecPilier,
} from "@/lib/lore/types";

export const dynamic = "force-dynamic";

export default async function BibleUniversPage({
  params,
}: {
  // Next.js 16 : `params` est asynchrone.
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1) L'univers lui-même. Absent → 404.
  const { data: universData } = await supabase
    .from("univers")
    .select(
      "id, slug, nom, sous_titre, description_longue, statut, couleur_principale, fiche_identite, ordre",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!universData) {
    notFound();
  }
  const univers = universData as Univers;
  const accent = univers.couleur_principale ?? "#1fb6ad";

  // 2) Les quartiers, lieux et PNJ de cet univers, en parallèle (3 requêtes
  //    indépendantes : on les lance ensemble plutôt qu'à la file).
  const [quartiersRes, lieuxRes, pnjRes] = await Promise.all([
    supabase
      .from("quartiers")
      .select("*")
      .eq("univers_id", univers.id)
      .order("ordre", { ascending: true }),
    supabase
      .from("lieux")
      .select("*")
      .eq("univers_id", univers.id)
      .order("ordre", { ascending: true }),
    supabase
      .from("pnj")
      .select("*")
      .eq("univers_id", univers.id)
      .order("ordre", { ascending: true }),
  ]);

  const quartiers = (quartiersRes.data ?? []) as Quartier[];
  const lieux = (lieuxRes.data ?? []) as Lieu[];
  const pnj = (pnjRes.data ?? []) as Pnj[];

  // 3) On résout le PNJ-pilier de chaque lieu (un index par id évite de
  //    rebalayer le tableau pour chaque lieu).
  const pnjParId = new Map(pnj.map((p) => [p.id, p]));
  const lieuxEnrichis: LieuAvecPilier[] = lieux.map((l) => ({
    ...l,
    pilier: l.pnj_pilier_id ? pnjParId.get(l.pnj_pilier_id) ?? null : null,
  }));

  // Les lieux regroupés par quartier (pour les passer à chaque fiche).
  const lieuxParQuartier = (quartierId: string) =>
    lieuxEnrichis.filter((l) => l.quartier_id === quartierId);

  return (
    <div className="mx-auto w-full max-w-5xl py-4">
      {/* Disposition : sur grand écran, sidebar à gauche + contenu à droite.
          Sur mobile, tout s'empile (sidebar au-dessus). */}
      <div className="lg:grid lg:grid-cols-[210px_1fr] lg:gap-8">
        {/* — La sidebar des chapitres — */}
        <aside className="mb-8 lg:mb-0 lg:sticky lg:top-6 lg:self-start">
          <SidebarChapitres accent={accent} />
        </aside>

        {/* — Le contenu de la bible — */}
        <div className="min-w-0">
          {/* En-tête de l'univers */}
          <header className="border-b-2 border-dotted border-line-2 pb-8">
            <span
              className="inline-block rounded-full border-2 bg-card px-3.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em]"
              style={{ borderColor: accent, color: accent }}
            >
              Bible vivante
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-none tracking-tight text-ink sm:text-5xl">
              {univers.nom}
            </h1>
            {univers.sous_titre && (
              <p
                className="mt-2 font-display text-lg italic"
                style={{ color: accent }}
              >
                {univers.sous_titre}
              </p>
            )}
            {univers.description_longue && (
              <div className="mt-5 max-w-2xl">
                <Markdown>{univers.description_longue}</Markdown>
              </div>
            )}
          </header>

          {/* La fiche d'identité (les fact chips) */}
          {univers.fiche_identite?.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 inline-flex items-center gap-2 rounded-full bg-sun-d px-3.5 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-card">
                📍 La fiche d’identité
              </h2>
              <FicheIdentite chips={univers.fiche_identite} />
            </section>
          )}

          {/* Chapitre I — La ville & ses quartiers */}
          <section id="chapitre-1" className="mt-12 scroll-mt-6">
            <h2
              className="mb-2 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-card"
              style={{ backgroundColor: accent }}
            >
              🌴 Chapitre I · La ville & ses quartiers
            </h2>
            <p className="mb-6 max-w-2xl font-display italic text-ink-soft">
              La géographie réelle de la ville, quartier par quartier, et
              l’ambiance de chacun.
            </p>

            {quartiers.length === 0 ? (
              // Pas encore de contenu : mot d'attente (cette session).
              <div className="rounded-3xl border-2 border-dashed border-line-2 bg-card/50 px-6 py-12 text-center">
                <p className="text-3xl">🌺</p>
                <p className="mt-3 font-display text-lg italic text-ink-soft">
                  Le lore détaillé arrive bientôt
                </p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-faint">
                  Les quartiers de {univers.nom} se déplient en ce moment même.
                  Reviens vite : le Centre-ville ouvre le bal.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {quartiers.map((q) => (
                  <QuartierFiche
                    key={q.id}
                    quartier={q}
                    lieux={lieuxParQuartier(q.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
