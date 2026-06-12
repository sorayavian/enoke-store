import { NextResponse } from "next/server";
import { SUPABASE_WRITE_CONFIGURED } from "@/lib/supabase/is-configured";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

// DIAGNÓSTICO TEMPORÁRIO — remover depois.
// Confirma config IG + últimas mensagens/debug recebidos.
export async function GET() {
  const tokenDefinido = Boolean(process.env.META_GRAPH_TOKEN);
  const verifyDefinido = Boolean(process.env.IG_VERIFY_TOKEN);

  let me: unknown = null;
  if (tokenDefinido) {
    try {
      const r = await fetch(
        `https://graph.instagram.com/v21.0/me?fields=id,username,user_id&access_token=${encodeURIComponent(
          process.env.META_GRAPH_TOKEN!
        )}`,
        { cache: "no-store" }
      );
      me = await r.json();
    } catch (e) {
      me = { erro: (e as Error).message };
    }
  }

  let msgs: unknown[] = [];
  let debugCount = 0;
  if (SUPABASE_WRITE_CONFIGURED) {
    const sb = createSupabaseServiceClient();
    const m = await sb
      .from("messages")
      .select("customer_contact, content, direction, created_at")
      .eq("source", "ig")
      .order("created_at", { ascending: false })
      .limit(6);
    msgs = m.data ?? [];
    const d = await sb
      .from("site_errors")
      .select("id")
      .eq("type", "ig_webhook_debug");
    debugCount = d.data?.length ?? 0;
  }

  return NextResponse.json({
    token_definido: tokenDefinido,
    verify_definido: verifyDefinido,
    conta: me,
    debug_logs_no_banco: debugCount,
    mensagens_ig: msgs,
  });
}
