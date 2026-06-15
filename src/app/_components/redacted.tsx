import type { ReactNode } from "react";

/**
 * Redacted — un passage caviardé (DA §5).
 * Visuellement : une barre noire couvrante.
 * Accessibilité : le texte masqué est retiré aux lecteurs d'écran
 * (aria-hidden) et remplacé par un substitut neutre annoncé via
 * `sr-only` — on ne « lit » jamais à voix haute ce que l'image cache.
 */
export default function Redacted({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="redacted" aria-hidden="true">
        {children}
      </span>
      <span className="sr-only"> [passage caviardé] </span>
    </>
  );
}
