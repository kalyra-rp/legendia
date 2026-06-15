import type { Metadata } from "next";
import { Cormorant, EB_Garamond, Petit_Formal_Script } from "next/font/google";
import "./globals.css";

// --- Polices (Google Fonts, auto-hébergées par next/font : zéro requête runtime) ---
// Cormorant : les TITRES (serif gravé, élégant). Variable CSS --font-cormorant.
const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

// EB Garamond : le CORPS (livresque). Variable CSS --font-eb-garamond.
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-eb-garamond",
  display: "swap",
});

// Petit Formal Script : la CURSIVE manuscrite des annotations en marge (DA §5).
// C'est la « main inconnue » qui écrit en rouge oxydé. Variable CSS --font-cursive.
const petitFormal = Petit_Formal_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cursive",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Legendia",
  description: "Savannah, Géorgie, 2026 — un registre vivant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // lang="fr" : projet francophone. Les trois variables de police sont accrochées
  // sur <html> pour être disponibles partout (consommées via les tokens du thème).
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${ebGaramond.variable} ${petitFormal.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
