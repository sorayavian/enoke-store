import { NextResponse } from "next/server";

// DIAGNÓSTICO TEMPORÁRIO — remover depois.
// Verifica formato do token (sem revelar o valor) e testa contra a Graph API.
export async function GET() {
  const tok = process.env.META_GRAPH_TOKEN ?? "";
  const verifyDefinido = Boolean(process.env.IG_VERIFY_TOKEN);

  // Pistas de formato (sem revelar o token): tamanho, prefixo, se tem espaços.
  const tamanho = tok.length;
  const prefixo = tok.slice(0, 4); // ex.: "IGAA", "EAAB"...
  const temEspaco = /\s/.test(tok);
  const temAspas = tok.startsWith('"') || tok.endsWith('"');

  let grafoOk: boolean | null = null;
  let grafoMsg: string | null = null;

  if (tok) {
    try {
      const r = await fetch(
        `https://graph.facebook.com/v21.0/me?access_token=${encodeURIComponent(tok)}`,
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
    IG_VERIFY_TOKEN_definido: verifyDefinido,
    token_tamanho: tamanho,
    token_prefixo: prefixo,
    token_tem_espaco_ou_quebra: temEspaco,
    token_tem_aspas: temAspas,
    token_valido_na_graph_api: grafoOk,
    detalhe: grafoMsg,
  });
}
