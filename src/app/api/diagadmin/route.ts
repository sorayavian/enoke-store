import { NextResponse } from "next/server";

// DIAGNÓSTICO TEMPORÁRIO — remover depois.
// Compara a senha enviada com ADMIN_PASSWORD sem revelar valores.
// Uso: POST { senha: "..." }  → diz se bate e os tamanhos.
export async function POST(req: Request) {
  const { senha } = (await req.json().catch(() => ({}))) as { senha?: string };
  const esperada = process.env.ADMIN_PASSWORD ?? "";
  const enviada = senha ?? "";
  return NextResponse.json({
    admin_password_definida: Boolean(process.env.ADMIN_PASSWORD),
    tamanho_esperada: esperada.length,
    tamanho_enviada: enviada.length,
    bate_exato: enviada === esperada,
    bate_trim: enviada.trim() === esperada.trim(),
    secret_definido: Boolean(process.env.ADMIN_SESSION_SECRET),
    protecao: (process.env.ADMIN_PROTECTION_ENABLED ?? "").trim(),
  });
}
