import Link from "next/link";

/**
 * Placeholder de la création de Voyageur.
 * Le Dashboard (/) redirige ici quand le joueur n'a pas encore de voyageur.
 * À construire ensuite : formulaire de création (name, bio, hue…).
 */
export default function ArriveePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
        bientôt
      </p>
      <h1 className="mt-4 font-display text-4xl font-medium text-ink sm:text-5xl">
        Crée ton Voyageur
      </h1>
      <p className="mt-4 max-w-md font-serif text-base italic text-muted">
        Le formulaire d'arrivée arrivera dans la prochaine étape. Pour l'instant
        ton voyageur existe déjà en base.
      </p>
      <Link
        href="/login"
        className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-verdigris-deep underline-offset-4 hover:underline"
      >
        ← retour à la connexion
      </Link>
    </main>
  );
}
