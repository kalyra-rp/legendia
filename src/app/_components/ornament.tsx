/**
 * Ornament — filet ornemental (DA §5 : « le chêne & la mousse »).
 * Un trait horizontal symétrique avec un motif central (losange +
 * petites feuilles). Décoratif : aria-hidden. La couleur suit
 * `currentColor` → on lui passe `text-gold` via className.
 */
export default function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 16"
      role="presentation"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      {/* traits latéraux qui se rejoignent vers le centre */}
      <line x1="6" y1="8" x2="96" y2="8" opacity="0.5" />
      <line x1="144" y1="8" x2="234" y2="8" opacity="0.5" />
      {/* petits points aux extrémités */}
      <circle cx="6" cy="8" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="234" cy="8" r="1.4" fill="currentColor" stroke="none" />
      {/* losange central */}
      <path d="M120 2 L128 8 L120 14 L112 8 Z" fill="currentColor" stroke="none" />
      {/* feuilles encadrant le losange */}
      <path d="M104 8 q5 -5 11 0 q-5 5 -11 0 Z" fill="currentColor" stroke="none" opacity="0.85" />
      <path d="M136 8 q-5 -5 -11 0 q5 5 11 0 Z" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  );
}
