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
  INSTAGRAM_POSTS,
  INSTAGRAM_METRICS,
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
  InstagramPost,
  InstagramMetric,
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
