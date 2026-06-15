/**
 * Seal — le sceau officiel (DA §5) : monogramme « L » dans une
 * couronne de chêne, millésime MMXXVI. SVG, couleur via currentColor
 * (on passe `text-gold`). Accessible : <title> décrivant le sceau.
 */
export default function Seal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-labelledby="seal-title"
      className={className}
      fill="none"
      stroke="currentColor"
    >
      <title id="seal-title">Sceau de Legendia — monogramme L, MMXXVI</title>

      {/* double anneau */}
      <circle cx="60" cy="60" r="55" strokeWidth="1.5" opacity="0.9" />
      <circle cx="60" cy="60" r="49" strokeWidth="0.75" opacity="0.55" />

      {/* couronne de chêne : feuilles en arc de part et d'autre */}
      <g fill="currentColor" stroke="none" opacity="0.9">
        <path d="M22 60 q-6 -5 -3 -12 q7 2 6 11 Z" />
        <path d="M26 47 q-5 -6 -1 -13 q7 3 5 12 Z" />
        <path d="M34 36 q-3 -7 2 -13 q6 4 2 13 Z" />
        <path d="M98 60 q6 -5 3 -12 q-7 2 -6 11 Z" />
        <path d="M94 47 q5 -6 1 -13 q-7 3 -5 12 Z" />
        <path d="M86 36 q3 -7 -2 -13 q-6 4 -2 13 Z" />
      </g>

      {/* glands en bas de la couronne */}
      <g fill="currentColor" stroke="none" opacity="0.85">
        <circle cx="44" cy="92" r="2.4" />
        <circle cx="76" cy="92" r="2.4" />
      </g>

      {/* le monogramme L */}
      <text
        x="60"
        y="76"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "52px",
          fontWeight: 600,
        }}
      >
        L
      </text>

      {/* millésime */}
      <text
        x="60"
        y="104"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "3px",
        }}
      >
        MMXXVI
      </text>
    </svg>
  );
}
