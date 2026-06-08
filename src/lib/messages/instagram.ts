import "server-only";

/**
 * Cliente do Instagram (DMs) via Instagram Login / Graph API do Instagram.
 *
 * Usa graph.instagram.com (NÃO graph.facebook.com): o token do Instagram Login
 * (prefixo "IGAA...") só é aceito nesse host. O envio é em /me/messages com o
 * token como query param.
 *
 * Requer no .env:
 *   META_GRAPH_TOKEN  — token de acesso da conta Instagram business
 *
 * Sem token, `enviarInstagram` apenas loga e retorna false.
 */

export const INSTAGRAM_CONFIGURED = Boolean(process.env.META_GRAPH_TOKEN);

const GRAPH_VERSION = "v21.0";
const GRAPH_HOST = "https://graph.instagram.com";

/**
 * Envia uma mensagem de texto para um usuário do Instagram.
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

  const url = `${GRAPH_HOST}/${GRAPH_VERSION}/me/messages?access_token=${encodeURIComponent(
    process.env.META_GRAPH_TOKEN!
  )}`;
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
