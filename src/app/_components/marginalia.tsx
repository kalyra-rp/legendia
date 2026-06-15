import type { ReactNode } from "react";

/**
 * Marginalia — l'annotation en marge (DA §5), « la main inconnue ».
 * C'est du CONTENU (lisible, donc pas masqué aux lecteurs d'écran) :
 * une note ajoutée après coup, en cursive rouge oxydé.
 * Sémantiquement, une note de marge → <aside>.
 */
export default function Marginalia({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside role="note" className={`marginalia ${className}`.trim()}>
      {children}
    </aside>
  );
}
