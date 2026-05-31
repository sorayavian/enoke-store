/**
 * Dados de exemplo (mock) do painel administrativo.
 *
 * Tudo aqui é estático e determinístico — pensado para demonstrar as telas
 * enquanto as integrações reais (Supabase, Anthropic, WhatsApp, Instagram)
 * ainda não estão plugadas. Quando o backend real entrar, basta trocar estas
 * funções por queries; as páginas consomem somente as funções exportadas.
 */

import type {
  AiLog,
  Conversation,
  DashboardKpis,
  DemandAlert,
  InstagramMetric,
  InstagramPost,
  Message,
  PontoSerie,
  PontoSerieDupla,
  SiteError,
  StockAlert,
} from "@/lib/admin/types";
import { MOCK_PRODUCTS } from "@/lib/mock/products";

const HOJE = "2026-05-28";

// ── KPIs do dashboard ─────────────────────────────────────────────────────

export const KPIS: DashboardKpis = {
  vendas_dia_cents: 1_247_000,
  vendas_dia_variacao_pct: 12.4,
  mensagens_pendentes: 7,
  alertas_estoque: 3,
  erros_site: 2,
  ia_respondidas_hoje: 34,
  ia_taxa_conversao_pct: 28.5,
};

// ── Séries de gráficos ────────────────────────────────────────────────────

export const VENDAS_SEMANA: PontoSerie[] = [
  { label: "Seg", valor: 8400 },
  { label: "Ter", valor: 11200 },
  { label: "Qua", valor: 9800 },
  { label: "Qui", valor: 14300 },
  { label: "Sex", valor: 17600 },
  { label: "Sáb", valor: 21900 },
  { label: "Dom", valor: 12470 },
];

export const MODELOS_MAIS_BUSCADOS: PontoSerie[] = [
  { label: "Aurora", valor: 47 },
  { label: "Lume", valor: 39 },
  { label: "Volta", valor: 31 },
  { label: "Mira", valor: 28 },
  { label: "Orto", valor: 22 },
];

export const PRODUTOS_MAIS_VENDIDOS: PontoSerie[] = [
  { label: "Aurora", valor: 18 },
  { label: "Alba", valor: 15 },
  { label: "Volta", valor: 12 },
  { label: "Siena", valor: 10 },
  { label: "Porto", valor: 8 },
];

/** Mensagens recebidas x respondidas pela IA, por dia da semana */
export const IA_MENSAGENS_SEMANA: PontoSerieDupla[] = [
  { label: "Seg", a: 22, b: 18 },
  { label: "Ter", a: 31, b: 27 },
  { label: "Qua", a: 28, b: 24 },
  { label: "Qui", a: 35, b: 30 },
  { label: "Sex", a: 41, b: 36 },
  { label: "Sáb", a: 38, b: 31 },
  { label: "Dom", a: 19, b: 16 },
];

// ── Conversas e mensagens ─────────────────────────────────────────────────

export const CONVERSAS: Conversation[] = [
  {
    id: "conv-1",
    source: "wa",
    customer_contact: "+55 11 99812-3344",
    customer_name: "Mariana Alves",
    status: "open",
    ai_enabled: true,
    last_message_preview: "A Aurora tem disponível em outra cor?",
    unread: 2,
    updated_at: `${HOJE}T14:32:00`,
  },
  {
    id: "conv-2",
    source: "ig",
    customer_contact: "@joao.pedro",
    customer_name: "João Pedro",
    status: "open",
    ai_enabled: true,
    last_message_preview: "Quero comprar o modelo Lume, ainda tem?",
    unread: 1,
    updated_at: `${HOJE}T13:58:00`,
  },
  {
    id: "conv-3",
    source: "wa",
    customer_contact: "+55 21 98765-1122",
    customer_name: "Carla Souza",
    status: "escalated",
    ai_enabled: false,
    last_message_preview: "A lente do meu óculos veio riscada, quero reclamar.",
    unread: 1,
    updated_at: `${HOJE}T12:10:00`,
  },
  {
    id: "conv-4",
    source: "ig",
    customer_contact: "@lu.ferreira",
    customer_name: "Luana Ferreira",
    status: "resolved",
    ai_enabled: true,
    last_message_preview: "Perfeito, muito obrigada pelo atendimento!",
    unread: 0,
    updated_at: `${HOJE}T11:05:00`,
  },
  {
    id: "conv-5",
    source: "wa",
    customer_contact: "+55 11 91234-5678",
    customer_name: "Rafael Lima",
    status: "open",
    ai_enabled: true,
    last_message_preview: "Vocês têm lente fotossensível para o modelo Volta?",
    unread: 0,
    updated_at: `${HOJE}T10:40:00`,
  },
  {
    id: "conv-6",
    source: "ig",
    customer_contact: "@bia.martins",
    customer_name: "Beatriz Martins",
    status: "resolved",
    ai_enabled: true,
    last_message_preview: "Que ótimo, vou passar na loja amanhã então.",
    unread: 0,
    updated_at: `${HOJE}T09:22:00`,
  },
];

export const MENSAGENS: Message[] = [
  // conv-1 — Mariana / WhatsApp
  {
    id: "m-1",
    conversation_id: "conv-1",
    source: "wa",
    customer_contact: "+55 11 99812-3344",
    content: "Oi! Vi o modelo Aurora no site, vocês têm em outra cor além do grafite?",
    direction: "in",
    classification: "pergunta",
    created_at: `${HOJE}T14:28:00`,
  },
  {
    id: "m-2",
    conversation_id: "conv-1",
    source: "wa",
    customer_contact: "+55 11 99812-3344",
    content:
      "Olá, Mariana! A Aurora é em acetato italiano e no momento temos pronta entrega na cor grafite. Posso verificar a disponibilidade de encomenda em outras cores para você. Qual cor você procura? 😊",
    direction: "out",
    classification: null,
    ai_generated: true,
    created_at: `${HOJE}T14:29:00`,
  },
  {
    id: "m-3",
    conversation_id: "conv-1",
    source: "wa",
    customer_contact: "+55 11 99812-3344",
    content: "A Aurora tem disponível em outra cor? Queria uma mais clara",
    direction: "in",
    classification: "intencao_compra",
    created_at: `${HOJE}T14:32:00`,
  },
  // conv-2 — João / Instagram
  {
    id: "m-4",
    conversation_id: "conv-2",
    source: "ig",
    customer_contact: "@joao.pedro",
    content: "Quero comprar o modelo Lume, ainda tem?",
    direction: "in",
    classification: "intencao_compra",
    created_at: `${HOJE}T13:58:00`,
  },
  // conv-3 — Carla / WhatsApp (reclamação escalada)
  {
    id: "m-5",
    conversation_id: "conv-3",
    source: "wa",
    customer_contact: "+55 21 98765-1122",
    content: "A lente do meu óculos veio riscada, quero reclamar.",
    direction: "in",
    classification: "reclamacao",
    created_at: `${HOJE}T12:08:00`,
  },
  {
    id: "m-6",
    conversation_id: "conv-3",
    source: "wa",
    customer_contact: "+55 21 98765-1122",
    content:
      "Sinto muito pelo ocorrido, Carla. Vou encaminhar seu caso para um de nossos atendentes resolverem a troca com prioridade. Pode me confirmar o número do pedido?",
    direction: "out",
    classification: null,
    ai_generated: true,
    created_at: `${HOJE}T12:10:00`,
  },
  // conv-4 — Luana / Instagram (resolvida, avaliação)
  {
    id: "m-7",
    conversation_id: "conv-4",
    source: "ig",
    customer_contact: "@lu.ferreira",
    content: "Perfeito, muito obrigada pelo atendimento!",
    direction: "in",
    classification: "avaliacao",
    created_at: `${HOJE}T11:05:00`,
  },
];

// ── Estatísticas da página de mensagens ──────────────────────────────────

export const MENSAGENS_STATS = {
  total_respondidas: 412,
  por_tipo: {
    reclamacao: 38,
    avaliacao: 96,
    pergunta: 201,
    intencao_compra: 77,
  },
  top_perguntas: [
    { pergunta: "Vocês têm lente antirreflexo?", vezes: 54 },
    { pergunta: "Qual o prazo de entrega?", vezes: 47 },
    { pergunta: "Fazem lente com meu grau?", vezes: 41 },
    { pergunta: "Tem desconto à vista?", vezes: 33 },
    { pergunta: "Posso experimentar na loja?", vezes: 29 },
  ],
  top_modelos: [
    { modelo: "Aurora", vezes: 47 },
    { modelo: "Lume", vezes: 39 },
    { modelo: "Volta", vezes: 31 },
    { modelo: "Mira", vezes: 28 },
    { modelo: "Orto", vezes: 22 },
  ],
};

// ── Monitor de erros do site ──────────────────────────────────────────────

export const ERROS_SITE: SiteError[] = [
  {
    id: "err-1",
    type: "checkout_falha",
    path: "/checkout",
    description:
      "Falha ao criar preferência de pagamento — Mercado Pago retornou 502 em 3 tentativas.",
    severity: "alta",
    detected_at: `${HOJE}T13:12:00`,
    resolved: false,
  },
  {
    id: "err-2",
    type: "imagem_faltando",
    path: "/produto/mira-titanio-negro",
    description: "Imagem secundária do produto Mira (ENK-007) retornou 404.",
    severity: "media",
    detected_at: `${HOJE}T10:47:00`,
    resolved: false,
  },
  {
    id: "err-3",
    type: "404",
    path: "/colecao/verao",
    description: "Página acessada 14 vezes hoje não existe. Possível link quebrado em campanha.",
    severity: "baixa",
    detected_at: `${HOJE}T08:30:00`,
    resolved: true,
  },
];

// ── Logs de IA ────────────────────────────────────────────────────────────

export const AI_LOGS: AiLog[] = [
  { id: "log-1", endpoint: "/api/ai/reply", module: "mensagens", input_tokens: 1240, output_tokens: 380, cost_usd: 0.0084, created_at: `${HOJE}T14:29:00` },
  { id: "log-2", endpoint: "/api/ai/classify", module: "mensagens", input_tokens: 320, output_tokens: 12, cost_usd: 0.0011, created_at: `${HOJE}T14:28:30` },
  { id: "log-3", endpoint: "/api/ai/gerar-legenda", module: "instagram", input_tokens: 540, output_tokens: 410, cost_usd: 0.0072, created_at: `${HOJE}T11:15:00` },
  { id: "log-4", endpoint: "/api/ai/monitor", module: "monitor", input_tokens: 880, output_tokens: 95, cost_usd: 0.0039, created_at: `${HOJE}T13:12:00` },
  { id: "log-5", endpoint: "/api/ai/scanner-oculos", module: "scanner", input_tokens: 1500, output_tokens: 620, cost_usd: 0.0162, created_at: `${HOJE}T09:40:00` },
];

export const AI_CUSTO_TOTAL_USD = AI_LOGS.reduce((s, l) => s + l.cost_usd, 0);

// ── Alertas de estoque baixo ──────────────────────────────────────────────

export const ALERTAS_ESTOQUE: StockAlert[] = [
  { id: "sa-1", product_id: "p-007", product_name: "Mira", product_code: "ENK-007", min_quantity: 5, current_quantity: 3, alerted_at: `${HOJE}T08:00:00` },
  { id: "sa-2", product_id: "p-005", product_name: "Orto", product_code: "ENK-005", min_quantity: 5, current_quantity: 4, alerted_at: `${HOJE}T08:00:00` },
  { id: "sa-3", product_id: "p-002", product_name: "Lume", product_code: "ENK-002", min_quantity: 6, current_quantity: 5, alerted_at: `${HOJE}T08:00:00` },
];

// ── Alertas de demanda (modelo perguntado e não cadastrado) ──────────────

export const ALERTAS_DEMANDA: DemandAlert[] = [
  { id: "da-1", model_mentioned: "Ray-Ban Wayfarer", mentions: 12, period: "esta semana", in_catalog: false, created_at: `${HOJE}T07:00:00` },
  { id: "da-2", model_mentioned: "Oakley Holbrook", mentions: 8, period: "esta semana", in_catalog: false, created_at: `${HOJE}T07:00:00` },
];

// ── Instagram: posts agendados/publicados ────────────────────────────────

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "ig-1",
    type: "foto_produto",
    caption:
      "Aurora. Acetato italiano em grafite, para quem aprecia o essencial bem feito. ✨",
    hashtags: ["#otica", "#oculosdegrau", "#acetato", "#enoke", "#eyewear"],
    image_url: "/placeholders/aurora-acetato-grafite-1.svg",
    video_url: null,
    product_id: "p-001",
    scheduled_at: null,
    published_at: `${HOJE}T09:00:00`,
    status: "published",
    ig_post_id: "ig_post_001",
  },
  {
    id: "ig-2",
    type: "dica_saude",
    caption:
      "Luz azul cansa a vista? Conheça as lentes com filtro e proteja seus olhos no dia a dia. 👓",
    hashtags: ["#saudevisual", "#luzazul", "#dica", "#otica"],
    image_url: "/placeholders/lume-titanio-bronze-1.svg",
    video_url: null,
    product_id: null,
    scheduled_at: "2026-05-29T18:00:00",
    published_at: null,
    status: "scheduled",
    ig_post_id: null,
  },
  {
    id: "ig-3",
    type: "promocao",
    caption: "Semana do solar: 15% OFF em modelos selecionados. Corre que é por tempo limitado! ☀️",
    hashtags: ["#promocao", "#oculosdesol", "#desconto", "#enoke"],
    image_url: "/placeholders/volta-acetato-tartaruga-1.svg",
    video_url: null,
    product_id: "p-003",
    scheduled_at: "2026-05-30T12:00:00",
    published_at: null,
    status: "scheduled",
    ig_post_id: null,
  },
  {
    id: "ig-4",
    type: "tendencia",
    caption: "Titânio é tendência: leveza e resistência em um só quadro. Apresentamos a Mira.",
    hashtags: ["#tendencia", "#titanio", "#moda", "#eyewear"],
    image_url: "/placeholders/mira-titanio-negro-1.svg",
    video_url: null,
    product_id: "p-007",
    scheduled_at: null,
    published_at: null,
    status: "draft",
    ig_post_id: null,
  },
];

export const INSTAGRAM_METRICS: Record<string, InstagramMetric> = {
  "ig-1": {
    id: "im-1",
    post_id: "ig-1",
    likes: 342,
    comments: 28,
    saves: 64,
    reach: 4820,
    direct_messages: 17,
    followers_gained: 23,
    collected_at: `${HOJE}T18:00:00`,
  },
};

// ── Helpers de leitura (simulam queries) ──────────────────────────────────

export function getConversa(id: string): Conversation | undefined {
  return CONVERSAS.find((c) => c.id === id);
}

export function getMensagensDaConversa(conversationId: string): Message[] {
  return MENSAGENS.filter((m) => m.conversation_id === conversationId).sort(
    (a, b) => a.created_at.localeCompare(b.created_at)
  );
}

export function getProdutoPorId(id: string) {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

/** Produtos com estoque abaixo ou igual ao mínimo padrão (usado em /admin/estoque) */
export const ESTOQUE_MINIMO_PADRAO = 6;

// ── Clientes (mock, espelha a tabela customers + agregados) ───────────────

export type ClienteAdmin = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  pedidos: number;
  total_gasto_cents: number;
  created_at: string;
};

export const CLIENTES: ClienteAdmin[] = [
  { id: "c-1", full_name: "Mariana Alves", email: "mariana.alves@email.com", phone: "+55 11 99812-3344", pedidos: 3, total_gasto_cents: 612000, created_at: "2025-11-12" },
  { id: "c-2", full_name: "João Pedro Souza", email: "joao.pedro@email.com", phone: "+55 11 98123-4455", pedidos: 1, total_gasto_cents: 245000, created_at: "2026-02-03" },
  { id: "c-3", full_name: "Carla Souza", email: "carla.souza@email.com", phone: "+55 21 98765-1122", pedidos: 2, total_gasto_cents: 389000, created_at: "2025-09-21" },
  { id: "c-4", full_name: "Luana Ferreira", email: "lu.ferreira@email.com", phone: "+55 31 99654-7788", pedidos: 5, total_gasto_cents: 1024000, created_at: "2025-06-30" },
  { id: "c-5", full_name: "Rafael Lima", email: "rafael.lima@email.com", phone: "+55 11 91234-5678", pedidos: 1, total_gasto_cents: 198000, created_at: "2026-04-18" },
];

// ── Pedidos (mock, espelha a tabela orders) ───────────────────────────────

export type PedidoAdmin = {
  id: string;
  cliente: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";
  total_cents: number;
  itens: number;
  created_at: string;
};

export const PEDIDOS: PedidoAdmin[] = [
  { id: "PED-1042", cliente: "Mariana Alves", status: "paid", total_cents: 189000, itens: 1, created_at: `${HOJE}T14:10:00` },
  { id: "PED-1041", cliente: "Rafael Lima", status: "pending", total_cents: 198000, itens: 1, created_at: `${HOJE}T11:32:00` },
  { id: "PED-1040", cliente: "Luana Ferreira", status: "shipped", total_cents: 245000, itens: 1, created_at: "2026-05-27T16:45:00" },
  { id: "PED-1039", cliente: "Carla Souza", status: "delivered", total_cents: 168000, itens: 1, created_at: "2026-05-26T09:20:00" },
  { id: "PED-1038", cliente: "João Pedro Souza", status: "paid", total_cents: 325000, itens: 1, created_at: "2026-05-25T19:05:00" },
  { id: "PED-1037", cliente: "Mariana Alves", status: "cancelled", total_cents: 175000, itens: 1, created_at: "2026-05-24T13:50:00" },
  { id: "PED-1036", cliente: "Luana Ferreira", status: "delivered", total_cents: 423000, itens: 2, created_at: "2026-05-22T10:15:00" },
];
