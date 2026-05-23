import Link from "next/link";

/**
 * Placeholder du Codex.
 * À construire : encyclopédie du monde (lore, factions, histoires).
 */
export default function CodexPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
        bientôt
      </p>
      <h1 className="mt-4 font-display text-4xl font-medium text-ink sm:text-5xl">
        Le Codex
      </h1>
      <p className="mt-4 max-w-md font-serif text-base italic text-muted">
        L'encyclopédie des mondes prendra forme ici.
      </p>
      <Link
        href="/"
        className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-verdigris-deep underline-offset-4 hover:underline"
      >
        ← retour au Carnet
      </Link>
    </main>
  );
}
