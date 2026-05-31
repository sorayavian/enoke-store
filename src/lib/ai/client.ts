import "server-only";

/**
 * Camada de acesso à IA (Anthropic Claude).
 *
 * Hoje funciona em modo STUB: retorna respostas simuladas, suficientes para
 * demonstrar o painel sem chave de API. Quando a integração real entrar:
 *
 *   1. npm install @anthropic-ai/sdk
 *   2. defina ANTHROPIC_API_KEY no .env.local
 *   3. substitua o corpo de `gerarResposta`/`classificar`/etc. por chamadas
 *      reais ao SDK, usando SYSTEM_PROMPT e AI_MODEL de ./system-prompt.
 *
 * Toda função registra (em produção) um ai_log com tokens/custo.
 */

import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import type { MessageClassification } from "@/lib/admin/types";

export const IA_CONECTADA = Boolean(process.env.ANTHROPIC_API_KEY);

export type HistoricoItem = { role: "user" | "assistant"; content: string };

/** Resposta de atendimento ao cliente. */
export async function gerarResposta(
  mensagem: string,
  historico: HistoricoItem[] = []
): Promise<string> {
  void mensagem;
  void historico;
  if (!IA_CONECTADA) {
    return (
      "Olá! Obrigada pela sua mensagem. " +
      "Posso te ajudar com modelos, lentes, prazos e agendamento de visita. " +
      "(Resposta de demonstração — conecte ANTHROPIC_API_KEY para respostas reais.)"
    );
  }
  // TODO(produção): chamar Anthropic SDK com SYSTEM_PROMPT.
  void SYSTEM_PROMPT;
  throw new Error("Integração Anthropic não implementada neste ambiente.");
}

/** Classifica a mensagem do cliente. */
export async function classificar(
  mensagem: string
): Promise<MessageClassification> {
  if (!IA_CONECTADA) {
    const m = mensagem.toLowerCase();
    if (/(ruim|riscad|defeito|reclama|quebr|errad)/.test(m)) return "reclamacao";
    if (/(obrigad|excelente|amei|ótimo|otimo|parab)/.test(m)) return "avaliacao";
    if (/(comprar|quero|preço|preco|valor|disponível|disponivel)/.test(m))
      return "intencao_compra";
    return "pergunta";
  }
  throw new Error("Integração Anthropic não implementada neste ambiente.");
}

/** Extrai o nome de um modelo de produto mencionado na mensagem. */
export async function extrairIntencao(
  mensagem: string
): Promise<{ modelo: string | null }> {
  if (!IA_CONECTADA) {
    const modelos = ["Aurora", "Lume", "Volta", "Siena", "Orto", "Mira", "Alba", "Porto", "Nido"];
    const achado = modelos.find((m) =>
      mensagem.toLowerCase().includes(m.toLowerCase())
    );
    return { modelo: achado ?? null };
  }
  throw new Error("Integração Anthropic não implementada neste ambiente.");
}

/** Analisa eventos do site e retorna problemas detectados. */
export async function monitorar(
  eventos: { type: string; path: string }[]
): Promise<{ type: string; path: string; description: string; severity: "baixa" | "media" | "alta" }[]> {
  if (!IA_CONECTADA) {
    return eventos.map((e) => ({
      type: e.type,
      path: e.path,
      description: `Evento ${e.type} detectado em ${e.path}.`,
      severity: e.type === "checkout_falha" ? "alta" : "media",
    }));
  }
  throw new Error("Integração Anthropic não implementada neste ambiente.");
}
