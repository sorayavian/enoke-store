"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  COOKIE_MAX_AGE,
  criarTokenSessao,
  opcoesCookie,
  senhaCorreta,
} from "@/lib/admin/auth";

export type AdminLoginState = { error: string | null };

// Valida a senha do painel e, se correta, grava o cookie de sessão assinado.
export async function adminLoginAction(
  _prev: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const senha = String(formData.get("password") ?? "");
  const destino = String(formData.get("next") ?? "/admin/dashboard");

  if (!senha) return { error: "Informe a senha." };

  if (!senhaCorreta(senha)) {
    // Mensagem genérica para não revelar detalhes.
    return { error: "Senha incorreta." };
  }

  const token = await criarTokenSessao();
  cookies().set(ADMIN_COOKIE, token, opcoesCookie(COOKIE_MAX_AGE));

  const seguro =
    destino.startsWith("/admin") && !destino.startsWith("//")
      ? destino
      : "/admin/dashboard";
  redirect(seguro);
}

// Encerra a sessão do admin.
export async function adminLogoutAction() {
  cookies().delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
