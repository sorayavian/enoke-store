import { NextResponse } from "next/server";
import { SUPABASE_WRITE_CONFIGURED } from "@/lib/supabase/is-configured";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

// DIAGNÓSTICO TEMPORÁRIO — remover depois.
export async function GET() {
  if (!SUPABASE_WRITE_CONFIGURED) {
    return NextResponse.json({ erro: "SUPABASE_WRITE não configurado" });
  }
  const sb = createSupabaseServiceClient();
  const msg = await sb
    .from("messages")
    .select("customer_contact, content, direction, created_at")
    .eq("source", "ig")
    .order("created_at", { ascending: false })
    .limit(8);
  return NextResponse.json({
    mensagens_ig: msg.data ?? [],
    erro: msg.error?.message ?? null,
  });
}
