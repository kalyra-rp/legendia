import type { CSSProperties } from "react";

type Size = "sm" | "md" | "lg";

type Props = {
  /** Nom du personnage (= voyageurs.name). Utilisé pour l'alt + l'initiale. */
  name: string;
  /** URL d'avatar du voyageur. Si null/vide → fallback initiale teintée. */
  avatarUrl: string | null | undefined;
  /** Teinte HSL (0–360) du voyageur, pour le fallback coloré. */
  hue: number | null | undefined;
  size?: Size;
};

const SIZE_CLASS: Record<Size, string> = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-lg",
};

/**
 * Pastille « faceclaim » d'un personnage.
 * - Si avatarUrl : on affiche l'image.
 * - Sinon : pastille colorée à partir de la `hue` du voyageur, avec la
 *   première lettre du nom au centre.
 *
 * On utilise <img> natif (pas next/image) pour ne pas avoir à déclarer
 * tous les domaines possibles (Discord CDN, Supabase Storage, etc.) dans
 * next.config.ts. Migration vers <Image> plus tard si besoin d'optim.
 */
export function Faceclaim({ name, avatarUrl, hue, size = "md" }: Props) {
  const sizeClass = SIZE_CLASS[size];
  const initial = (name.trim().charAt(0) || "?").toUpperCase();

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClass} flex-none rounded-full border border-line object-cover`}
      />
    );
  }

  const h = hue ?? 30; // fallback teinte cuivre douce
  const style: CSSProperties = {
    backgroundColor: `hsl(${h} 42% 84%)`,
    color: `hsl(${h} 40% 28%)`,
    borderColor: `hsl(${h} 35% 70%)`,
  };

  return (
    <span
      title={name}
      aria-label={name}
      className={`inline-flex ${sizeClass} flex-none select-none items-center justify-center rounded-full border font-display font-medium`}
      style={style}
    >
      {initial}
    </span>
  );
}
