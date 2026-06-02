// LE LAYOUT DE L'ESPACE CONNECTÉ.
//
// Pourquoi un dossier "(app)" entre parenthèses ?  En Next.js (App Router),
// un dossier entre parenthèses est un « route group » : il SERT à regrouper
// des pages sous un même layout SANS apparaître dans l'URL. Autrement dit,
// la page src/app/(app)/hall/page.tsx reste accessible à l'adresse "/hall"
// (et non "/app/hall"). On gagne un endroit unique pour :
//   • appliquer le verrou d'accès une seule fois,
//   • afficher la coque commune (navigation + menu profil),
//   • sans dupliquer ce code sur chaque page.
//
// Le Seuil (src/app/page.tsx) vit EN DEHORS de ce groupe : il garde donc le
// layout racine nu, sans navigation — c'est voulu, c'est la page publique.
//
// Ce fichier est un Server Component (pas de "use client") : il peut donc lire
// la session et la base AVANT de rendre quoi que ce soit.
import { exigerMembre } from "@/lib/auth/exiger-membre";
import { NavPrincipale } from "./_components/nav-principale";
import { MenuProfil } from "./_components/menu-profil";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // LE VERROU : session valide + appartenance Discord en direct, sinon cette
  // fonction redirige et la suite n'est jamais rendue. Elle nous renvoie le
  // profil pour habiller l'interface.
  const profil = await exigerMembre();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {/* Navigation (fixée en bas sur mobile, à gauche sur desktop) et menu
          profil (fixé en haut à droite) : tous deux "fixed", donc hors du flux. */}
      <NavPrincipale />
      <MenuProfil
        pseudo={profil.pseudo}
        avatar={profil.avatar}
        role={profil.role}
      />

      {/* La zone de contenu. On lui réserve de la marge pour qu'aucun contenu ne
          passe SOUS les barres fixes :
            • pb-24      → place pour la barre du bas (mobile)
            • md:pb-0    → plus de barre en bas sur desktop
            • md:pl-20   → place pour la colonne de gauche (desktop)
          pt-16 laisse respirer le haut sous l'avatar du menu profil. */}
      <main className="flex flex-1 flex-col px-6 pb-24 pt-16 md:pb-10 md:pl-20">
        {children}
      </main>
    </div>
  );
}
