/**
 * Dados de exemplo do dashboard, variando por período.
 *
 * Determinístico (sem datas/aleatoriedade) para não quebrar build/SSR.
 * Quando houver vendas reais, estas funções podem ser trocadas por queries
 * agregadas na tabela `orders`.
 */

import type { PontoSerie } from "@/lib/admin/types";

export const PERIODOS = [
  { id: "7d", label: "7 dias", dias: 7 },
  { id: "15d", label: "15 dias", dias: 15 },
  { id: "1m", label: "1 mês", dias: 30 },
  { id: "6m", label: "6 meses", dias: 180 },
  { id: "1a", label: "1 ano", dias: 365 },
] as const;

export type PeriodoId = (typeof PERIODOS)[number]["id"];

export function periodoValido(p: string | undefined): PeriodoId {
  return PERIODOS.some((x) => x.id === p) ? (p as PeriodoId) : "7d";
}

export function periodoLabel(p: PeriodoId): string {
  return PERIODOS.find((x) => x.id === p)?.label ?? "7 dias";
}

// Vendas médias por dia (base) usadas para escalar os números por período.
const VENDA_DIA_MEDIA_CENTS = 1_250_00; // ~R$ 1.250/dia

type DashboardData = {
  vendas_total_cents: number;
  vendas_variacao_pct: number;
  pedidos: number;
  ticket_medio_cents: number;
  ia_respondidas: number;
  ia_taxa_conversao_pct: number;
  serie_vendas: PontoSerie[];
};

// Gera uma série de pontos coerente com o período (rótulos e nº de barras).
function serieParaPeriodo(p: PeriodoId): PontoSerie[] {
  switch (p) {
    case "7d":
      return ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((label, i) => ({
        label,
        valor: [8400, 11200, 9800, 14300, 17600, 21900, 12470][i],
      }));
    case "15d":
      return Array.from({ length: 15 }, (_, i) => ({
        label: `${i + 1}`,
        valor: 8000 + ((i * 1300) % 11000),
      }));
    case "1m":
      return ["Sem 1", "Sem 2", "Sem 3", "Sem 4"].map((label, i) => ({
        label,
        valor: [62000, 71000, 58000, 80000][i],
      }));
    case "6m":
      return ["Dez", "Jan", "Fev", "Mar", "Abr", "Mai"].map((label, i) => ({
        label,
        valor: [210000, 245000, 198000, 262000, 231000, 289000][i],
      }));
    case "1a":
      return [
        "Jun", "Jul", "Ago", "Set", "Out", "Nov",
        "Dez", "Jan", "Fev", "Mar", "Abr", "Mai",
      ].map((label, i) => ({
        label,
        valor: [180, 195, 210, 188, 240, 268, 320, 245, 198, 262, 231, 289][i] * 1000,
      }));
  }
}

export function getDashboardData(p: PeriodoId): DashboardData {
  const dias = PERIODOS.find((x) => x.id === p)!.dias;
  const vendas_total_cents = VENDA_DIA_MEDIA_CENTS * dias;
  // Variação e métricas escalam de forma plausível com o período.
  const pedidos = Math.round(dias * 1.8);
  const ticket_medio_cents = Math.round(vendas_total_cents / Math.max(pedidos, 1));
  return {
    vendas_total_cents,
    vendas_variacao_pct: p === "7d" ? 12.4 : p === "15d" ? 9.1 : p === "1m" ? 15.2 : p === "6m" ? 22.8 : 34.5,
    pedidos,
    ticket_medio_cents,
    ia_respondidas: Math.round(dias * 5.2),
    ia_taxa_conversao_pct: 28.5,
    serie_vendas: serieParaPeriodo(p),
  };
}
