/**
 * Barre de statut « tableau d'affichage de gare ».
 * Très fine, ton cuivre, affiche en permanence le monde courant.
 * Server Component pur — pas de JS shipé pour cette barre.
 */
export function StatusBar({ worldName }: { worldName: string | null }) {
  return (
    <header
      className="sticky top-0 z-20 border-b border-line bg-paper/95 px-4 py-2 backdrop-blur sm:px-6"
      role="status"
      aria-live="polite"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-copper">
        <span aria-hidden className="mr-2">▸</span>
        actuellement à&nbsp;:&nbsp;
        <span className="text-ink">
          {worldName ?? "aucun monde"}
        </span>
      </p>
    </header>
  );
}
