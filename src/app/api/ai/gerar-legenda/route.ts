import { NextResponse } from "next/server";
import { IA_CONECTADA } from "@/lib/ai/client";

// POST /api/ai/gerar-legenda — retorna 3 opções de legenda + hashtags.
// Recebe { tipo, produto?, tom? }. Stub enquanto Anthropic não está conectado.
export async function POST(req: Request) {
  try {
    const { produto } = (await req.json()) as {
      tipo?: string;
      produto?: string;
      tom?: string;
    };
    if (!IA_CONECTADA) {
      const nome = produto ?? "nosso novo modelo";
      return NextResponse.json({
        legendas: [
          `${nome}: design autoral e acabamento impecável. ✨`,
          `Conheça ${nome} — leveza e estilo em cada detalhe. 👓`,
          `Novo na ENOKE: ${nome}. Experimente o conforto sob medida.`,
        ],
        hashtags: ["#otica", "#oculos", "#eyewear", "#enoke", "#estilo"],
        stub: true,
      });
    }
    return NextResponse.json({ error: "Integração não implementada" }, { status: 501 });
  } catch {
    return NextResponse.json({ error: "Falha ao gerar legenda" }, { status: 500 });
  }
}
