import Link from "next/link";
import { Plus } from "lucide-react";
import { Card, CardTitle, Badge, StatCard } from "@/components/admin/ui";
import { InstagramSubnav } from "@/components/admin/InstagramSubnav";
import { INSTAGRAM_POSTS, INSTAGRAM_METRICS } from "@/lib/admin/mock";
import {
  IG_POST_TYPE_LABEL,
  IG_STATUS_BADGE,
  IG_STATUS_LABEL,
  formatDataHora,
} from "@/lib/admin/labels";

export const metadata = { title: "Instagram" };

export default function InstagramPage() {
  const agendados = INSTAGRAM_POSTS.filter((p) => p.status === "scheduled");
  const publicados = INSTAGRAM_POSTS.filter((p) => p.status === "published");
  const rascunhos = INSTAGRAM_POSTS.filter((p) => p.status === "draft");

  // Métricas agregadas dos posts publicados
  const totalLikes = publicados.reduce(
    (s, p) => s + (INSTAGRAM_METRICS[p.id]?.likes ?? 0),
    0
  );
  const totalFollowers = publicados.reduce(
    (s, p) => s + (INSTAGRAM_METRICS[p.id]?.followers_gained ?? 0),
    0
  );
  const totalDms = publicados.reduce(
    (s, p) => s + (INSTAGRAM_METRICS[p.id]?.direct_messages ?? 0),
    0
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-display-lg text-ink-deep">Instagram</h1>
          <p className="mt-1 text-sm text-stone-300">
            Criação, agendamento e desempenho dos posts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-stone-300">
            Publicação automática diária
            <span className="relative inline-block h-5 w-9 rounded-full bg-amber">
              <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-ink" />
            </span>
          </label>
          <Link
            href="/admin/instagram/novo-post"
            className="flex items-center gap-2 rounded-md bg-amber px-4 py-2 text-sm font-medium text-bone transition-opacity hover:opacity-90"
          >
            <Plus size={16} /> Criar post
          </Link>
        </div>
      </div>

      <InstagramSubnav atual="/admin/instagram" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Agendados" value={String(agendados.length)} accent />
        <StatCard label="Curtidas (publicados)" value={String(totalLikes)} />
        <StatCard label="Seguidores ganhos" value={`+${totalFollowers}`} />
        <StatCard label="DMs geradas" value={String(totalDms)} />
      </div>

      {/* Calendário simplificado (semana) */}
      <Card className="mt-6">
        <CardTitle>Calendário de posts agendados</CardTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {["Qui 29", "Sex 30", "Sáb 31", "Dom 01", "Seg 02", "Ter 03", "Qua 04"].map(
            (dia) => {
              const doDia = agendados.filter((p) =>
                dia.startsWith("Qui")
                  ? p.scheduled_at?.startsWith("2026-05-29")
                  : dia.startsWith("Sex")
                  ? p.scheduled_at?.startsWith("2026-05-30")
                  : false
              );
              return (
                <div
                  key={dia}
                  className="min-h-28 rounded-md border border-mist bg-bone p-2"
                >
                  <p className="mb-2 text-xs text-stone-300">{dia}</p>
                  {doDia.map((p) => (
                    <div
                      key={p.id}
                      className="mb-1 rounded bg-amber/20 px-2 py-1 text-[11px] text-amber-soft"
                    >
                      {IG_POST_TYPE_LABEL[p.type]}
                    </div>
                  ))}
                </div>
              );
            }
          )}
        </div>
      </Card>

      {/* Feed de posts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PostColuna titulo="Rascunhos" posts={rascunhos} />
        <PostColuna titulo="Agendados" posts={agendados} />
        <PostColuna titulo="Publicados" posts={publicados} comMetricas />
      </div>
    </div>
  );
}

function PostColuna({
  titulo,
  posts,
  comMetricas,
}: {
  titulo: string;
  posts: typeof INSTAGRAM_POSTS;
  comMetricas?: boolean;
}) {
  return (
    <Card>
      <CardTitle>
        {titulo} ({posts.length})
      </CardTitle>
      <div className="space-y-3">
        {posts.length === 0 && (
          <p className="text-sm text-stone-300">Nenhum post.</p>
        )}
        {posts.map((p) => {
          const m = INSTAGRAM_METRICS[p.id];
          return (
            <div
              key={p.id}
              className="rounded-md border border-mist bg-bone p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <Badge className={IG_STATUS_BADGE[p.status]}>
                  {IG_STATUS_LABEL[p.status]}
                </Badge>
                <span className="text-xs text-stone-300">
                  {IG_POST_TYPE_LABEL[p.type]}
                </span>
              </div>
              <p className="line-clamp-2 text-sm text-ink">{p.caption}</p>
              <p className="mt-1 line-clamp-1 text-xs text-amber-soft">
                {p.hashtags.join(" ")}
              </p>
              {p.scheduled_at && (
                <p className="mt-2 text-xs text-stone-300">
                  Agendado para {formatDataHora(p.scheduled_at)}
                </p>
              )}
              {comMetricas && m && (
                <div className="mt-2 flex gap-3 text-xs text-stone-300">
                  <span>❤ {m.likes}</span>
                  <span>💬 {m.comments}</span>
                  <span>🔖 {m.saves}</span>
                  <span>+{m.followers_gained} seg.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
