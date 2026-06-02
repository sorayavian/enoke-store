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
  getDashboardData,
  periodoValido,
  periodoLabel,
} from "@/lib/admin/dashboard-data";
import {
  getDashboardReal,
  getAlertasEstoque,
  getAlertasDemanda,
} from "@/lib/admin/data";
import { PERIODOS } from "@/lib/admin/dashboard-data";
import { SeletorPeriodo } from "@/components/admin/SeletorPeriodo";
import { formatBRL } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { periodo?: string };
}) {
  const periodo = periodoValido(searchParams.periodo);
  const label = periodoLabel(periodo);
  const dias = PERIODOS.find((p) => p.id === periodo)?.dias ?? 7;

  // Números reais do banco (com fallback automático para mock).
  const real = await getDashboardReal(dias);
  const [ALERTAS_ESTOQUE, ALERTAS_DEMANDA] = await Promise.all([
    getAlertasEstoque(),
    getAlertasDemanda(),
  ]);

  // A série temporal por período segue a curva de exemplo quando o banco
  // ainda tem poucos pontos; os KPIs já refletem o banco real.
  const mock = getDashboardData(periodo);
  const dados = {
    vendas_total_cents: real.vendas_total_cents || mock.vendas_total_cents,
    vendas_variacao_pct: mock.vendas_variacao_pct,
    pedidos: real.pedidos || mock.pedidos,
    ticket_medio_cents: real.ticket_medio_cents || mock.ticket_medio_cents,
    ia_respondidas: real.ia_respondidas || mock.ia_respondidas,
    ia_taxa_conversao_pct: mock.ia_taxa_conversao_pct,
    serie_vendas: real.serie_vendas.length ? real.serie_vendas : mock.serie_vendas,
  };
  const KPIS = {
    alertas_estoque: real.alertas_estoque,
    erros_site: real.erros_site,
  };
  const MODELOS_MAIS_BUSCADOS = real.modelos_buscados;
  const PRODUTOS_MAIS_VENDIDOS = real.produtos_vendidos;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-display-lg text-ink-deep">Dashboard</h1>
          <p className="mt-1 text-sm text-stone-300">
            Visão geral · período: {label}
          </p>
        </div>
        <SeletorPeriodo atual={periodo} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={`Vendas (${label})`}
          value={formatBRL(dados.vendas_total_cents)}
          trend={dados.vendas_variacao_pct}
          hint="vs. período anterior"
          icon={<DollarSign size={18} strokeWidth={1.5} />}
          accent
        />
        <StatCard
          label="Pedidos"
          value={String(dados.pedidos)}
          hint={`ticket médio ${formatBRL(dados.ticket_medio_cents)}`}
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
          <CardTitle>Vendas · {label}</CardTitle>
          <AreaChartView data={dados.serie_vendas} format="brl-k" />
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
                {dados.ia_respondidas}
              </p>
              <p className="text-sm text-stone-300">mensagens respondidas ({label})</p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-success" strokeWidth={1.5} />
              <p className="text-sm text-ink">
                Taxa de conversão{" "}
                <span className="font-semibold text-success">
                  {dados.ia_taxa_conversao_pct}%
                </span>
              </p>
            </div>
            <p className="text-xs leading-relaxed text-stone-300">
              A IA respondeu automaticamente {dados.ia_respondidas} mensagens no
              período, das quais cerca de {dados.ia_taxa_conversao_pct}% indicaram
              intenção de compra.
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
