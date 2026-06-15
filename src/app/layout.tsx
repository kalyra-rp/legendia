import type { Metadata } from "next";
import { Playfair_Display, Tangerine, Cinzel, Lora } from "next/font/google";
import "./globals.css";

// --- Polices (Google Fonts, auto-hébergées par next/font : zéro requête runtime) ---

// Playfair Display : les TITRES (serif élégant, baroque maîtrisé). --font-playfair.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

// Lora : le CORPS (serif chaleureux et lisible). --font-lora.
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

// Tangerine : la TAGLINE calligraphiée (script fin, féerique), en or. --font-tangerine.
const tangerine = Tangerine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-tangerine",
  display: "swap",
});

// Cinzel : les PETITES CAPITALES / labels (letter-spacing large). --font-cinzel.
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Legendia — Venez vivre une autre vie",
  description:
    "Legendia, la cité des légendes. Un jeu de rôle narratif où l'on vient vivre une autre vie dans une cité somptueuse et magique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // lang="fr" : projet francophone. Les quatre variables de police sont
  // accrochées sur <html> pour être disponibles partout (via les tokens du thème).
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${lora.variable} ${tangerine.variable} ${cinzel.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
