import Link from "next/link";
import Seal from "./seal";

/**
 * Invitation — l'aboutissement du parcours de lecture, juste avant le
 * colophon. Une accroche, puis un bouton unique « Commencer ici » qui
 * mène au Vade-mecum (le volet hors-fiction : règles, création de perso).
 *
 * DA : l'audace concentrée sur ce seul point. Le bouton est traité comme
 * un objet précieux — sceau, libellé or, bordure qui s'allume à l'or au
 * survol. Effet discret (transition de couleurs uniquement, neutralisée
 * en motion réduite par la règle globale).
 */
export default function Invitation() {
  return (
    <section
      aria-labelledby="invitation-titre"
      className="flex flex-col items-center gap-7 px-6 py-24 text-center"
    >
      <h2 id="invitation-titre" className="sr-only">
        Commencer
      </h2>

      <p className="max-w-md font-display text-2xl italic leading-relaxed text-ink-soft sm:text-3xl">
        Le registre est ouvert. À vous d'y inscrire un nom.
      </p>

      <Link
        href="/vade-mecum"
        className="group inline-flex items-center gap-4 rounded-sm border border-line bg-leather2 px-7 py-4 transition-colors duration-500 hover:border-gold hover:bg-leather"
      >
        <Seal className="w-9 text-gold-lo transition-colors duration-500 group-hover:text-gold" />
        <span className="eyebrow text-gold transition-colors duration-500 group-hover:text-gold-hi">
          Commencer ici
        </span>
      </Link>
    </section>
  );
}
