// Rafraîchissement de session pour le middleware.
//
// Les sessions Supabase vivent dans des cookies qui expirent. À chaque
// requête, ce code redonne un coup de jeune au cookie de session (sinon
// l'utilisateur serait déconnecté au bout d'un moment). C'est le branchement
// standard recommandé par Supabase pour Next.js.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // On part d'une réponse "laisse passer" ; on y recollera les cookies à jour.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // On écrit les cookies à la fois sur la requête (pour la suite du
          // traitement) et sur la réponse (pour les renvoyer au navigateur).
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT : cet appel déclenche le rafraîchissement du token si besoin.
  // Ne rien mettre entre la création du client et ce getUser().
  await supabase.auth.getUser();

  return supabaseResponse;
}
