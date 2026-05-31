import { NextResponse } from "next/server";
import { monitorar } from "@/lib/ai/client";

// POST /api/ai/monitor — recebe { eventos: [{type, path}] } e retorna problemas detectados.
export async function POST(req: Request) {
  try {
    const { eventos } = (await req.json()) as {
      eventos?: { type: string; path: string }[];
    };
    if (!Array.isArray(eventos)) {
      return NextResponse.json({ error: "eventos deve ser um array" }, { status: 400 });
    }
    const problemas = await monitorar(eventos);
    return NextResponse.json({ problemas });
  } catch {
    return NextResponse.json({ error: "Falha ao monitorar" }, { status: 500 });
  }
}
