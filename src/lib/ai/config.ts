/**
 * Interruptor GLOBAL da resposta automática da IA.
 *
 * Quando desligado, os webhooks de WhatsApp/Instagram continuam recebendo,
 * classificando e SALVANDO as mensagens no painel — mas a IA NÃO gera nem
 * envia resposta automática. O atendimento fica manual.
 *
 * Controle por variável de ambiente AI_AUTO_REPLY_ENABLED:
 *   - ausente ou "true"  → IA responde automaticamente (padrão)
 *   - "false"            → IA não responde (somente registra)
 *
 * Observação: além deste interruptor global, cada conversa tem o seu próprio
 * `ai_enabled` no banco. A IA só responde quando AMBOS estão ligados.
 */
export const AUTO_REPLY_GLOBAL_ON =
  (process.env.AI_AUTO_REPLY_ENABLED ?? "true").trim().toLowerCase() !== "false";
