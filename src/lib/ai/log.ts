import "server-only";
import { SUPABASE_WRITE_CONFIGURED } from "@/lib/supabase/is-configured";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import type { Database } from "@/lib/supabase/types";

type AiLogInsert = Database["public"]["Tables"]["ai_logs"]["Insert"];

/**
 * Registra o consumo de uma chamada de IA na tabela `ai_logs`.
 *
 * Best-effort: se o Supabase não estiver configurado ou a escrita falhar,
 * apenas loga no console — nunca quebra o fluxo de atendimento.
 */

// Tabela de preços (USD por milhão de tokens) do claude-sonnet-4-6.
const PRECO_INPUT_POR_MILHAO = 3.0;
const PRECO_OUTPUT_POR_MILHAO = 15.0;

export function estimarCustoUSD(inputTokens: number, outputTokens: number): number {
  const custo =
    (inputTokens / 1_000_000) * PRECO_INPUT_POR_MILHAO +
    (outputTokens / 1_000_000) * PRECO_OUTPUT_POR_MILHAO;
  // Arredonda para 6 casas (frações de centavo de dólar).
  return Math.round(custo * 1_000_000) / 1_000_000;
}

export type ModuloIA = "mensagens" | "instagram" | "monitor" | "scanner";

export async function registrarAiLog(params: {
  endpoint: string;
  module: ModuloIA;
  inputTokens: number;
  outputTokens: number;
}): Promise<void> {
  const { endpoint, module, inputTokens, outputTokens } = params;
  if (!SUPABASE_WRITE_CONFIGURED) return;
  try {
    const sb = createSupabaseServiceClient();
    const linha: AiLogInsert = {
      endpoint,
      module,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost_usd: estimarCustoUSD(inputTokens, outputTokens),
    };
    // `insert` espera o tipo Insert da tabela; o cast evita o conflito de
    // overload do supabase-js com os tipos manuais (Partial<Row> & {...}).
    await sb.from("ai_logs").insert(linha as never);
  } catch (e) {
    console.error("[ai/log] falha ao registrar ai_log:", (e as Error).message);
  }
}
