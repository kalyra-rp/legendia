// Route de retour OAuth : Supabase nous renvoie ici après Discord.
//
// C'est un "Route Handler" (pas une page) : il ne rend pas d'écran, il fait un
// travail technique puis redirige. Il reçoit un "code" à usage unique dans
// l'URL, l'échange contre une vraie session (cookies), puis envoie vers /hall.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Où aller après connexion réussie (par défaut : le Hall).
  const next = searchParams.get("next") ?? "/hall";

  if (code) {
    const supabase = await createClient();
    // L'échange : "code temporaire" → "session". En cas de succès, les cookies
    // de session sont posés automatiquement par notre client serveur.
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // En production, Vercel place le vrai domaine dans x-forwarded-host :
      // on l'utilise pour rediriger vers la bonne adresse (et pas une URL interne).
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocal = process.env.NODE_ENV === "development";

      if (isLocal) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Pas de code, ou échange en échec → retour au Seuil avec un indicateur
  // d'erreur (on pourra afficher un message plus tard).
  return NextResponse.redirect(`${origin}/?erreur_connexion=1`);
}
