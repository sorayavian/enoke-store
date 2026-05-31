import { NextResponse } from "next/server";
import { classificar, gerarResposta } from "@/lib/ai/client";

/**
 * POST /api/webhooks/whatsapp — recebe eventos da Evolution API / Twilio.
 *
 * Fluxo (produção):
 *   1. validar assinatura do provedor
 *   2. extrair contato + texto da mensagem
 *   3. salvar a mensagem recebida (tabela messages, direction "in")
 *   4. classificar e, se ai_enabled, gerar resposta e enviar de volta
 *   5. salvar a resposta (direction "out")
 *
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
      // Provedores enviam pings/validações sem mensagem — responder 200.
      return NextResponse.json({ ok: true, ignored: true });
    }

    const classificacao = await classificar(mensagem);
    const resposta = await gerarResposta(mensagem);

    return NextResponse.json({
      ok: true,
      source: "wa",
      contato: body.contato ?? null,
      classificacao,
      resposta,
      persisted: false, // será true quando o Supabase estiver conectado
    });
  } catch {
    return NextResponse.json({ error: "Falha no webhook" }, { status: 500 });
  }
}

// Verificação de webhook (alguns provedores fazem GET com challenge).
export async function GET(req: Request) {
  const challenge = new URL(req.url).searchParams.get("hub.challenge");
  return new Response(challenge ?? "ok", { status: 200 });
}
