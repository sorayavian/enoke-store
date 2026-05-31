import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getClienteAtual } from "@/lib/auth/session";
import { SignupForm } from "../SignupForm";

export const metadata: Metadata = { title: "Criar conta" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  // Se já estiver logado, não faz sentido cadastrar de novo.
  const cliente = await getClienteAtual();
  if (cliente) redirect("/cliente");

  const next =
    searchParams.next?.startsWith("/") && !searchParams.next.startsWith("//")
      ? searchParams.next
      : undefined;

  return (
    <section className="container-page flex min-h-[60vh] items-center justify-center py-24">
      <div className="w-full max-w-sm">
        <p className="text-center text-caption font-medium uppercase tracking-[0.12em] text-brand-deep">
          Criar conta
        </p>
        <h1 className="mt-3 text-center font-display text-display-lg font-semibold text-fg">
          Faça parte.
        </h1>

        <SignupForm next={next} />

        <p className="mt-8 text-center text-sm text-fg-muted">
          Já tem conta?{" "}
          <Link
            href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
            className="text-brand-deep underline underline-offset-4"
          >
            Entrar
          </Link>
        </p>
      </div>
    </section>
  );
}
