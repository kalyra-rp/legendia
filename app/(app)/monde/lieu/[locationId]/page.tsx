import Link from "next/link";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { OpenSceneForm, type Candidate } from "./OpenSceneForm";

type LocationRow = {
  id: string;
  world_id: string;
  zone_id: string | null;
  name: string;
  kind: string;
  hue: number;
  time_label: string | null;
  weather: string | null;
  soundscape: string | null;
};

type SceneRow = {
  id: string;
  title: string;
  status: "open" | "active" | "closed" | "archived";
  updated_at: string;
  posts: { count: number }[];
};

type CandidateRow = {
  id: string;
  title: string | null;
  voyageurs: {
    id: string;
    name: string;
    status: string;
    current_world_id: string | null;
    user_id: string;
  } | null;
};

/**
 * Page d'un lieu.
 * Niveau 3 : on affiche l'ambiance du lieu, la liste de ses scènes, et
 * le formulaire pour en ouvrir une nouvelle.
 */
export default async function LieuPage({
  params,
}: {
  params: Promise<{ locationId: string }>;
}) {
  const { locationId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return <NotFound message="Session expirée." />;
  }

  // 1. Le lieu (pour son world_id et l'ambiance).
  const { data: location } = await supabase
    .from("locations")
    .select(
      "id, world_id, zone_id, name, kind, hue, time_label, weather, soundscape",
    )
    .eq("id", locationId)
    .maybeSingle<LocationRow>();

  if (!location) return <NotFound message="Lieu introuvable." />;

  // 2. En parallèle : scènes (avec compteur de posts) + partenaires possibles.
  // Pour les partenaires : autres incarnations du monde dont le voyageur est
  // validé et présent dans ce monde. La RLS protège déjà la lecture, on
  // ajoute juste les filtres métier ici.
  const [scenesRes, candidatesRes] = await Promise.all([
    supabase
      .from("scenes")
      .select("id, title, status, updated_at, posts(count)")
      .eq("location_id", locationId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("incarnations")
      .select(
        "id, title, voyageurs!inner(id, name, status, current_world_id, user_id)",
      )
      .eq("world_id", location.world_id)
      .eq("voyageurs.status", "valide")
      .eq("voyageurs.current_world_id", location.world_id)
      .neq("voyageurs.user_id", user.id),
  ]);

  const scenes = (scenesRes.data ?? []) as SceneRow[];
  const candidatesRaw = (candidatesRes.data ?? []) as unknown as CandidateRow[];

  const candidates: Candidate[] = candidatesRaw
    .filter((c) => c.voyageurs)
    .map((c) => ({
      incarnationId: c.id,
      incarnationTitle: c.title,
      voyageurName: c.voyageurs!.name,
    }));

  const headerStyle: CSSProperties = {
    backgroundColor: `hsl(${location.hue} 38% 94%)`,
    borderColor: `hsl(${location.hue} 28% 80%)`,
  };

  const ambianceParts = [
    location.time_label,
    location.weather,
    location.soundscape,
  ].filter(Boolean);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-24">
      <BackToZone zoneId={location.zone_id} />

      {/* En-tête immersive */}
      <header
        className="mt-6 rounded-2xl border p-8 sm:p-10"
        style={headerStyle}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          lieu · {location.kind}
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          {location.name}
        </h1>
        {ambianceParts.length > 0 && (
          <p className="mt-4 font-serif text-base italic text-ink/75">
            {ambianceParts.join(" · ")}
          </p>
        )}
      </header>

      {/* Liste des scènes */}
      <section className="mt-14">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          scènes au lieu
        </h2>

        {scenes.length === 0 ? (
          <p className="mt-4 font-serif text-base italic text-muted">
            Aucune scène ouverte ici pour l'instant — sois la première plume.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {scenes.map((s) => (
              <SceneRowItem key={s.id} scene={s} />
            ))}
          </ul>
        )}
      </section>

      {/* Ouvrir une nouvelle scène */}
      <section className="mt-16">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          ouvrir une scène ici
        </h2>
        <p className="mt-2 max-w-xl font-serif text-sm italic text-muted">
          Une scène est fermée (2 à 4 participants). Tu choisis qui entre avec
          toi à l'ouverture ; seuls les participants pourront écrire.
        </p>
        <div className="mt-6">
          <OpenSceneForm locationId={location.id} candidates={candidates} />
        </div>
      </section>
    </main>
  );
}

function SceneRowItem({ scene }: { scene: SceneRow }) {
  const count = scene.posts?.[0]?.count ?? 0;
  return (
    <li>
      <Link
        href={`/monde/scene/${scene.id}`}
        className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-paper/60 px-5 py-4 transition hover:-translate-y-0.5 hover:border-copper hover:bg-paper"
      >
        <div className="min-w-0">
          <p className="font-display text-lg font-medium text-ink transition-colors group-hover:text-verdigris-deep">
            {scene.title}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            <StatusDot status={scene.status} /> {scene.status} ·{" "}
            {timeAgo(scene.updated_at)} ·{" "}
            {count} post{count > 1 ? "s" : ""}
          </p>
        </div>
        <span
          aria-hidden
          className="font-mono text-base text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-verdigris-deep"
        >
          →
        </span>
      </Link>
    </li>
  );
}

function StatusDot({ status }: { status: SceneRow["status"] }) {
  const color: Record<SceneRow["status"], string> = {
    open: "bg-verdigris",
    active: "bg-copper",
    closed: "bg-muted",
    archived: "bg-line",
  };
  return (
    <span
      aria-hidden
      className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${color[status]}`}
    />
  );
}

async function BackToZone({ zoneId }: { zoneId: string | null }) {
  if (!zoneId) {
    return (
      <Link
        href="/monde"
        className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted underline-offset-4 transition hover:text-verdigris-deep hover:underline"
      >
        ← retour au monde
      </Link>
    );
  }
  return (
    <Link
      href={`/monde/zone/${zoneId}`}
      className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted underline-offset-4 transition hover:text-verdigris-deep hover:underline"
    >
      ← retour à la zone
    </Link>
  );
}

function NotFound({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
        Legendia
      </p>
      <h1 className="mt-4 font-display text-3xl font-medium text-ink">
        {message}
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

/* ───────────── Helpers ───────────── */

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `il y a ${d} j`;
  return new Date(iso).toLocaleDateString("fr-FR");
}
