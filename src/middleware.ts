import { NextResponse, type NextRequest } from "next/server";

/**
 * Proteção das rotas /admin/*.
 *
 * Estado atual (desenvolvimento): a proteção fica DESLIGADA por padrão para
 * permitir construir e navegar o painel sem login. Para ativar, defina no
 * ambiente:
 *
 *   ADMIN_PROTECTION_ENABLED=true
 *
 * Quando ligada, sem uma sessão de admin válida o acesso a /admin é
 * redirecionado para /admin/login.
 *
 * INTEGRAÇÃO REAL (Supabase Auth + role):
 *   1. Adicionar coluna `role` em `customers` (ex.: 'admin' | 'customer').
 *   2. Criar o cliente Supabase de middleware com @supabase/ssr.
 *   3. Ler a sessão e verificar se o usuário tem role 'admin'.
 *   4. Negar (redirect para /admin/login) caso não seja admin.
 *
 * Esqueleto comentado abaixo para facilitar essa troca.
 */

const PROTECTION_ON = process.env.ADMIN_PROTECTION_ENABLED === "true";

export async function middleware(req: NextRequest) {
  // Em desenvolvimento (proteção desligada), libera tudo.
  if (!PROTECTION_ON) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  // A própria página de login não pode ser bloqueada.
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // ── Integração real (descomentar quando o Supabase Auth estiver pronto) ──
  //
  // import { createServerClient } from "@supabase/ssr";
  // const res = NextResponse.next();
  // const supabase = createServerClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   { cookies: { /* get/set a partir de req/res */ } }
  // );
  // const { data: { user } } = await supabase.auth.getUser();
  // const { data: perfil } = user
  //   ? await supabase.from("customers").select("role").eq("id", user.id).single()
  //   : { data: null };
  // const ehAdmin = perfil?.role === "admin";
  // if (!ehAdmin) {
  //   const url = req.nextUrl.clone();
  //   url.pathname = "/admin/login";
  //   return NextResponse.redirect(url);
  // }
  // return res;

  // Enquanto a integração não está plugada, com a proteção LIGADA tratamos
  // como não autenticado e mandamos para o login.
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}

export const config = {
  // Aplica apenas às rotas do painel.
  matcher: ["/admin/:path*"],
};
