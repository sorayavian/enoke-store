import Link from "next/link";
import type { ReactNode } from "react";

const TABS = [
  { href: "/cliente", label: "Visão geral" },
  { href: "/cliente/pedidos", label: "Pedidos" },
  { href: "/cliente/receitas", label: "Receitas" },
];

export default function ClienteLayout({ children }: { children: ReactNode }) {
  return (
    <section className="container-page py-16 md:py-24">
      <p className="eyebrow">Área do cliente</p>
      <h1 className="mt-4 font-display text-display-xl font-light text-ink">
        Sua conta.
      </h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-[220px_1fr]">
        <nav>
          <ul className="space-y-1">
            {TABS.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="block border-l-2 border-transparent px-4 py-2 text-sm text-stone-500 transition-colors duration-feedback hover:border-ink hover:text-ink"
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
