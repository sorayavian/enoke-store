import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Callback do link de confirmação de e-mail (Supabase Auth).
// O Supabase redireciona para cá com ?code=...; trocamos o código por uma
// sessão (cookies) e mandamos o usuário ao destino (?next=, padrão /cliente).
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");
  const next =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/cliente";

  if (code) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Código ausente ou inválido: manda para o login com aviso.
  return NextResponse.redirect(`${origin}/login?erro=confirmacao`);
}
