import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "../_components/eyebrow";
import Marginalia from "../_components/marginalia";
import Ornament from "../_components/ornament";
import Seal from "../_components/seal";

export const metadata: Metadata = {
  title: "Le Vade-mecum — Legendia",
};

/**
 * Vade-mecum — page-talon. Le volet hors-fiction (règles, création de
 * personnage). Pas encore rédigé : on pose un fragment de registre dans
 * la DA, avec le sceau et une annotation manuscrite. Le contenu réel
 * viendra plus tard.
 */
export default function VadeMecumPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <Seal className="w-20 text-gold" />

      <Eyebrow className="text-gold">Hors-fiction</Eyebrow>

      <h1 className="gold-leaf font-display text-6xl font-bold sm:text-7xl">
        Le Vade-mecum
      </h1>

      <Ornament className="w-52 text-line" />

      <div className="relative">
        <p className="max-w-md font-body text-lg italic leading-relaxed text-ink-soft">
          Les règles du jeu et la création de personnage tiendront ici. La page
          est encore vierge — on attend la main qui l'écrira.
        </p>

        <Marginalia className="mt-8 lg:absolute lg:-right-44 lg:top-1 lg:mt-0 lg:w-36 lg:text-right">
          ce chapitre n'a pas encore été transcrit.
        </Marginalia>
      </div>

      <Link
        href="/"
        className="eyebrow mt-2 text-ink-soft underline-offset-4 hover:text-gold hover:underline"
      >
        ← Retour à l'accueil
      </Link>
    </main>
  );
}
