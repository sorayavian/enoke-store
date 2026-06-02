import "server-only";

/**
 * Cliente da Evolution API (WhatsApp).
 *
 * Envia mensagens de texto de volta para o cliente. Requer no .env:
 *   WHATSAPP_API_URL       — base da sua instância Evolution (ex.: https://evo.seudominio.com)
 *   WHATSAPP_API_TOKEN     — apikey global da Evolution
 *   WHATSAPP_INSTANCE      — nome da instância conectada (o número que atende)
 *
 * Sem essas variáveis, `enviarWhatsApp` apenas loga e retorna false — o webhook
 * continua funcionando em modo demonstração.
 */

export const EVOLUTION_CONFIGURED = Boolean(
  process.env.WHATSAPP_API_URL &&
    process.env.WHATSAPP_API_TOKEN &&
    process.env.WHATSAPP_INSTANCE
);

/**
 * Envia uma mensagem de texto via Evolution API.
 * `numero` deve estar no formato internacional só com dígitos (ex.: 5511999998888).
 */
export async function enviarWhatsApp(
  numero: string,
  texto: string
): Promise<boolean> {
  if (!EVOLUTION_CONFIGURED) {
    console.warn("[evolution] não configurado — resposta não enviada ao WhatsApp.");
    return false;
  }

  const base = process.env.WHATSAPP_API_URL!.replace(/\/$/, "");
  const instance = process.env.WHATSAPP_INSTANCE!;
  const url = `${base}/message/sendText/${instance}`;

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.WHATSAPP_API_TOKEN!,
      },
      body: JSON.stringify({
        number: soDigitos(numero),
        text: texto,
      }),
    });

    if (!resp.ok) {
      const corpo = await resp.text().catch(() => "");
      console.error(`[evolution] envio falhou (${resp.status}):`, corpo.slice(0, 300));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[evolution] erro de rede:", (e as Error).message);
    return false;
  }
}

/** Mantém apenas dígitos no número (a Evolution espera 55DDDNUMERO). */
export function soDigitos(numero: string): string {
  return numero.replace(/\D/g, "");
}
