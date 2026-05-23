import Link from "next/link";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { LocationCard, type Location } from "@/components/LocationCard";

type Zone = {
  id: string;
  world_id: string;
  name: string;
  kind: string;
  description: string | null;
  hue: number;
};

/**
 * Page d'une zone.
 * Niveau 2 : on affiche le détail de la zone + ses lieux.
 * Chaque carte de lieu → /monde/lieu/[id].
 *
 * Next.js 16 : `params` est une Promise, on l'attend.
 */
export default async function ZonePage({
  params,
}: {
  params: Promise<{ zoneId: string }>;
}) {
  const { zoneId } = await params;
  const supabase = await createClient();

  // En parallèle : la zone + ses lieux. La RLS filtre les zones non
  // accessibles ; si la requête revient vide → état « zone introuvable ».
  const [zoneRes, locationsRes] = await Promise.all([
    supabase
      .from("zones")
      .select("id, world_id, name, kind, description, hue")
      .eq("id", zoneId)
      .maybeSingle<Zone>(),
    supabase
      .from("locations")
      .select(
        "id, name, kind, description, hue, time_label, weather, soundscape",
      )
      .eq("zone_id", zoneId)
      .order("name"),
  ]);

  const zone = zoneRes.data;
  const locations = (locationsRes.data ?? []) as Location[];

  if (!zone) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          Legendia
        </p>
        <h1 className="mt-4 font-display text-3xl font-medium text-ink">
          Zone introuvable.
        </h1>
        <Link
          href="/monde"
          className="mt-6 font-mono text-xs uppercase tracking-[0.22em] text-verdigris-deep underline-offset-4 hover:underline"
        >
          ← retour au monde
        </Link>
      </main>
    );
  }

  // Bandeau d'en-tête teinté façon « porte » d'entrée vers la zone.
  const headerStyle: CSSProperties = {
    backgroundColor: `hsl(${zone.hue} 38% 94%)`,
    borderColor: `hsl(${zone.hue} 28% 80%)`,
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
      <Link
        href="/monde"
        className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted underline-offset-4 transition hover:text-verdigris-deep hover:underline"
      >
        ← retour au monde
      </Link>

      <header
        className="mt-6 rounded-2xl border p-8 sm:p-10"
        style={headerStyle}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          zone · {zone.kind}
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          {zone.name}
        </h1>
        {zone.description && (
          <p className="mt-4 max-w-2xl font-serif text-base leading-relaxed text-ink/80">
            {zone.description}
          </p>
        )}
      </header>

      {locations.length === 0 ? (
        <p className="mt-16 text-center font-mono text-xs uppercase tracking-[0.25em] text-muted">
          aucun lieu pour l'instant dans cette zone
        </p>
      ) : (
        <section className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc, i) => (
            <LocationCard key={loc.id} location={loc} index={i} />
          ))}
        </section>
      )}
    </main>
  );
}
