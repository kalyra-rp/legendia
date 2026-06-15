import type { Metadata } from "next";
import { Cormorant, EB_Garamond } from "next/font/google";
import "./globals.css";

// --- Polices (Google Fonts, auto-hébergées par next/font : zéro requête runtime) ---
// Cormorant : les TITRES (serif gravé, élégant). Exposée en variable CSS --font-cormorant.
const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

// EB Garamond : le CORPS (livresque). Exposée en variable CSS --font-eb-garamond.
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-eb-garamond",
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
  // lang="fr" : projet francophone. On accroche les deux variables de police sur <html>
  // pour qu'elles soient disponibles partout (utilisées via les tokens du thème dans globals.css).
  return (
    <html lang="fr" className={`${cormorant.variable} ${ebGaramond.variable}`}>
      <body>{children}</body>
    </html>
  );
}
