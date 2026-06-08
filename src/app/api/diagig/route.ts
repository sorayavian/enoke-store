import { NextResponse } from "next/server";
import { SUPABASE_WRITE_CONFIGURED } from "@/lib/supabase/is-configured";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

// DIAGNÓSTICO TEMPORÁRIO — remover depois.
// Mostra as últimas conversas/mensagens de origem 'ig' no banco, para saber
// se o webhook do Instagram está chegando e salvando.
export async function GET() {
  if (!SUPABASE_WRITE_CONFIGURED) {
    return NextResponse.json({ erro: "SUPABASE_WRITE não configurado" });
  }
  const sb = createSupabaseServiceClient();
  const conv = await sb
    .from("conversations")
    .select("customer_contact, customer_name, status, updated_at")
    .eq("source", "ig")
    .order("updated_at", { ascending: false })
    .limit(10);
  const msg = await sb
    .from("messages")
    .select("customer_contact, content, direction, created_at")
    .eq("source", "ig")
    .order("created_at", { ascending: false })
    .limit(10);
  return NextResponse.json({
    conversas_ig: conv.data ?? [],
    conversas_erro: conv.error?.message ?? null,
    mensagens_ig: msg.data ?? [],
    mensagens_erro: msg.error?.message ?? null,
  });
}
