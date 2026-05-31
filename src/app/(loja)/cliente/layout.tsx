import Link from "next/link";
import type { ReactNode } from "react";
import { getClienteAtual } from "@/lib/auth/session";
import { LogoutButton } from "./LogoutButton";

const TABS = [
  { href: "/cliente", label: "Visão geral" },
  { href: "/cliente/pedidos", label: "Pedidos" },
  { href: "/cliente/receitas", label: "Receitas" },
];

export default async function ClienteLayout({
  children,
}: {
  children: ReactNode;
}) {
  // O middleware já garante que só clientes logados chegam aqui.
  const cliente = await getClienteAtual();
  const primeiroNome = cliente?.fullName?.split(" ")[0];

  return (
    <section className="container-page py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-caption font-medium uppercase tracking-[0.12em] text-brand-deep">
            Área do cliente
          </p>
          <h1 className="mt-4 font-display text-display-xl font-semibold text-fg">
            {primeiroNome ? `Olá, ${primeiroNome}.` : "Sua conta."}
          </h1>
          {cliente?.email && (
            <p className="mt-2 text-sm text-fg-muted">{cliente.email}</p>
          )}
        </div>
        <LogoutButton />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[220px_1fr]">
        <nav>
          <ul className="space-y-1">
            {TABS.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="block border-l-2 border-transparent px-4 py-2 text-sm text-fg-muted transition-colors duration-feedback hover:border-brand hover:text-fg"
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>{children}</div>
      </div>
    </section>
  );
}
