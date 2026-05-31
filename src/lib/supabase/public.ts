import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Cliente Supabase de LEITURA pública (catálogo).
 *
 * Não usa cookies — por isso pode rodar durante a geração estática (build),
 * ao contrário do client baseado em `cookies()`. Usa a anon key, então só
 * enxerga o que a RLS permite ao público (produtos ativos, categorias).
 */
export function createSupabasePublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
