import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getClienteAtual } from "@/lib/auth/session";
import { LoginForm } from "../LoginForm";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; erro?: string };
}) {
  // Se já estiver logado, vai direto para a área do cliente.
  const cliente = await getClienteAtual();
  if (cliente) redirect("/cliente");

  const next =
    searchParams.next?.startsWith("/") && !searchParams.next.startsWith("//")
      ? searchParams.next
      : undefined;

  const avisoConfirmacao = searchParams.erro === "confirmacao";

  return (
    <section className="container-page flex min-h-[60vh] items-center justify-center py-24">
      <div className="w-full max-w-sm">
        <p className="text-center text-caption font-medium uppercase tracking-[0.12em] text-brand-deep">
          Entrar
        </p>
        <h1 className="mt-3 text-center font-display text-display-lg font-semibold text-fg">
          Bem-vindo de volta.
        </h1>

        {avisoConfirmacao && (
          <p className="mt-8 rounded-sm border border-danger/40 bg-danger/5 px-4 py-3 text-center text-sm text-danger">
            O link de confirmação é inválido ou expirou. Tente entrar ou
            cadastre-se novamente.
          </p>
        )}

        <LoginForm next={next} />

        <p className="mt-8 text-center text-sm text-fg-muted">
          Ainda não tem conta?{" "}
          <Link
            href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}
            className="text-brand-deep underline underline-offset-4"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </section>
  );
}
