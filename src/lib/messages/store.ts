import "server-only";

/**
 * Persistência de conversas e mensagens (WhatsApp + Instagram).
 *
 * Centraliza o fluxo que os webhooks usam:
 *   1. encontra/cria a conversa do contato (upsert por source+contato)
 *   2. salva a mensagem recebida (direction "in")
 *   3. salva a resposta da IA (direction "out")
 *
 * Tudo via service role (server-only). Se o Supabase não estiver configurado,
 * as funções viram no-op tolerante — o webhook continua respondendo sem quebrar.
 */

import { SUPABASE_WRITE_CONFIGURED } from "@/lib/supabase/is-configured";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import type { MessageSource, MessageClassification, ConversationStatus } from "@/lib/admin/types";

export type ConversaInfo = {
  id: string | null;
  ai_enabled: boolean;
  status: ConversationStatus;
};

/**
 * Garante que existe uma conversa para (source, contato) e devolve seu id e
 * configurações. Cria se não existir. Sem Supabase, devolve id null e ai
 * habilitada (modo demonstração).
 */
export async function obterOuCriarConversa(
  source: MessageSource,
  contato: string,
  nome?: string | null
): Promise<ConversaInfo> {
  if (!SUPABASE_WRITE_CONFIGURED) {
    return { id: null, ai_enabled: true, status: "open" };
  }

  const sb = createSupabaseServiceClient();

  // Linha retornada pelo select (tipos manuais do Database inferem `never` no
  // encadeamento, então tipamos explicitamente).
  type LinhaConversa = { id: string; ai_enabled: boolean; status: string };

  // Já existe?
  const { data: existenteRaw } = await sb
    .from("conversations")
    .select("id, ai_enabled, status")
    .eq("source", source)
    .eq("customer_contact", contato)
    .maybeSingle();
  const existente = existenteRaw as LinhaConversa | null;

  if (existente) {
    return {
      id: existente.id,
      ai_enabled: existente.ai_enabled,
      status: existente.status as ConversationStatus,
    };
  }

  // Cria nova conversa.
  const novaLinha = {
    source,
    customer_contact: contato,
    customer_name: nome ?? null,
    status: "open" as const,
    ai_enabled: true,
  };
  const { data: criadaRaw, error } = await sb
    .from("conversations")
    .insert(novaLinha as never)
    .select("id, ai_enabled, status")
    .single();
  const criada = criadaRaw as LinhaConversa | null;

  if (error || !criada) {
    console.error("[messages/store] criar conversa:", error?.message);
    return { id: null, ai_enabled: true, status: "open" };
  }
  return {
    id: criada.id,
    ai_enabled: criada.ai_enabled,
    status: criada.status as ConversationStatus,
  };
}

/** Salva uma mensagem recebida ou enviada. Best-effort. */
export async function salvarMensagem(params: {
  conversationId: string | null;
  source: MessageSource;
  contato: string;
  conteudo: string;
  direction: "in" | "out";
  classification?: MessageClassification | null;
  aiGenerated?: boolean;
}): Promise<void> {
  if (!SUPABASE_WRITE_CONFIGURED || !params.conversationId) return;
  try {
    const sb = createSupabaseServiceClient();
    const linha = {
      conversation_id: params.conversationId,
      source: params.source,
      customer_contact: params.contato,
      content: params.conteudo,
      direction: params.direction,
      classification: params.classification ?? null,
      ai_generated: params.aiGenerated ?? false,
    };
    await sb.from("messages").insert(linha as never);
  } catch (e) {
    console.error("[messages/store] salvar mensagem:", (e as Error).message);
  }
}

/** Marca a conversa como escalada (quando a IA não resolve / reclamação grave). */
export async function escalarConversa(conversationId: string | null): Promise<void> {
  if (!SUPABASE_WRITE_CONFIGURED || !conversationId) return;
  try {
    const sb = createSupabaseServiceClient();
    await sb
      .from("conversations")
      .update({ status: "escalated" } as never)
      .eq("id", conversationId);
  } catch (e) {
    console.error("[messages/store] escalar conversa:", (e as Error).message);
  }
}
