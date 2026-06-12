import { NextResponse } from "next/server";
import { SUPABASE_WRITE_CONFIGURED } from "@/lib/supabase/is-configured";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

// DIAGNÓSTICO TEMPORÁRIO — remover depois.
// GET: mostra logs de debug + mensagens IG.
// GET ?limpar=1: apaga os logs de debug antigos.
export async function GET(req: Request) {
  if (!SUPABASE_WRITE_CONFIGURED) {
    return NextResponse.json({ erro: "sem supabase write" });
  }
  const sb = createSupabaseServiceClient();

  if (new URL(req.url).searchParams.get("limpar") === "1") {
    await sb.from("site_errors").delete().eq("type", "ig_webhook_debug");
    return NextResponse.json({ limpou: true });
  }

  const d = await sb
    .from("site_errors")
    .select("description, detected_at")
    .eq("type", "ig_webhook_debug")
    .order("detected_at", { ascending: false })
    .limit(10);
  const m = await sb
    .from("messages")
    .select("customer_contact, content, direction, created_at")
    .eq("source", "ig")
    .order("created_at", { ascending: false })
    .limit(6);
  return NextResponse.json({
    debug_count: d.data?.length ?? 0,
    debug: d.data ?? [],
    mensagens_ig: m.data ?? [],
  });
}
