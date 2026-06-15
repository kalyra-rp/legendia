import Link from "next/link";
import Eyebrow from "./eyebrow";
import Ornament from "./ornament";

/**
 * ComingSoon — talon partagé par les espaces pas encore construits
 * (Atlas / Registre / Gazette). Reprend la DA et renvoie à l'accueil.
 */
export default function ComingSoon({
  numeral,
  title,
}: {
  numeral: string;
  title: string;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <Eyebrow className="text-gold">{numeral}</Eyebrow>

      <h1 className="gold-leaf font-display text-6xl font-bold sm:text-7xl">
        {title}
      </h1>

      <Ornament className="w-52 text-line" />

      <p className="max-w-md font-body text-lg italic leading-relaxed text-ink-soft">
        Ce chapitre du registre est en cours de rédaction. Repassez bientôt —
        l'encre n'est pas encore sèche.
      </p>

      <Link
        href="/"
        className="eyebrow mt-2 text-ink-soft underline-offset-4 hover:text-gold hover:underline"
      >
        ← Retour à l'accueil
      </Link>
    </main>
  );
}
