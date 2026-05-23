import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Faceclaim } from "@/components/Faceclaim";
import { PostComposer } from "./PostComposer";

type Scene = {
  id: string;
  title: string;
  status: "open" | "active" | "closed" | "archived";
  world_id: string;
  location_id: string;
  created_at: string;
  updated_at: string;
};

type LocationLite = {
  id: string;
  name: string;
  kind: string;
  hue: number;
  time_label: string | null;
  weather: string | null;
  soundscape: string | null;
};

type VoyageurLite = {
  id: string;
  name: string;
  avatar_url: string | null;
  hue: number | null;
};

type ParticipantRow = {
  incarnation_id: string;
  position: number | null;
  incarnations: {
    id: string;
    title: string | null;
    voyageurs: VoyageurLite | null;
  } | null;
};

type PostRow = {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
  incarnation_id: string;
  incarnations: {
    id: string;
    title: string | null;
    voyageurs: VoyageurLite | null;
  } | null;
};

/**
 * Page d'une scène — lecture + écriture.
 *
 * Tour fixe : les participants ont une `position` (0..N-1). Le prochain
 * à écrire est celui dont position = (postsCount mod participantsCount).
 *
 * IMPORTANT : on n'affiche JAMAIS l'utilisateur Discord. Tout ce qui est
 * visible vient de l'incarnation et du voyageur (= le personnage).
 */
export default async function ScenePage({
  params,
}: {
  params: Promise<{ sceneId: string }>;
}) {
  const { sceneId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <NotFound message="Session expirée." />;

  // 1. La scène + son lieu.
  const { data: sceneRaw } = await supabase
    .from("scenes")
    .select(
      "id, title, status, world_id, location_id, created_at, updated_at, locations(id, name, kind, hue, time_label, weather, soundscape)",
    )
    .eq("id", sceneId)
    .maybeSingle();

  if (!sceneRaw) return <NotFound message="Scène introuvable." />;

  // Embed location : Supabase peut renvoyer un objet ou un tableau selon
  // la résolution de la FK. On normalise.
  const scene = sceneRaw as unknown as Scene & {
    locations: LocationLite | LocationLite[] | null;
  };
  const location: LocationLite | null = Array.isArray(scene.locations)
    ? scene.locations[0] ?? null
    : scene.locations ?? null;

  // 2. En parallèle : participants (triés par position) + posts + mon voyageur.
  const [participantsRes, postsRes, myVoyageurRes] = await Promise.all([
    supabase
      .from("scene_participants")
      .select(
        "incarnation_id, position, incarnations(id, title, voyageurs(id, name, avatar_url, hue))",
      )
      .eq("scene_id", sceneId)
      .order("position", { ascending: true, nullsFirst: false }),
    supabase
      .from("posts")
      .select(
        "id, body, created_at, author_id, incarnation_id, incarnations(id, title, voyageurs(id, name, avatar_url, hue))",
      )
      .eq("scene_id", sceneId)
      .order("created_at", { ascending: true }),
    supabase
      .from("voyageurs")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle<{ id: string }>(),
  ]);

  // 3. Mon incarnation dans CE monde (séquentiel, dépend de myVoyageurRes).
  let myIncarnationId: string | null = null;
  if (myVoyageurRes.data) {
    const { data: myInc } = await supabase
      .from("incarnations")
      .select("id")
      .eq("voyageur_id", myVoyageurRes.data.id)
      .eq("world_id", scene.world_id)
      .maybeSingle<{ id: string }>();
    myIncarnationId = myInc?.id ?? null;
  }

  const participants = (participantsRes.data ?? []) as unknown as ParticipantRow[];
  const posts = (postsRes.data ?? []) as unknown as PostRow[];

  // 4. Calcul du tour. Si pas de participants → pas de tour (cas dégénéré).
  const isParticipant =
    !!myIncarnationId &&
    participants.some((p) => p.incarnation_id === myIncarnationId);

  const turnIndex =
    participants.length > 0 ? posts.length % participants.length : 0;
  const currentTurn = participants[turnIndex] ?? null;
  const currentTurnVoy = currentTurn?.incarnations?.voyageurs ?? null;
  const currentTurnName = currentTurnVoy?.name ?? null;
  const myTurn = isParticipant && currentTurn?.incarnation_id === myIncarnationId;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
      <Link
        href={`/monde/lieu/${scene.location_id}`}
        className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted underline-offset-4 transition hover:text-verdigris-deep hover:underline"
      >
        ← retour au lieu
      </Link>

      {/* En-tête de scène */}
      <header className="mt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          scène · <StatusInline status={scene.status} />
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
          {scene.title}
        </h1>
        {location && (
          <p className="mt-3 font-serif text-base italic text-muted">
            au <span className="text-ink">{location.name}</span>
            {ambianceFor(location) && ` · ${ambianceFor(location)}`}
          </p>
        )}

        {/* Bandeau participants — personnages (jamais le joueur). */}
        <div className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            autour de la table
          </p>
          {participants.length === 0 ? (
            <p className="mt-2 font-serif text-sm italic text-muted">
              Aucun participant pour l'instant.
            </p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-3">
              {participants.map((p) => {
                const voy = p.incarnations?.voyageurs;
                if (!voy) return null;
                const isCurrent = p.incarnation_id === currentTurn?.incarnation_id;
                return (
                  <li
                    key={p.incarnation_id}
                    className="flex items-center gap-2.5"
                  >
                    <Faceclaim
                      name={voy.name}
                      avatarUrl={voy.avatar_url}
                      hue={voy.hue}
                      size="sm"
                    />
                    <span className="flex flex-col leading-tight">
                      <span
                        className={`font-display text-sm ${isCurrent ? "text-verdigris-deep" : "text-ink"}`}
                      >
                        {voy.name}
                      </span>
                      {p.incarnations?.title && (
                        <span className="font-serif text-xs italic text-muted">
                          {p.incarnations.title}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </header>

      <span
        aria-hidden
        className="mx-auto my-10 block h-px w-16 bg-copper opacity-50"
      />

      {/* Fil de posts */}
      <section aria-label="Posts">
        {posts.length === 0 ? (
          <p className="text-center font-serif text-base italic text-muted">
            La scène attend sa première plume.
          </p>
        ) : (
          <ol className="space-y-8">
            {posts.map((p) => (
              <PostBlock
                key={p.id}
                post={p}
                isMine={p.author_id === user.id}
              />
            ))}
          </ol>
        )}
      </section>

      {/* Indicateur de tour + composer */}
      {participants.length > 0 && (
        <div className="mt-14 space-y-5">
          {currentTurnVoy && currentTurnName && (
            <TurnIndicator
              voyageur={currentTurnVoy}
              isMine={myTurn}
            />
          )}

          {isParticipant ? (
            <PostComposer
              sceneId={scene.id}
              enabled={myTurn}
              waitingForName={!myTurn ? currentTurnName : null}
            />
          ) : (
            <ReadOnlyBanner />
          )}
        </div>
      )}
    </main>
  );
}

/* ───────────── Sous-composants ───────────── */

function PostBlock({ post, isMine }: { post: PostRow; isMine: boolean }) {
  const voy = post.incarnations?.voyageurs;
  const name = voy?.name ?? "Voyageur inconnu";
  const title = post.incarnations?.title;

  return (
    <li
      className={[
        "rounded-lg px-5 py-4",
        isMine
          ? "border-l-2 border-verdigris bg-verdigris/5"
          : "border-l-2 border-line",
      ].join(" ")}
    >
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Faceclaim
            name={name}
            avatarUrl={voy?.avatar_url ?? null}
            hue={voy?.hue ?? null}
            size="md"
          />
          <div className="leading-tight">
            <p className="font-display text-base font-medium text-ink">
              {name}
            </p>
            {title && (
              <p className="font-serif text-xs italic text-muted">{title}</p>
            )}
          </div>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          {timeAgo(post.created_at)}
        </p>
      </header>
      <div className="mt-3 whitespace-pre-wrap font-serif text-base leading-relaxed text-ink">
        {post.body}
      </div>
    </li>
  );
}

function TurnIndicator({
  voyageur,
  isMine,
}: {
  voyageur: VoyageurLite;
  isMine: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center gap-3 rounded-md border px-4 py-3",
        isMine
          ? "border-verdigris bg-verdigris/10"
          : "border-copper/40 bg-copper/5",
      ].join(" ")}
    >
      <Faceclaim
        name={voyageur.name}
        avatarUrl={voyageur.avatar_url}
        hue={voyageur.hue}
        size="md"
      />
      <div className="leading-tight">
        <p
          className={[
            "font-mono text-[10px] uppercase tracking-[0.3em]",
            isMine ? "text-verdigris-deep" : "text-copper",
          ].join(" ")}
        >
          {isMine ? "à toi" : "au tour de"}
        </p>
        <p className="mt-0.5 font-display text-lg font-medium text-ink">
          {isMine ? `${voyageur.name} (toi)` : `${voyageur.name} d'écrire`}
        </p>
      </div>
    </div>
  );
}

function StatusInline({ status }: { status: Scene["status"] }) {
  const color: Record<Scene["status"], string> = {
    open: "bg-verdigris",
    active: "bg-copper",
    closed: "bg-muted",
    archived: "bg-line",
  };
  return (
    <span className="inline-flex items-center gap-1.5 align-middle">
      <span
        aria-hidden
        className={`inline-block h-1.5 w-1.5 rounded-full ${color[status]}`}
      />
      {status}
    </span>
  );
}

function ReadOnlyBanner() {
  return (
    <div className="rounded-md border border-line bg-paper/60 px-5 py-4 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        lecture seule
      </p>
      <p className="mt-1 font-serif text-sm italic text-muted">
        Tu n'es pas participant·e de cette scène. Tu peux la lire, mais pas
        écrire dedans.
      </p>
    </div>
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

function ambianceFor(loc: LocationLite): string {
  return [loc.time_label, loc.weather, loc.soundscape]
    .filter(Boolean)
    .join(" · ");
}

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
