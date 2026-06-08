import { NextResponse } from "next/server";

// DIAGNÓSTICO TEMPORÁRIO — remover depois.
// Testa o token IGAA... contra graph.instagram.com (API correta p/ esse token).
export async function GET() {
  const tok = process.env.META_GRAPH_TOKEN ?? "";

  async function testar(base: string) {
    try {
      const r = await fetch(
        `${base}/v21.0/me?fields=id,username&access_token=${encodeURIComponent(tok)}`,
        { cache: "no-store" }
      );
      const data = (await r.json()) as {
        id?: string;
        username?: string;
        error?: { message?: string };
      };
      return {
        ok: r.ok && Boolean(data.id),
        username: data.username ?? null,
        msg: data.error?.message ?? (data.id ? "válido" : "sem id"),
      };
    } catch (e) {
      return { ok: false, username: null, msg: (e as Error).message };
    }
  }

  const instagram = await testar("https://graph.instagram.com");
  const facebook = await testar("https://graph.facebook.com");

  return NextResponse.json({
    token_prefixo: tok.slice(0, 4),
    via_graph_instagram: instagram,
    via_graph_facebook: facebook,
  });
}
