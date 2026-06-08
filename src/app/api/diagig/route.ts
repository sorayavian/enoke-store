import { NextResponse } from "next/server";
import { SUPABASE_WRITE_CONFIGURED } from "@/lib/supabase/is-configured";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

// DIAGNÓSTICO TEMPORÁRIO — remover depois.
// Mostra os payloads brutos que a Meta enviou ao webhook do Instagram.
export async function GET() {
  if (!SUPABASE_WRITE_CONFIGURED) {
    return NextResponse.json({ erro: "SUPABASE_WRITE não configurado" });
  }
  const sb = createSupabaseServiceClient();
  const debug = await sb
    .from("site_errors")
    .select("description, detected_at")
    .eq("type", "ig_webhook_debug")
    .order("detected_at", { ascending: false })
    .limit(10);
  return NextResponse.json({
    chamadas_recebidas: debug.data?.length ?? 0,
    payloads: debug.data ?? [],
    erro: debug.error?.message ?? null,
  });
}
