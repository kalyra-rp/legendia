import { inscriptions } from "../_data/homepage";
import Eyebrow from "./eyebrow";

/**
 * Inscriptions — le fil des « dernières inscriptions au dossier » :
 * de petits faits divers, datés et situés, comme consignés à la main.
 */
export default function Inscriptions() {
  return (
    <section
      aria-labelledby="inscriptions-titre"
      className="mx-auto max-w-3xl px-6 py-24"
    >
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <Eyebrow className="text-gold">Dernières inscriptions au dossier</Eyebrow>
        <h2
          id="inscriptions-titre"
          className="font-display text-4xl font-medium text-ink"
        >
          Ce qui s'est consigné récemment
        </h2>
      </div>

      <ol className="flex flex-col">
        {inscriptions.map((item, index) => (
          <li
            key={`${item.date}-${item.lieu}`}
            className={`flex flex-col gap-2 py-6 sm:flex-row sm:gap-8 ${
              index > 0 ? "border-t border-line" : ""
            }`}
          >
            {/* colonne date + lieu */}
            <div className="sm:w-40 sm:shrink-0">
              <p className="font-display text-lg text-gold">{item.lieu}</p>
              <p className="eyebrow text-[0.62rem] text-ink-dim">{item.date}</p>
            </div>
            {/* le fait */}
            <p className="font-body leading-relaxed text-ink-soft">
              {item.texte}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
