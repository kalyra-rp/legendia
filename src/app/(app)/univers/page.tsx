// LES UNIVERS — page volontairement vide pour l'instant.
//
// On la remplira à l'étape suivante de la Phase II (la carte des univers, puis
// l'entrée dans Saint-Pierre 974). Pour l'heure, un titre et un mot d'attente.
// L'accès est garanti par le layout du groupe (app).
export default function UniversPage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center text-center">
      <span className="inline-block rounded-full border-2 border-indigo bg-card px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-indigo">
        Les Univers
      </span>
      <h1 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
        Les Univers
      </h1>
      <p className="mt-4 max-w-sm text-ink-soft">
        Saint-Pierre 974 arrive très bientôt 🌺
      </p>
    </section>
  );
}
