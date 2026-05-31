import { NextResponse } from "next/server";
import { classificar } from "@/lib/ai/client";

// POST /api/ai/classify — classifica a mensagem em reclamação | avaliação | pergunta | intenção de compra.
export async function POST(req: Request) {
  try {
    const { mensagem } = (await req.json()) as { mensagem?: string };
    if (!mensagem) {
      return NextResponse.json({ error: "mensagem é obrigatória" }, { status: 400 });
    }
    const classificacao = await classificar(mensagem);
    return NextResponse.json({ classificacao });
  } catch {
    return NextResponse.json({ error: "Falha ao classificar" }, { status: 500 });
  }
}
