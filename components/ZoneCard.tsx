import Link from "next/link";
import type { CSSProperties } from "react";

export type Zone = {
  id: string;
  name: string;
  kind: string;
  description: string | null;
  hue: number; // 0–360
  sort_order: number | null;
};

type Props = {
  zone: Zone;
  /** Index dans la grille — pilote le délai d'apparition (stagger). */
  index: number;
};

/**
 * Carte d'une zone. Même grammaire visuelle que LocationCard, mais avec
 * la description (un peu plus de texte) en bas pour donner du contexte.
 * Le fond/bordure sont teintés à partir du hue.
 */
export function ZoneCard({ zone, index }: Props) {
  const cardStyle: CSSProperties = {
    backgroundColor: `hsl(${zone.hue} 38% 94%)`,
    borderColor: `hsl(${zone.hue} 28% 80%)`,
    animationDelay: `${index * 70}ms`,
  };

  const accentStyle: CSSProperties = {
    background: `hsl(${zone.hue} 48% 58%)`,
    opacity: 0.35,
  };

  return (
    <Link
      href={`/monde/zone/${zone.id}`}
      className="fade-up group relative block overflow-hidden rounded-2xl border p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-14px_rgba(67,52,45,0.28)]"
      style={cardStyle}
    >
      <span
        aria-hidden
        className="absolute inset-x-6 top-0 h-px"
        style={accentStyle}
      />

      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        {zone.kind}
      </p>

      <h2 className="mt-2 font-display text-2xl font-medium leading-tight text-ink transition-colors duration-300 group-hover:text-verdigris-deep">
        {zone.name}
      </h2>

      {zone.description && (
        <p className="mt-3 font-serif text-sm italic leading-relaxed text-muted line-clamp-3">
          {zone.description}
        </p>
      )}
    </Link>
  );
}
