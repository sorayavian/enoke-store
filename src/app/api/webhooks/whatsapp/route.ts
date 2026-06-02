import { NextResponse } from "next/server";
import { classificar, gerarResposta, type HistoricoItem } from "@/lib/ai/client";
import {
  obterOuCriarConversa,
  salvarMensagem,
  escalarConversa,
} from "@/lib/messages/store";
import { enviarWhatsApp } from "@/lib/messages/evolution";
import { AUTO_REPLY_GLOBAL_ON } from "@/lib/ai/config";

/**
 * POST /api/webhooks/whatsapp — recebe eventos da Evolution API.
 *
 * Fluxo completo:
 *   1. extrai contato + texto do payload da Evolution (evento messages.upsert)
 *   2. ignora mensagens enviadas por nós mesmos (fromMe)
 *   3. encontra/cria a conversa e salva a mensagem recebida (direction "in")
 *   4. classifica a mensagem
 *   5. se a IA está ligada na conversa, gera resposta, envia de volta e salva
 *   6. reclamação → escala a conversa para atendimento humano
 */

type EvolutionPayload = {
  event?: string;
  data?: {
    key?: { remoteJid?: string; fromMe?: boolean };
    pushName?: string;
    message?: {
      conversation?: string;
      extendedTextMessage?: { text?: string };
    };
  };
  // Formato simplificado (testes manuais): { contato, mensagem }
  contato?: string;
  mensagem?: string;
};

/** Extrai { contato, texto, nome, fromMe } de qualquer formato aceito. */
function parsePayload(body: EvolutionPayload): {
  contato: string;
  texto: string;
  nome: string | null;
  fromMe: boolean;
} {
  // Formato simplificado para testes.
  if (body.mensagem) {
    return {
      contato: body.contato ?? "",
      texto: body.mensagem,
      nome: null,
      fromMe: false,
    };
  }

  const data = body.data;
  const jid = data?.key?.remoteJid ?? "";
  // remoteJid vem como "5511999998888@s.whatsapp.net" → fica só o número.
  const contato = jid.split("@")[0] ?? "";
  const texto =
    data?.message?.conversation ??
    data?.message?.extendedTextMessage?.text ??
    "";
  return {
    contato,
    texto,
    nome: data?.pushName ?? null,
    fromMe: Boolean(data?.key?.fromMe),
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as EvolutionPayload;
    const { contato, texto, nome, fromMe } = parsePayload(body);

    // Pings/validações sem texto, ou eco da nossa própria mensagem → ignora.
    if (!texto || fromMe) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    // 1. Conversa + mensagem recebida.
    const conversa = await obterOuCriarConversa("wa", contato, nome);
    const classificacao = await classificar(texto);
    await salvarMensagem({
      conversationId: conversa.id,
      source: "wa",
      contato,
      conteudo: texto,
      direction: "in",
      classification: classificacao,
    });

    // 2. IA desligada (global OU nesta conversa) → só registra; humano responde.
    if (!AUTO_REPLY_GLOBAL_ON || !conversa.ai_enabled) {
      return NextResponse.json({
        ok: true,
        source: "wa",
        contato,
        classificacao,
        respondido_pela_ia: false,
        motivo: !AUTO_REPLY_GLOBAL_ON ? "ai_global_off" : "ai_disabled",
      });
    }

    // 3. Gera resposta da IA.
    const historico: HistoricoItem[] = []; // (opcional: carregar últimas N mensagens)
    const resposta = await gerarResposta(texto, historico);

    // 4. Reclamação → escala para humano (mas ainda envia um aviso gentil).
    if (classificacao === "reclamacao") {
      await escalarConversa(conversa.id);
    }

    // 5. Envia de volta pelo WhatsApp e salva a resposta.
    const enviado = await enviarWhatsApp(contato, resposta);
    await salvarMensagem({
      conversationId: conversa.id,
      source: "wa",
      contato,
      conteudo: resposta,
      direction: "out",
      aiGenerated: true,
    });

    return NextResponse.json({
      ok: true,
      source: "wa",
      contato,
      classificacao,
      respondido_pela_ia: true,
      enviado,
      resposta,
    });
  } catch (e) {
    console.error("[webhook/whatsapp]", (e as Error).message);
    return NextResponse.json({ error: "Falha no webhook" }, { status: 500 });
  }
}

// Verificação de webhook (alguns provedores fazem GET com challenge).
export async function GET(req: Request) {
  const challenge = new URL(req.url).searchParams.get("hub.challenge");
  return new Response(challenge ?? "ok", { status: 200 });
}
