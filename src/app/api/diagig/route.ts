import { NextResponse } from "next/server";

// DIAGNÓSTICO TEMPORÁRIO — remover depois.
// Verifica se as variáveis do Instagram estão configuradas no ambiente
// (sem revelar os valores) e testa o token contra a Graph API.
export async function GET() {
  const tokenDefinido = Boolean(process.env.META_GRAPH_TOKEN);
  const verifyDefinido = Boolean(process.env.IG_VERIFY_TOKEN);

  let grafoOk: boolean | null = null;
  let grafoMsg: string | null = null;

  if (tokenDefinido) {
    try {
      // Chama /me na Graph API para validar o token.
      const r = await fetch(
        `https://graph.facebook.com/v21.0/me?access_token=${encodeURIComponent(
          process.env.META_GRAPH_TOKEN!
        )}`,
        { cache: "no-store" }
      );
      const data = (await r.json()) as { id?: string; error?: { message?: string } };
      grafoOk = r.ok && Boolean(data.id);
      grafoMsg = data.error?.message ?? (data.id ? "token válido" : "sem id");
    } catch (e) {
      grafoOk = false;
      grafoMsg = (e as Error).message;
    }
  }

  return NextResponse.json({
    META_GRAPH_TOKEN_definido: tokenDefinido,
    IG_VERIFY_TOKEN_definido: verifyDefinido,
    token_valido_na_graph_api: grafoOk,
    detalhe: grafoMsg,
  });
}
