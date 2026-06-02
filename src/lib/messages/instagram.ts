import "server-only";

/**
 * Cliente da Meta Graph API (Instagram DMs).
 *
 * Envia respostas de texto às DMs. Requer no .env:
 *   META_GRAPH_TOKEN     — token de acesso da página/conta Instagram business
 *   IG_BUSINESS_ID       — id da conta Instagram business (opcional para envio via /me/messages)
 *
 * Está PRONTO mas desativado até a conta Meta ser conectada: sem token,
 * `enviarInstagram` apenas loga e retorna false.
 */

export const INSTAGRAM_CONFIGURED = Boolean(process.env.META_GRAPH_TOKEN);

const GRAPH_VERSION = "v21.0";

/**
 * Envia uma mensagem de texto para um usuário do Instagram via Graph API.
 * `igsid` é o ID do remetente (Instagram-scoped ID) recebido no webhook.
 */
export async function enviarInstagram(
  igsid: string,
  texto: string
): Promise<boolean> {
  if (!INSTAGRAM_CONFIGURED) {
    console.warn("[instagram] não configurado — resposta não enviada à DM.");
    return false;
  }

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/me/messages`;
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.META_GRAPH_TOKEN!}`,
      },
      body: JSON.stringify({
        recipient: { id: igsid },
        message: { text: texto },
      }),
    });

    if (!resp.ok) {
      const corpo = await resp.text().catch(() => "");
      console.error(`[instagram] envio falhou (${resp.status}):`, corpo.slice(0, 300));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[instagram] erro de rede:", (e as Error).message);
    return false;
  }
}
