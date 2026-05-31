import {
  DollarSign,
  MessageCircle,
  PackageX,
  AlertTriangle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardTitle, StatCard, Badge } from "@/components/admin/ui";
import {
  AreaChartView,
  BarChartView,
  RankingBars,
} from "@/components/admin/charts";
import {
  KPIS,
  VENDAS_SEMANA,
  MODELOS_MAIS_BUSCADOS,
  PRODUTOS_MAIS_VENDIDOS,
  ALERTAS_ESTOQUE,
  ALERTAS_DEMANDA,
} from "@/lib/admin/mock";
import { formatBRL } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-ink-deep">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-300">
          Visão geral da ótica · 28 de maio de 2026
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Vendas do dia"
          value={formatBRL(KPIS.vendas_dia_cents)}
          trend={KPIS.vendas_dia_variacao_pct}
          hint="vs. ontem"
          icon={<DollarSign size={18} strokeWidth={1.5} />}
          accent
        />
        <StatCard
          label="Mensagens pendentes"
          value={String(KPIS.mensagens_pendentes)}
          hint="aguardando resposta"
          icon={<MessageCircle size={18} strokeWidth={1.5} />}
        />
        <StatCard
          label="Alertas de estoque"
          value={String(KPIS.alertas_estoque)}
          hint="abaixo do mínimo"
          icon={<PackageX size={18} strokeWidth={1.5} />}
        />
        <StatCard
          label="Erros no site"
          value={String(KPIS.erros_site)}
          hint="detectados hoje"
          icon={<AlertTriangle size={18} strokeWidth={1.5} />}
        />
      </div>

      {/* Gráficos principais */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Vendas por dia (últimos 7 dias)</CardTitle>
          <AreaChartView data={VENDAS_SEMANA} format="brl-k" />
        </Card>

        <Card>
          <CardTitle>Modelos mais buscados</CardTitle>
          <p className="-mt-2 mb-4 text-xs text-stone-300">
            Extraído das mensagens pela IA
          </p>
          <RankingBars data={MODELOS_MAIS_BUSCADOS} />
        </Card>
      </div>

      {/* Segunda linha */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardTitle>Produtos mais vendidos</CardTitle>
          <BarChartView data={PRODUTOS_MAIS_VENDIDOS} />
        </Card>

        {/* Resumo da IA */}
        <Card className="border-amber/40">
          <CardTitle
            action={<Sparkles size={18} className="text-amber-soft" strokeWidth={1.5} />}
          >
            Resumo da IA
          </CardTitle>
          <div className="space-y-5">
            <div>
              <p className="font-display text-display-md text-ink-deep">
                {KPIS.ia_respondidas_hoje}
              </p>
              <p className="text-sm text-stone-300">mensagens respondidas hoje</p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-success" strokeWidth={1.5} />
              <p className="text-sm text-ink">
                Taxa de conversão{" "}
                <span className="font-semibold text-success">
                  {KPIS.ia_taxa_conversao_pct}%
                </span>
              </p>
            </div>
            <p className="text-xs leading-relaxed text-stone-300">
              A IA respondeu automaticamente {KPIS.ia_respondidas_hoje} mensagens,
              das quais cerca de {KPIS.ia_taxa_conversao_pct}% indicaram intenção de
              compra ou visita à loja.
            </p>
          </div>
        </Card>

        {/* Alertas */}
        <Card>
          <CardTitle>Alertas</CardTitle>
          <ul className="space-y-3">
            {ALERTAS_ESTOQUE.map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <Badge className="mt-0.5 bg-danger/25 text-ink">Estoque</Badge>
                <span className="text-stone-500">
                  <span className="text-ink">{a.product_name}</span> ({a.product_code})
                  com apenas {a.current_quantity} un. (mín. {a.min_quantity})
                </span>
              </li>
            ))}
            {ALERTAS_DEMANDA.map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <Badge className="mt-0.5 bg-amber/25 text-amber-soft">Demanda</Badge>
                <span className="text-stone-500">
                  <span className="text-ink">{a.model_mentioned}</span> mencionado{" "}
                  {a.mentions}× {a.period} e não está no catálogo
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
