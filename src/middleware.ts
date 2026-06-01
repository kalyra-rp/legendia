// Le middleware tourne AVANT chaque page/route correspondant au "matcher".
// Ici, son seul rôle pour l'instant : garder la session Supabase fraîche.
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // On exécute le middleware partout, SAUF sur les fichiers statiques et les
  // images (inutile d'y rafraîchir une session, et ça gagne en performance).
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
