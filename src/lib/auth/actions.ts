"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Monta a URL de callback de confirmação a partir da origem do request,
// funcionando tanto em localhost quanto em produção.
function urlCallback(next: string): string {
  const h = headers();
  const origin =
    h.get("origin") ??
    (h.get("host") ? `https://${h.get("host")}` : "");
  const params = new URLSearchParams({ next });
  return `${origin}/auth/callback?${params.toString()}`;
}

// Server Actions de autenticação do cliente (área da loja).
// Usam o Supabase Auth (e-mail + senha). No cadastro, além de criar o usuário
// no Auth, garantimos um registro correspondente na tabela `customers` com
// role 'customer'. O painel admin continua com seu próprio fluxo, separado.

export type AuthState = {
  error: string | null;
  // Quando o cadastro exige confirmação de e-mail, não há sessão imediata:
  // sinalizamos sucesso para a UI mostrar a mensagem "confirme seu e-mail".
  awaitingConfirmation?: boolean;
};

// Garante que o destino pós-login seja uma rota interna segura.
function destinoSeguro(next: unknown): string {
  const v = typeof next === "string" ? next : "";
  // Só caminhos internos (começando com "/" e sem "//" de host externo).
  return v.startsWith("/") && !v.startsWith("//") ? v : "/cliente";
}

// Traduz as mensagens mais comuns do Supabase para pt-BR.
function traduzErro(mensagem: string): string {
  const m = mensagem.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }
  if (m.includes("user already registered") || m.includes("already been registered")) {
    return "Já existe uma conta com este e-mail. Tente entrar.";
  }
  if (m.includes("password should be at least")) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }
  if (m.includes("unable to validate email") || m.includes("invalid email")) {
    return "E-mail inválido.";
  }
  if (m.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar.";
  }
  if (m.includes("rate limit") || m.includes("over_email_send")) {
    return "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.";
  }
  return "Não foi possível concluir. Tente novamente em instantes.";
}

export async function signupAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const fullName = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (fullName.length < 2) return { error: "Informe seu nome completo." };
  if (!email) return { error: "Informe seu e-mail." };
  if (password.length < 6)
    return { error: "A senha deve ter pelo menos 6 caracteres." };

  const next = destinoSeguro(formData.get("next"));
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: urlCallback(next),
    },
  });

  if (error) return { error: traduzErro(error.message) };

  // Garante o perfil em `customers` (upsert por id do usuário Auth).
  if (data.user) {
    // `as never` segue o padrão do admin (estoque/actions.ts) para contornar a
    // inferência estrita do @supabase/supabase-js com os tipos manuais.
    await supabase.from("customers").upsert(
      {
        id: data.user.id,
        email,
        full_name: fullName,
        role: "customer",
      } as never,
      { onConflict: "id" }
    );
  }

  // Se a confirmação de e-mail estiver LIGADA, o signUp não cria sessão.
  // Detectamos pela ausência de sessão e pedimos a confirmação ao usuário.
  if (!data.session) {
    return { error: null, awaitingConfirmation: true };
  }

  // Confirmação desligada: já há sessão, entra direto.
  revalidatePath("/", "layout");
  redirect(next);
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password)
    return { error: "Informe e-mail e senha." };

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: traduzErro(error.message) };

  revalidatePath("/", "layout");
  redirect(destinoSeguro(formData.get("next")));
}

export async function logoutAction() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
