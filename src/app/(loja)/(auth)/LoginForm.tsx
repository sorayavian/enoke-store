"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction, type AuthState } from "@/lib/auth/actions";

const inicial: AuthState = { error: null };

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full rounded-sm bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.04em] text-brand-ink transition-colors duration-feedback hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-fg-subtle"
    >
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useFormState(loginAction, inicial);

  return (
    <form action={formAction} className="mt-10 space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      <label className="block">
        <span className="text-caption font-medium uppercase tracking-[0.12em] text-fg-subtle">
          Email
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="mt-2 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-fg focus:border-brand focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="text-caption font-medium uppercase tracking-[0.12em] text-fg-subtle">
          Senha
        </span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-fg focus:border-brand focus:outline-none"
        />
      </label>

      {state.error && (
        <p className="rounded-sm border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      )}

      <Botao />
    </form>
  );
}
