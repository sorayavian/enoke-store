/**
 * Rótulos legíveis (pt-BR) e estilos de badge para os enums do admin.
 * Centraliza a tradução para que as páginas só importem daqui.
 */

import type {
  ConversationStatus,
  InstagramPostStatus,
  InstagramPostType,
  MessageClassification,
  MessageSource,
  SiteErrorType,
} from "@/lib/admin/types";

// ── Origem da mensagem (WhatsApp / Instagram) ─────────────────────────────

export const SOURCE_LABEL: Record<MessageSource, string> = {
  wa: "WhatsApp",
  ig: "Instagram",
};

export const SOURCE_BADGE: Record<MessageSource, string> = {
  wa: "bg-success/20 text-success",
  ig: "bg-amber/20 text-amber-soft",
};

export const SOURCE_SHORT: Record<MessageSource, string> = {
  wa: "WA",
  ig: "IG",
};

// ── Classificação da mensagem ─────────────────────────────────────────────

export const CLASSIFICATION_LABEL: Record<MessageClassification, string> = {
  reclamacao: "Reclamação",
  avaliacao: "Avaliação",
  pergunta: "Pergunta",
  intencao_compra: "Intenção de compra",
};

export const CLASSIFICATION_BADGE: Record<MessageClassification, string> = {
  reclamacao: "bg-danger/25 text-ink",
  avaliacao: "bg-success/25 text-ink",
  pergunta: "bg-mist text-stone-500",
  intencao_compra: "bg-amber/25 text-amber-soft",
};

// ── Status da conversa ────────────────────────────────────────────────────

export const CONV_STATUS_LABEL: Record<ConversationStatus, string> = {
  open: "Pendente",
  resolved: "Respondida",
  escalated: "Escalada",
};

export const CONV_STATUS_BADGE: Record<ConversationStatus, string> = {
  open: "bg-warning/25 text-amber-soft",
  resolved: "bg-success/25 text-success",
  escalated: "bg-danger/25 text-ink",
};

// ── Status do pedido (reaproveitado do schema de orders) ──────────────────

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  paid: "Pago",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

export const ORDER_STATUS_BADGE: Record<string, string> = {
  pending: "bg-warning/25 text-amber-soft",
  paid: "bg-success/25 text-success",
  shipped: "bg-amber/25 text-amber-soft",
  delivered: "bg-success/25 text-success",
  cancelled: "bg-danger/25 text-ink",
  refunded: "bg-mist text-stone-500",
};

// ── Erros do site ─────────────────────────────────────────────────────────

export const ERROR_TYPE_LABEL: Record<SiteErrorType, string> = {
  "404": "Página não encontrada",
  checkout_falha: "Falha no checkout",
  imagem_faltando: "Imagem faltando",
  erro_servidor: "Erro de servidor",
  outro: "Outro",
};

export const SEVERITY_BADGE: Record<"baixa" | "media" | "alta", string> = {
  baixa: "bg-mist text-stone-500",
  media: "bg-warning/25 text-amber-soft",
  alta: "bg-danger/25 text-ink",
};

// ── Instagram ─────────────────────────────────────────────────────────────

export const IG_POST_TYPE_LABEL: Record<InstagramPostType, string> = {
  foto_produto: "Foto de produto",
  dica_saude: "Dica de saúde visual",
  tendencia: "Tendência de moda",
  promocao: "Promoção",
};

export const IG_STATUS_LABEL: Record<InstagramPostStatus, string> = {
  draft: "Rascunho",
  scheduled: "Agendado",
  published: "Publicado",
  failed: "Falhou",
};

export const IG_STATUS_BADGE: Record<InstagramPostStatus, string> = {
  draft: "bg-mist text-stone-500",
  scheduled: "bg-warning/25 text-amber-soft",
  published: "bg-success/25 text-success",
  failed: "bg-danger/25 text-ink",
};

/** Formata data ISO em horário curto pt-BR (ex.: "28/05 14:32") */
export function formatDataHora(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Formata só a hora (ex.: "14:32") */
export function formatHora(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
