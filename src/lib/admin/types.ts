/**
 * Tipos das novas tabelas/entidades do painel administrativo.
 *
 * Espelham as tabelas descritas nos CLAUDE.md (Fases 1-4):
 * messages, conversations, site_errors, ai_logs, instagram_posts,
 * instagram_metrics, instagram_reports, scanned_glasses, stock_alerts,
 * automation_logs, ai_costs.
 *
 * Enquanto o Supabase real não está conectado, as páginas consomem dados
 * de `@/lib/admin/mock`. Os mesmos tipos servirão quando plugarmos o banco.
 */

// ── Mensagens / Conversas (Fase 1) ───────────────────────────────────────

export type MessageSource = "wa" | "ig"; // WhatsApp | Instagram
export type MessageDirection = "in" | "out"; // recebida | enviada
export type MessageClassification =
  | "reclamacao"
  | "avaliacao"
  | "pergunta"
  | "intencao_compra";

export type ConversationStatus = "open" | "resolved" | "escalated";

export type Message = {
  id: string;
  conversation_id: string;
  source: MessageSource;
  customer_contact: string; // telefone ou @ do Instagram
  content: string;
  direction: MessageDirection;
  classification: MessageClassification | null;
  /** true quando a resposta foi gerada pela IA (apenas direction "out") */
  ai_generated?: boolean;
  created_at: string;
};

export type Conversation = {
  id: string;
  source: MessageSource;
  customer_contact: string;
  customer_name: string;
  status: ConversationStatus;
  /** resposta automática da IA ligada/desligada nesta conversa */
  ai_enabled: boolean;
  last_message_preview: string;
  unread: number;
  updated_at: string;
};

// ── Monitor de erros do site (Fase 1) ─────────────────────────────────────

export type SiteErrorType =
  | "404"
  | "checkout_falha"
  | "imagem_faltando"
  | "erro_servidor"
  | "outro";

export type SiteError = {
  id: string;
  type: SiteErrorType;
  path: string;
  description: string;
  /** severidade atribuída pela IA */
  severity: "baixa" | "media" | "alta";
  detected_at: string;
  resolved: boolean;
};

// ── Logs e custos de IA (Fases 1 e 4) ─────────────────────────────────────

export type AiLog = {
  id: string;
  endpoint: string;
  module: "mensagens" | "instagram" | "monitor" | "scanner";
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  created_at: string;
};

// ── Instagram (Fase 2) ────────────────────────────────────────────────────

export type InstagramPostType =
  | "foto_produto"
  | "dica_saude"
  | "tendencia"
  | "promocao";

export type InstagramPostStatus = "draft" | "scheduled" | "published" | "failed";

export type InstagramPost = {
  id: string;
  type: InstagramPostType;
  caption: string;
  hashtags: string[];
  image_url: string;
  video_url: string | null;
  product_id: string | null;
  scheduled_at: string | null;
  published_at: string | null;
  status: InstagramPostStatus;
  ig_post_id: string | null;
};

export type InstagramMetric = {
  id: string;
  post_id: string;
  likes: number;
  comments: number;
  saves: number;
  reach: number;
  direct_messages: number;
  followers_gained: number;
  collected_at: string;
};

// ── Alertas de estoque (Fase 4) ───────────────────────────────────────────

export type StockAlert = {
  id: string;
  product_id: string;
  product_name: string;
  product_code: string;
  min_quantity: number;
  current_quantity: number;
  alerted_at: string;
};

// ── Alerta de modelo muito perguntado e não cadastrado (Fase 3) ───────────

export type DemandAlert = {
  id: string;
  model_mentioned: string;
  mentions: number;
  period: string;
  in_catalog: boolean;
  created_at: string;
};

// ── KPIs agregados do dashboard ───────────────────────────────────────────

export type DashboardKpis = {
  vendas_dia_cents: number;
  vendas_dia_variacao_pct: number;
  mensagens_pendentes: number;
  alertas_estoque: number;
  erros_site: number;
  ia_respondidas_hoje: number;
  ia_taxa_conversao_pct: number;
};

export type PontoSerie = { label: string; valor: number };
export type PontoSerieDupla = { label: string; a: number; b: number };
