import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Criar conta" };

export default function SignupPage() {
  return (
    <section className="container-page flex min-h-[60vh] items-center justify-center py-24">
      <div className="w-full max-w-sm">
        <p className="eyebrow text-center">Criar conta</p>
        <h1 className="mt-3 text-center font-display text-display-lg font-light text-ink">
          Faça parte.
        </h1>

        <form className="mt-10 space-y-4">
          <label className="block">
            <span className="eyebrow">Nome completo</span>
            <input
              type="text"
              name="name"
              required
              className="mt-2 w-full border border-mist bg-paper px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="eyebrow">Email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="mt-2 w-full border border-mist bg-paper px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="eyebrow">Senha</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="new-password"
              className="mt-2 w-full border border-mist bg-paper px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled
            className="mt-6 w-full rounded-sm bg-ink px-6 py-3 text-sm font-medium uppercase tracking-[0.04em] text-bone disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            Criar conta
          </button>
          <p className="text-center text-xs text-stone-500">
            Autenticação real será ativada na Fase 9 (conexão Supabase).
          </p>
        </form>

        <p className="mt-8 text-center text-sm text-stone-500">
          Já tem conta?{" "}
          <Link href="/login" className="text-ink underline underline-offset-4">
            Entrar
          </Link>
        </p>
      </div>
    </section>
  );
}
