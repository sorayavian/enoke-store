import { Download } from "lucide-react";
import { Card, CardTitle, StatCard } from "@/components/admin/ui";
import { BarChartView, RankingBars } from "@/components/admin/charts";
import {
  PRODUTOS_MAIS_VENDIDOS,
  MODELOS_MAIS_BUSCADOS,
  MENSAGENS_STATS,
  VENDAS_SEMANA,
} from "@/lib/admin/mock";
import { formatBRL } from "@/lib/utils";

export const metadata = { title: "Relatórios" };

export default function RelatoriosPage() {
  const totalVendasSemana = VENDAS_SEMANA.reduce((s, d) => s + d.valor, 0) * 100;
  const totalReclamacoes = MENSAGENS_STATS.por_tipo.reclamacao;
  const totalMensagens = Object.values(MENSAGENS_STATS.por_tipo).reduce(
    (s, v) => s + v,
    0
  );
  const taxaReclamacao = ((totalReclamacoes / totalMensagens) * 100).toFixed(1);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-display-lg text-ink-deep">
            Relatórios
          </h1>
          <p className="mt-1 text-sm text-stone-300">
            Desempenho de vendas e atendimento
          </p>
        </div>
        <button className="flex items-center gap-2 self-start rounded-md border border-mist bg-paper px-4 py-2 text-sm text-ink transition-colors hover:border-amber/50">
          <Download size={16} strokeWidth={1.5} />
          Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Vendas (7 dias)"
          value={formatBRL(totalVendasSemana)}
          hint="receita acumulada"
          accent
        />
        <StatCard
          label="Taxa de reclamações"
          value={`${taxaReclamacao}%`}
          hint={`${totalReclamacoes} de ${totalMensagens} mensagens`}
        />
        <StatCard
          label="Tempo médio de resolução"
          value="2h 14min"
          hint="das conversas escaladas"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Produtos mais vendidos (30 dias)</CardTitle>
          <BarChartView data={PRODUTOS_MAIS_VENDIDOS} />
        </Card>
        <Card>
          <CardTitle>Modelos mais buscados nas mensagens</CardTitle>
          <RankingBars data={MODELOS_MAIS_BUSCADOS} />
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Vendas por dia</CardTitle>
          <BarChartView data={VENDAS_SEMANA} format="brl-k" />
        </Card>
        <Card>
          <CardTitle>Perguntas mais frequentes</CardTitle>
          <RankingBars
            data={MENSAGENS_STATS.top_perguntas.map((p) => ({
              label: p.pergunta,
              valor: p.vezes,
            }))}
          />
        </Card>
      </div>

      <p className="mt-6 text-xs text-stone-300">
        A exportação para CSV será gerada a partir dos dados reais quando o
        Supabase estiver conectado.
      </p>
    </div>
  );
}
