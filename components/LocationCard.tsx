import type { CSSProperties } from "react";

export type Location = {
  id: string;
  name: string;
  kind: string;
  description: string | null;
  hue: number; // 0–360
  time_label: string | null;
  weather: string | null;
  soundscape: string | null;
};

type Props = {
  location: Location;
  /** Index dans la grille — pilote le délai du stagger d'apparition. */
  index: number;
};

/**
 * Carte d'un lieu. Le fond et la bordure sont légèrement teintés à partir
 * de la `hue` du lieu (HSL faible saturation pour rester compatible avec
 * la palette « paper »). Apparition décalée gérée via `animationDelay`.
 */
export function LocationCard({ location, index }: Props) {
  const cardStyle: CSSProperties = {
    backgroundColor: `hsl(${location.hue} 38% 94%)`,
    borderColor: `hsl(${location.hue} 28% 80%)`,
    animationDelay: `${index * 70}ms`,
  };

  const accentStyle: CSSProperties = {
    background: `hsl(${location.hue} 48% 58%)`,
    opacity: 0.35,
  };

  const ambiance = [location.time_label, location.weather]
    .filter(Boolean)
    .join(" · ");

  // TODO(prochaine étape) : envelopper l'<article> dans un <Link
  // href={`/lieu/${location.id}`}> une fois la route de scène créée.
  return (
    <article
      className="fade-up group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-14px_rgba(67,52,45,0.28)]"
      style={cardStyle}
    >
      {/* Liseré coloré en haut, dérivé du hue */}
      <span
        aria-hidden
        className="absolute inset-x-6 top-0 h-px"
        style={accentStyle}
      />

      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        {location.kind}
      </p>

      <h2 className="mt-2 font-display text-2xl font-medium leading-tight text-ink transition-colors duration-300 group-hover:text-verdigris-deep">
        {location.name}
      </h2>

      {ambiance && (
        <p className="mt-3 font-serif text-sm italic text-muted">{ambiance}</p>
      )}
    </article>
  );
}
