import type { ReactNode } from "react";

/**
 * Eyebrow — petit label en petites capitales espacées (DA §5).
 * Réutilisé pour les sur-titres et les libellés de section.
 */
export default function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow ${className}`.trim()}>{children}</p>;
}
