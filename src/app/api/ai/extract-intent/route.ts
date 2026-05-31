import { NextResponse } from "next/server";
import { extrairIntencao } from "@/lib/ai/client";

// POST /api/ai/extract-intent — extrai o modelo de produto mencionado na mensagem.
export async function POST(req: Request) {
  try {
    const { mensagem } = (await req.json()) as { mensagem?: string };
    if (!mensagem) {
      return NextResponse.json({ error: "mensagem é obrigatória" }, { status: 400 });
    }
    const resultado = await extrairIntencao(mensagem);
    return NextResponse.json(resultado);
  } catch {
    return NextResponse.json({ error: "Falha ao extrair intenção" }, { status: 500 });
  }
}
