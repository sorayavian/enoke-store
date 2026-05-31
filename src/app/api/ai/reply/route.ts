import { NextResponse } from "next/server";
import { gerarResposta, type HistoricoItem } from "@/lib/ai/client";

// POST /api/ai/reply — recebe { mensagem, historico? } e retorna a resposta da IA.
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      mensagem?: string;
      historico?: HistoricoItem[];
    };
    if (!body.mensagem) {
      return NextResponse.json({ error: "mensagem é obrigatória" }, { status: 400 });
    }
    const resposta = await gerarResposta(body.mensagem, body.historico ?? []);
    return NextResponse.json({ resposta });
  } catch {
    return NextResponse.json({ error: "Falha ao gerar resposta" }, { status: 500 });
  }
}
