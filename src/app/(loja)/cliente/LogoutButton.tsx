"use client";

import { useFormStatus } from "react-dom";
import { logoutAction } from "@/lib/auth/actions";

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm text-fg-muted underline decoration-line underline-offset-4 transition-colors hover:text-brand-text disabled:opacity-60"
    >
      {pending ? "Saindo..." : "Sair"}
    </button>
  );
}

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Botao />
    </form>
  );
}
