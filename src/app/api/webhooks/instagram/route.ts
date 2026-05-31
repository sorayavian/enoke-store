import { NextResponse } from "next/server";
import { classificar, gerarResposta } from "@/lib/ai/client";

/**
 * POST /api/webhooks/instagram — recebe eventos da Meta Graph API (DMs).
 *
 * Mesmo fluxo do webhook do WhatsApp, porém origem "ig".
 * Stub: classifica e gera resposta simulada, sem persistir.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      contato?: string;
      mensagem?: string;
    };
    const mensagem = body.mensagem ?? "";
    if (!mensagem) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const classificacao = await classificar(mensagem);
    const resposta = await gerarResposta(mensagem);

    return NextResponse.json({
      ok: true,
      source: "ig",
      contato: body.contato ?? null,
      classificacao,
      resposta,
      persisted: false,
    });
  } catch {
    return NextResponse.json({ error: "Falha no webhook" }, { status: 500 });
  }
}

// Verificação do webhook da Meta (GET com hub.challenge).
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const challenge = params.get("hub.challenge");
  const token = params.get("hub.verify_token");
  // Em produção, comparar token com process.env.IG_VERIFY_TOKEN.
  if (challenge && token) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("ok", { status: 200 });
}
