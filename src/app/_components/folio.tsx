import Eyebrow from "./eyebrow";
import Marginalia from "./marginalia";
import Redacted from "./redacted";

/**
 * Folio — l'aperçu d'une fiche de lignée (« Les Ardoyne »), stylée
 * comme une vraie page de registre : métadonnées, texte avec passages
 * caviardés, annotation manuscrite en marge, et le tampon « accès
 * initiés » apposé de travers.
 *
 * Métadonnées en <dl> (liste de définitions) = la structure sémantique
 * juste pour des paires libellé/valeur.
 */

const META: { label: string; value: string }[] = [
  { label: "Lignée", value: "Ardoyne" },
  { label: "Strate", value: "Fond sudiste" },
  { label: "Première mention", value: "1797" },
  { label: "Foyer", value: "Savannah, quartier historique" },
];

export default function Folio() {
  return (
    <section
      aria-labelledby="folio-titre"
      className="mx-auto max-w-3xl px-6 py-24"
    >
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <Eyebrow className="text-gold">Aperçu d'un folio</Eyebrow>
        <h2
          id="folio-titre"
          className="font-display text-4xl font-medium text-ink"
        >
          Une page du registre
        </h2>
      </div>

      {/* la « page » */}
      <article className="relative overflow-hidden rounded-sm border border-line bg-leather2 p-8 shadow-[inset_0_1px_0_rgba(236,224,198,0.04)] sm:p-10">
        {/* tampon de travers, en haut à droite */}
        <span className="stamp pointer-events-none absolute right-6 top-8 select-none text-xs sm:right-10">
          Accès initiés
        </span>

        {/* en-tête de fiche */}
        <header className="mb-6 border-b border-line pb-5">
          <Eyebrow className="text-ink-dim">Fiche de lignée</Eyebrow>
          <h3 className="mt-2 font-display text-5xl font-semibold text-gold">
            Les Ardoyne
          </h3>
        </header>

        {/* métadonnées */}
        <dl className="mb-7 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {META.map((row) => (
            <div
              key={row.label}
              className="flex justify-between gap-4 border-b border-line/60 pb-1"
            >
              <dt className="eyebrow text-[0.66rem] text-ink-dim">
                {row.label}
              </dt>
              <dd className="font-body text-sm text-ink-soft">{row.value}</dd>
            </div>
          ))}
        </dl>

        {/* corps : du texte avec passages caviardés + note en marge */}
        <div className="relative">
          <p className="font-body leading-loose text-ink">
            Vieille famille du fond sudiste, les Ardoyne tiennent maison à
            Savannah depuis{" "}
            <Redacted>avant la fondation officielle de la paroisse</Redacted>.
            On leur prête une empreinte discrète : les chiens du quartier
            changent de trottoir, les horloges de la demeure retardent toutes de
            la même minute. La rumeur initiée les dit{" "}
            <Redacted>gardiens d'un seuil que la ville a oublié</Redacted>, mais
            aucune pièce ne l'atteste au dossier.
          </p>

          <Marginalia className="mt-7 lg:absolute lg:-right-40 lg:top-0 lg:mt-0 lg:w-32 lg:text-right">
            j'ai connu la grand-mère. elle savait.
          </Marginalia>
        </div>
      </article>
    </section>
  );
}
