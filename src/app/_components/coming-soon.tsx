import Link from "next/link";
import Eyebrow from "./eyebrow";

/**
 * ComingSoon — talon partagé par les pages pas encore construites.
 * Reprend la nouvelle DA (nuit pourpre, or) et renvoie à l'accueil.
 *
 * VERSION PROVISOIRE (incrément 1) : un filet doré tient lieu d'ornement
 * en attendant l'emblème lanterne-étoile (incrément 2).
 */
export default function ComingSoon({
  title,
  eyebrow = "Bientôt",
}: {
  title: string;
  eyebrow?: string;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-night2 via-night to-night px-6 py-24 text-center">
      <Eyebrow className="text-gold">{eyebrow}</Eyebrow>

      <h1 className="gold-leaf font-display text-6xl font-bold sm:text-7xl">
        {title}
      </h1>

      <span
        aria-hidden="true"
        className="h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent"
      />

      <p className="max-w-md font-body text-lg italic leading-relaxed text-soft">
        Cette part de la cité n'a pas encore ouvert ses portes. Revenez
        bientôt — les lanternes s'allument une à une.
      </p>

      <Link
        href="/"
        className="eyebrow mt-2 text-soft underline-offset-4 transition-colors hover:text-gold hover:underline"
      >
        ← Retour à l'accueil
      </Link>
    </main>
  );
}
