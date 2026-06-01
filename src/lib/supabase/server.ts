// Client Supabase pour le SERVEUR (Server Components, Server Actions, routes API).
//
// Côté serveur, Supabase a besoin de lire/écrire les cookies de session pour
// savoir QUI est connecté (ce sera la base de l'auth Discord en Phase I).
// On lui branche donc les cookies de la requête en cours via next/headers.
//
// Note : cette fonction est `async` car, dans Next.js 16, `cookies()` est asynchrone.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Appelé depuis un Server Component (où l'on ne peut pas écrire de
            // cookie). Sans danger : un middleware rafraîchira la session.
            // On l'ajoutera en Phase I quand on branchera l'auth.
          }
        },
      },
    },
  );
}
