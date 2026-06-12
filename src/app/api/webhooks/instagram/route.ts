import { NextResponse } from "next/server";
import { classificar, gerarResposta, type HistoricoItem } from "@/lib/ai/client";
import {
  obterOuCriarConversa,
  salvarMensagem,
  escalarConversa,
} from "@/lib/messages/store";
import { enviarInstagram } from "@/lib/messages/instagram";
import { AUTO_REPLY_GLOBAL_ON } from "@/lib/ai/config";

/**
 * POST /api/webhooks/instagram — recebe eventos da Meta Graph API (DMs).
 *
 * Mesmo fluxo do WhatsApp (persiste, classifica, responde com IA se ligada,
 * envia de volta, escala reclamação), porém origem "ig" e envio via Graph API.
 * O envio fica inativo até META_GRAPH_TOKEN ser configurado.
 */

type MsgValue = {
  sender?: { id?: string };
  message?: { text?: string; is_echo?: boolean };
};

type MetaPayload = {
  object?: string;
  entry?: Array<{
    // Formato Messenger clássico: entry[].messaging[]
    messaging?: Array<MsgValue>;
    // Formato Instagram (Graph API do Instagram): entry[].changes[].value
    changes?: Array<{ field?: string; value?: MsgValue }>;
  }>;
  // Formato simplificado (testes manuais): { contato, mensagem }
  contato?: string;
  mensagem?: string;
};

/**
 * Extrai { contato, texto, isEcho } do payload. Aceita os DOIS formatos que a
 * Meta usa para DMs do Instagram:
 *  - Messenger:  entry[].messaging[].message
 *  - Instagram:  entry[].changes[].value.message   (campo "messages")
 * Também aceita o formato simplificado dos testes manuais.
 */
function parsePayload(body: MetaPayload): {
  contato: string;
  texto: string;
  isEcho: boolean;
} {
  if (body.mensagem) {
    return { contato: body.contato ?? "", texto: body.mensagem, isEcho: false };
  }

  const entry = body.entry?.[0];

  // Instagram: changes[].value (campo "messages")
  const change = entry?.changes?.find((c) => c.field === "messages") ?? entry?.changes?.[0];
  const val: MsgValue | undefined = change?.value ?? entry?.messaging?.[0];

  return {
    contato: val?.sender?.id ?? "",
    texto: val?.message?.text ?? "",
    isEcho: Boolean(val?.message?.is_echo),
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as MetaPayload;
    const { contato, texto, isEcho } = parsePayload(body);

    // Sem texto, ou eco da nossa própria mensagem → ignora.
    if (!texto || isEcho) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    // O @ do Instagram não vem no webhook (só o igsid); guardamos o igsid como contato.
    const conversa = await obterOuCriarConversa("ig", contato, null);
    const classificacao = await classificar(texto);
    await salvarMensagem({
      conversationId: conversa.id,
      source: "ig",
      contato,
      conteudo: texto,
      direction: "in",
      classification: classificacao,
    });

    if (!AUTO_REPLY_GLOBAL_ON || !conversa.ai_enabled) {
      return NextResponse.json({
        ok: true,
        source: "ig",
        contato,
        classificacao,
        respondido_pela_ia: false,
        motivo: !AUTO_REPLY_GLOBAL_ON ? "ai_global_off" : "ai_disabled",
      });
    }

    const historico: HistoricoItem[] = [];
    const resposta = await gerarResposta(texto, historico);

    if (classificacao === "reclamacao") {
      await escalarConversa(conversa.id);
    }

    const enviado = await enviarInstagram(contato, resposta);
    await salvarMensagem({
      conversationId: conversa.id,
      source: "ig",
      contato,
      conteudo: resposta,
      direction: "out",
      aiGenerated: true,
    });

    return NextResponse.json({
      ok: true,
      source: "ig",
      contato,
      classificacao,
      respondido_pela_ia: true,
      enviado,
      resposta,
    });
  } catch (e) {
    console.error("[webhook/instagram]", (e as Error).message);
    return NextResponse.json({ error: "Falha no webhook" }, { status: 500 });
  }
}

// Verificação do webhook da Meta (GET com hub.challenge + hub.verify_token).
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const mode = params.get("hub.mode");
  const challenge = params.get("hub.challenge");
  const token = params.get("hub.verify_token");

  // Confirma o token combinado no painel da Meta.
  if (mode === "subscribe" && token && token === process.env.IG_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  // Se ainda não configurou IG_VERIFY_TOKEN, responde o challenge para não travar testes.
  if (challenge && !process.env.IG_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}
