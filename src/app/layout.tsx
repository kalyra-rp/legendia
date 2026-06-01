import type { Metadata } from "next";
// next/font charge les polices au build et les sert depuis NOTRE domaine :
// rapide, privé, et sans clignotement de police au chargement.
import { Fraunces, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Fraunces : la serif des titres (chaleureuse, un peu littéraire).
// On expose chaque police comme une "variable CSS" que Tailwind lira ensuite.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

// Plus Jakarta Sans : le texte courant.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// IBM Plex Mono : les petites étiquettes en majuscules (le côté "atelier").
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Les métadonnées de l'onglet du navigateur et du partage de lien.
export const metadata: Metadata = {
  title: "Legendia — Le Seuil",
  description:
    "Legendia, studio de jeu de rôle narratif « slice of life ». Premier univers : Saint-Pierre, à La Réunion. Bientôt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // lang="fr" : tout le site est en français (lecteurs d'écran, SEO…).
    // On colle les 3 variables de police sur <html> pour qu'elles soient
    // disponibles partout.
    <html
      lang="fr"
      className={`${fraunces.variable} ${jakarta.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
