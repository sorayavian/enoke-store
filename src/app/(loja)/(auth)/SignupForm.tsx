"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signupAction, type AuthState } from "@/lib/auth/actions";

const inicial: AuthState = { error: null };

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full rounded-sm bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.04em] text-brand-ink transition-colors duration-feedback hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-fg-subtle"
    >
      {pending ? "Criando conta..." : "Criar conta"}
    </button>
  );
}

export function SignupForm({ next }: { next?: string }) {
  const [state, formAction] = useFormState(signupAction, inicial);

  // Cadastro concluído, aguardando o cliente confirmar o e-mail.
  if (state.awaitingConfirmation) {
    return (
      <div className="mt-10 rounded-sm border border-brand/40 bg-brand-soft/20 p-6 text-center">
        <p className="font-display text-xl font-semibold text-fg">
          Confira seu e-mail
        </p>
        <p className="mt-3 text-sm text-fg-muted">
          Enviamos um link de confirmação para o seu e-mail. Clique nele para
          ativar sua conta e entrar.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-10 space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      <label className="block">
        <span className="text-caption font-medium uppercase tracking-[0.12em] text-fg-subtle">
          Nome completo
        </span>
        <input
          type="text"
          name="name"
          required
          minLength={2}
          autoComplete="name"
          className="mt-2 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-fg focus:border-brand focus:outline-none"
        />
      </label>
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
          minLength={6}
          autoComplete="new-password"
          className="mt-2 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-fg focus:border-brand focus:outline-none"
        />
        <span className="mt-1 block text-xs text-fg-subtle">
          Mínimo de 6 caracteres.
        </span>
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
