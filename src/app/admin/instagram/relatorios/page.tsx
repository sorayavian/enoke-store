import { Sparkles } from "lucide-react";
import { InstagramSubnav } from "@/components/admin/InstagramSubnav";
import { Card, CardTitle, StatCard } from "@/components/admin/ui";
import { BarChartView, RankingBars } from "@/components/admin/charts";
import { INSTAGRAM_POSTS, INSTAGRAM_METRICS } from "@/lib/admin/mock";
import { IG_POST_TYPE_LABEL } from "@/lib/admin/labels";
import type { PontoSerie } from "@/lib/admin/types";

export const metadata = { title: "Relatórios · Instagram" };

// Melhores horários (mock) e desempenho por tipo de conteúdo.
const MELHORES_HORARIOS: PontoSerie[] = [
  { label: "9h", valor: 62 },
  { label: "12h", valor: 78 },
  { label: "15h", valor: 54 },
  { label: "18h", valor: 91 },
  { label: "21h", valor: 73 },
];

export default function InstagramRelatoriosPage() {
  const publicados = INSTAGRAM_POSTS.filter((p) => p.status === "published");
  const totalReach = publicados.reduce(
    (s, p) => s + (INSTAGRAM_METRICS[p.id]?.reach ?? 0),
    0
  );
  const totalFollowers = publicados.reduce(
    (s, p) => s + (INSTAGRAM_METRICS[p.id]?.followers_gained ?? 0),
    0
  );

  // Desempenho por tipo de conteúdo (engajamento médio simulado)
  const porTipo: PontoSerie[] = [
    { label: "Foto produto", valor: 86 },
    { label: "Promoção", valor: 74 },
    { label: "Tendência", valor: 61 },
    { label: "Dica saúde", valor: 48 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-display-lg text-ink-deep">
          Relatórios do Instagram
        </h1>
        <p className="mt-1 text-sm text-stone-300">
          Engajamento, alcance e conversão dos posts
        </p>
      </div>
      <InstagramSubnav atual="/admin/instagram/relatorios" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Alcance total" value={totalReach.toLocaleString("pt-BR")} accent />
        <StatCard label="Seguidores ganhos" value={`+${totalFollowers}`} />
        <StatCard label="Conversão post → venda" value="3,8%" hint="média da semana" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Melhores horários de publicação</CardTitle>
          <BarChartView data={MELHORES_HORARIOS} format="int" />
        </Card>
        <Card>
          <CardTitle>Desempenho por tipo de conteúdo</CardTitle>
          <RankingBars data={porTipo} />
        </Card>
      </div>

      {/* Relatório semanal da IA */}
      <Card className="mt-6 border-amber/40">
        <CardTitle action={<Sparkles size={18} className="text-amber-soft" />}>
          Relatório semanal gerado pela IA
        </CardTitle>
        <div className="space-y-3 text-sm leading-relaxed text-stone-500">
          <p>
            <span className="text-ink">Resumo:</span> Esta semana o perfil ganhou{" "}
            <span className="text-ink">+{totalFollowers} seguidores</span> e alcançou{" "}
            <span className="text-ink">{totalReach.toLocaleString("pt-BR")} contas</span>.
            O post de <span className="text-ink">foto de produto</span> (Aurora) teve o
            melhor desempenho, com forte engajamento e 17 DMs geradas.
          </p>
          <p>
            <span className="text-ink">Sugestões:</span> concentrar publicações às{" "}
            <span className="text-ink">18h</span>, que apresentam maior alcance;
            aumentar a frequência de posts de produto, que convertem melhor; e testar
            um Reel de tendência ainda esta semana.
          </p>
          <p className="text-xs text-stone-300">
            Gerado automaticamente todo domingo às 20h (cron) e enviado por e-mail ao
            dono. Demonstração — conecta /api/ai/relatorio-instagram.
          </p>
        </div>
      </Card>

      <p className="mt-4 text-xs text-stone-300">
        Tipos de conteúdo disponíveis:{" "}
        {Object.values(IG_POST_TYPE_LABEL).join(" · ")}
      </p>
    </div>
  );
}
