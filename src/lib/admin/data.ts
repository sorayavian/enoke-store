/**
 * Camada de dados do painel admin.
 *
 * Quando o Supabase está configurado, lê do banco real (tabelas da migration
 * 0004 + products/orders/customers). Caso contrário, usa os mocks de
 * `@/lib/admin/mock` — o painel continua navegável sem credenciais.
 *
 * As funções têm a mesma forma nos dois modos; as páginas só consomem daqui.
 */

import "server-only";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/is-configured";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import {
  CONVERSAS,
  MENSAGENS,
  ERROS_SITE,
  AI_LOGS,
  ALERTAS_ESTOQUE,
  ALERTAS_DEMANDA,
  INSTAGRAM_POSTS,
  INSTAGRAM_METRICS,
  MENSAGENS_STATS,
  MODELOS_MAIS_BUSCADOS,
  PRODUTOS_MAIS_VENDIDOS,
  PEDIDOS,
  CLIENTES,
  type PedidoAdmin,
  type ClienteAdmin,
} from "@/lib/admin/mock";
import type {
  Conversation,
  Message,
  SiteError,
  AiLog,
  StockAlert,
  DemandAlert,
  InstagramPost,
  InstagramMetric,
  PontoSerie,
} from "@/lib/admin/types";

// Helper: roda a query; em erro ou banco vazio, devolve o fallback informado.
async function comFallback<T>(
  consulta: () => Promise<T>,
  fallback: T,
  rotulo: string
): Promise<T> {
  if (!SUPABASE_CONFIGURED) return fallback;
  try {
    return await consulta();
  } catch (e) {
    console.error(`[admin/data] ${rotulo}:`, (e as Error).message);
    return fallback;
  }
}

// ── Conversas e mensagens ─────────────────────────────────────────────────

export function getConversas(): Promise<Conversation[]> {
  return comFallback(
    async () => {
      const sb = createSupabaseServiceClient();
      const { data, error } = await sb
        .from("conversations")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      // Sem dados ainda → mostra os exemplos para a tela não ficar vazia.
      return data && data.length ? (data as unknown as Conversation[]) : CONVERSAS;
    },
    CONVERSAS,
    "getConversas"
  );
}

export function getMensagens(): Promise<Message[]> {
  return comFallback(
    async () => {
      const sb = createSupabaseServiceClient();
      const { data, error } = await sb
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data && data.length ? (data as unknown as Message[]) : MENSAGENS;
    },
    MENSAGENS,
    "getMensagens"
  );
}

// ── Monitor ───────────────────────────────────────────────────────────────

export function getErrosSite(): Promise<SiteError[]> {
  return comFallback(
    async () => {
      const sb = createSupabaseServiceClient();
      const { data, error } = await sb
        .from("site_errors")
        .select("*")
        .order("detected_at", { ascending: false });
      if (error) throw error;
      return data && data.length ? (data as unknown as SiteError[]) : ERROS_SITE;
    },
    ERROS_SITE,
    "getErrosSite"
  );
}

export function getAiLogs(): Promise<AiLog[]> {
  return comFallback(
    async () => {
      const sb = createSupabaseServiceClient();
      const { data, error } = await sb
        .from("ai_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data && data.length ? (data as unknown as AiLog[]) : AI_LOGS;
    },
    AI_LOGS,
    "getAiLogs"
  );
}

// ── Estoque ───────────────────────────────────────────────────────────────

export function getAlertasEstoque(): Promise<StockAlert[]> {
  return comFallback(
    async () => {
      const sb = createSupabaseServiceClient();
      const { data, error } = await sb.from("stock_alerts").select("*");
      if (error) throw error;
      return data && data.length
        ? (data as unknown as StockAlert[])
        : ALERTAS_ESTOQUE;
    },
    ALERTAS_ESTOQUE,
    "getAlertasEstoque"
  );
}

// ── Pedidos ───────────────────────────────────────────────────────────────

export function getPedidos(): Promise<PedidoAdmin[]> {
  return comFallback(
    async () => {
      const sb = createSupabaseServiceClient();
      const { data, error } = await sb
        .from("orders")
        .select("id, status, total_cents, created_at, customers(full_name), order_items(id)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!data || !data.length) return PEDIDOS;
      // Normaliza para o formato que a página espera.
      const linhas = data as unknown as Array<{
        id: string;
        status: string;
        total_cents: number;
        created_at: string;
        customers?: { full_name?: string } | null;
        order_items?: unknown[];
      }>;
      return linhas.map((o): PedidoAdmin => ({
        id: String(o.id).slice(0, 8).toUpperCase(),
        cliente: o.customers?.full_name ?? "Cliente",
        status: o.status as PedidoAdmin["status"],
        total_cents: o.total_cents,
        itens: (o.order_items ?? []).length,
        created_at: o.created_at,
      }));
    },
    PEDIDOS,
    "getPedidos"
  );
}

// ── Clientes ──────────────────────────────────────────────────────────────

export function getClientes(): Promise<ClienteAdmin[]> {
  return comFallback(
    async () => {
      const sb = createSupabaseServiceClient();
      const { data, error } = await sb
        .from("customers")
        .select("id, full_name, email, phone, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!data || !data.length) return CLIENTES;
      const linhas = data as unknown as Array<{
        id: string;
        full_name: string | null;
        email: string;
        phone: string | null;
        created_at: string;
      }>;
      return linhas.map((c): ClienteAdmin => ({
        id: c.id,
        full_name: c.full_name ?? "—",
        email: c.email,
        phone: c.phone ?? "—",
        pedidos: 0, // agregação real pode ser adicionada depois
        total_gasto_cents: 0,
        created_at: c.created_at,
      }));
    },
    CLIENTES,
    "getClientes"
  );
}

// ── Instagram ─────────────────────────────────────────────────────────────

export function getInstagramPosts(): Promise<InstagramPost[]> {
  return comFallback(
    async () => {
      const sb = createSupabaseServiceClient();
      const { data, error } = await sb
        .from("instagram_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data && data.length
        ? (data as unknown as InstagramPost[])
        : INSTAGRAM_POSTS;
    },
    INSTAGRAM_POSTS,
    "getInstagramPosts"
  );
}

export function getInstagramMetrics(): Promise<Record<string, InstagramMetric>> {
  // Métricas seguem o mock por enquanto (vêm da Meta Graph API em produção).
  return Promise.resolve(INSTAGRAM_METRICS);
}

// ── Alertas de demanda (modelo perguntado e não cadastrado) ───────────────

export function getAlertasDemanda(): Promise<DemandAlert[]> {
  // Derivado da análise das mensagens (IA). Por ora segue o mock.
  return Promise.resolve(ALERTAS_DEMANDA);
}

// ── Estatísticas de mensagens (página /admin/mensagens) ───────────────────

export type MensagensStats = typeof MENSAGENS_STATS;

const MODELOS_CONHECIDOS = [
  "Aurora", "Lume", "Volta", "Siena", "Orto", "Mira", "Petra", "Alba", "Porto", "Nido",
];

/**
 * Agrega as estatísticas da página de mensagens a partir das mensagens reais
 * (quando o Supabase está configurado). Conta classificação por tipo e extrai
 * os modelos mais mencionados nas mensagens recebidas.
 */
export function getMensagensStats(): Promise<MensagensStats> {
  return comFallback(
    async () => {
      const sb = createSupabaseServiceClient();
      const { data, error } = await sb
        .from("messages")
        .select("content, direction, classification");
      if (error) throw error;
      if (!data || !data.length) return MENSAGENS_STATS;

      const por_tipo = { reclamacao: 0, avaliacao: 0, pergunta: 0, intencao_compra: 0 };
      let total_respondidas = 0;
      const modeloCount = new Map<string, number>();

      for (const m of data as Array<{
        content: string;
        direction: "in" | "out";
        classification: keyof typeof por_tipo | null;
      }>) {
        if (m.direction === "out") total_respondidas++;
        if (m.classification && m.classification in por_tipo) {
          por_tipo[m.classification]++;
        }
        if (m.direction === "in") {
          const texto = m.content.toLowerCase();
          for (const modelo of MODELOS_CONHECIDOS) {
            if (texto.includes(modelo.toLowerCase())) {
              modeloCount.set(modelo, (modeloCount.get(modelo) ?? 0) + 1);
            }
          }
        }
      }

      const top_modelos = Array.from(modeloCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([modelo, vezes]) => ({ modelo, vezes }));

      return {
        total_respondidas,
        por_tipo,
        // Top perguntas exigiria clustering semântico — mantém o mock por ora.
        top_perguntas: MENSAGENS_STATS.top_perguntas,
        top_modelos: top_modelos.length ? top_modelos : MENSAGENS_STATS.top_modelos,
      };
    },
    MENSAGENS_STATS,
    "getMensagensStats"
  );
}

// ── Dashboard: KPIs, séries e rankings reais ──────────────────────────────

export type DashboardReal = {
  vendas_total_cents: number;
  pedidos: number;
  ticket_medio_cents: number;
  mensagens_pendentes: number;
  alertas_estoque: number;
  erros_site: number;
  ia_respondidas: number;
  serie_vendas: PontoSerie[];
  modelos_buscados: PontoSerie[];
  produtos_vendidos: PontoSerie[];
};

const ROTULOS_DIA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/**
 * Agrega os números do dashboard para os últimos `dias` dias a partir das
 * tabelas reais (orders, messages, site_errors, stock_alerts). Cai para os
 * mocks quando o Supabase não está configurado ou em erro.
 */
export function getDashboardReal(dias = 7): Promise<DashboardReal> {
  const fallback: DashboardReal = {
    vendas_total_cents: 1_250_00 * dias,
    pedidos: Math.round(dias * 1.8),
    ticket_medio_cents: 0,
    mensagens_pendentes: CONVERSAS.filter((c) => c.status === "open").length,
    alertas_estoque: ALERTAS_ESTOQUE.length,
    erros_site: ERROS_SITE.filter((e) => !e.resolved).length,
    ia_respondidas: Math.round(dias * 5.2),
    serie_vendas: [],
    modelos_buscados: MODELOS_MAIS_BUSCADOS,
    produtos_vendidos: PRODUTOS_MAIS_VENDIDOS,
  };
  fallback.ticket_medio_cents = Math.round(
    fallback.vendas_total_cents / Math.max(fallback.pedidos, 1)
  );

  return comFallback(
    async () => {
      const sb = createSupabaseServiceClient();
      const desde = new Date(Date.now() - dias * 86_400_000).toISOString();

      const [pedidosRes, msgsRes, errosRes, alertasRes, convRes] = await Promise.all([
        sb.from("orders").select("total_cents, status, created_at").gte("created_at", desde),
        sb.from("messages").select("direction, created_at").gte("created_at", desde),
        sb.from("site_errors").select("resolved").eq("resolved", false),
        sb.from("stock_alerts").select("id"),
        sb.from("conversations").select("status").eq("status", "open"),
      ]);

      if (pedidosRes.error) throw pedidosRes.error;

      const pedidosPagos = (pedidosRes.data ?? []).filter((o: { status: string }) =>
        ["paid", "shipped", "delivered"].includes(o.status)
      );
      const vendas_total_cents = pedidosPagos.reduce(
        (s: number, o: { total_cents: number }) => s + o.total_cents,
        0
      );
      const pedidos = pedidosPagos.length;

      // Série de vendas por dia da semana (últimos 7) ou agregada por dia.
      const porDia = new Map<string, number>();
      for (const o of pedidosPagos as Array<{ total_cents: number; created_at: string }>) {
        const d = new Date(o.created_at);
        const rotulo = dias <= 7 ? ROTULOS_DIA[d.getDay()] : `${d.getDate()}/${d.getMonth() + 1}`;
        porDia.set(rotulo, (porDia.get(rotulo) ?? 0) + o.total_cents);
      }
      const serie_vendas: PontoSerie[] = Array.from(porDia.entries()).map(
        ([label, valor]) => ({ label, valor })
      );

      const ia_respondidas = (msgsRes.data ?? []).filter(
        (m: { direction: string }) => m.direction === "out"
      ).length;

      return {
        vendas_total_cents,
        pedidos,
        ticket_medio_cents: pedidos ? Math.round(vendas_total_cents / pedidos) : 0,
        mensagens_pendentes: (convRes.data ?? []).length,
        alertas_estoque: (alertasRes.data ?? []).length,
        erros_site: (errosRes.data ?? []).length,
        ia_respondidas,
        serie_vendas: serie_vendas.length ? serie_vendas : fallback.serie_vendas,
        modelos_buscados: fallback.modelos_buscados,
        produtos_vendidos: fallback.produtos_vendidos,
      };
    },
    fallback,
    "getDashboardReal"
  );
}
