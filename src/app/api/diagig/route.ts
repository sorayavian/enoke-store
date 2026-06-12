import { NextResponse } from "next/server";
import { SUPABASE_WRITE_CONFIGURED } from "@/lib/supabase/is-configured";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

// DIAGNÓSTICO TEMPORÁRIO — remover depois.
// Mostra o conteúdo dos logs de debug do webhook IG (o payload que chegou).
export async function GET() {
  if (!SUPABASE_WRITE_CONFIGURED) {
    return NextResponse.json({ erro: "sem supabase write" });
  }
  const sb = createSupabaseServiceClient();
  const d = await sb
    .from("site_errors")
    .select("description, detected_at")
    .eq("type", "ig_webhook_debug")
    .order("detected_at", { ascending: false })
    .limit(10);
  return NextResponse.json({
    quantidade: d.data?.length ?? 0,
    payloads: d.data ?? [],
    erro: d.error?.message ?? null,
  });
}
