import Link from "next/link";
import type { Plaque as PlaqueData } from "../_data/homepage";

/**
 * Plaque — une carte cliquable I / II / III (DA : sobriété + un seul
 * geste d'audace). Effets au survol ET au focus clavier (accessibilité) :
 *  - léger soulèvement (-translate-y)
 *  - lueur chaude (ombre dorée)
 *  - soulignement or qui se trace de gauche à droite
 */
export default function Plaque({ numeral, title, blurb, href }: PlaqueData) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-sm border border-line bg-leather p-7 transition duration-300 ease-out hover:-translate-y-1 hover:border-gold-lo hover:shadow-[0_18px_50px_-22px_rgba(200,163,92,0.5)] focus-visible:-translate-y-1 focus-visible:border-gold-lo"
    >
      <span className="eyebrow text-gold">{numeral}</span>

      <h3 className="font-display text-3xl font-medium leading-tight text-ink">
        {title}
      </h3>

      <p className="font-body text-[0.98rem] leading-relaxed text-ink-soft">
        {blurb}
      </p>

      {/* soulignement or qui se trace au survol / focus */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-7 h-px w-0 bg-gold transition-all duration-500 ease-out group-hover:w-[calc(100%-3.5rem)] group-focus-visible:w-[calc(100%-3.5rem)]"
      />
    </Link>
  );
}
