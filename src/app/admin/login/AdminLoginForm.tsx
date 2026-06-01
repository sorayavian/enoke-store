"use client";

import { useFormState, useFormStatus } from "react-dom";
import { adminLoginAction, type AdminLoginState } from "./actions";

const inicial: AdminLoginState = { error: null };

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="block w-full rounded-md bg-amber py-2.5 text-center text-sm font-medium text-bone transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}

export function AdminLoginForm({ next }: { next?: string }) {
  const [state, formAction] = useFormState(adminLoginAction, inicial);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-mist bg-paper p-6 shadow-soft"
    >
      {next && <input type="hidden" name="next" value={next} />}
      <label className="block">
        <span className="mb-1.5 block text-sm text-stone-500">Senha</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-md border border-mist bg-bone px-3 py-2 text-sm text-ink placeholder:text-stone-300 focus:border-amber/50 focus:outline-none focus:ring-2 focus:ring-amber/30"
        />
      </label>

      {state.error && (
        <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <Botao />
    </form>
  );
}
