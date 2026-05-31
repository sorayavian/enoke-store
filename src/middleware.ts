import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Middleware da loja.
 *
 * 1) /cliente/*  → área autenticada do CLIENTE. Exige sessão do Supabase Auth;
 *    sem login, redireciona para /login (preservando o destino em ?next=).
 *    Também refresca a sessão (cookies) a cada request.
 *
 * 2) /admin/*    → painel administrativo. Proteção controlada por env
 *    (ADMIN_PROTECTION_ENABLED). Integração real de role 'admin' fica para a
 *    fase do painel; aqui mantemos o comportamento existente.
 */

const ADMIN_PROTECTION_ON = process.env.ADMIN_PROTECTION_ENABLED === "true";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ───────────────────────── Área do cliente ─────────────────────────
  if (pathname.startsWith("/cliente")) {
    // Resposta base que o Supabase usa para gravar/atualizar os cookies.
    let res = NextResponse.next({ request: req });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              req.cookies.set(name, value)
            );
            res = NextResponse.next({ request: req });
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    return res;
  }

  // ───────────────────────── Painel admin ─────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!ADMIN_PROTECTION_ON) return NextResponse.next();
    if (pathname.startsWith("/admin/login")) return NextResponse.next();

    // Integração real de role 'admin' permanece pendente (ver ADMIN.md).
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Aplica às rotas do cliente e do painel.
  matcher: ["/cliente/:path*", "/admin/:path*"],
};
