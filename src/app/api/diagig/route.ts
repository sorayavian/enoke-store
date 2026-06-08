import { NextResponse } from "next/server";

// DIAGNÓSTICO TEMPORÁRIO — remover depois.
// Verifica se a conta IG está inscrita nos webhooks do app (subscribed_apps)
// e quais campos. Usa graph.instagram.com com o token da conta.
export async function GET() {
  const tok = process.env.META_GRAPH_TOKEN;
  if (!tok) return NextResponse.json({ erro: "sem META_GRAPH_TOKEN" });

  async function get(path: string) {
    try {
      const r = await fetch(
        `https://graph.instagram.com/v21.0/${path}${path.includes("?") ? "&" : "?"}access_token=${encodeURIComponent(tok!)}`,
        { cache: "no-store" }
      );
      return await r.json();
    } catch (e) {
      return { erro_fetch: (e as Error).message };
    }
  }

  const me = await get("me?fields=id,username,user_id");
  const subscribed = await get("me/subscribed_apps");

  return NextResponse.json({ me, subscribed });
}
