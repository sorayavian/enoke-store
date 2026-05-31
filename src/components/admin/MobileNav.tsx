"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Navegação horizontal rolável exibida apenas em telas pequenas,
// onde a Sidebar fica oculta.
const ITENS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/mensagens", label: "Mensagens" },
  { href: "/admin/relatorios", label: "Relatórios" },
  { href: "/admin/monitor", label: "Monitor" },
  { href: "/admin/instagram", label: "Instagram" },
  { href: "/admin/estoque", label: "Estoque" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/configuracoes", label: "Config." },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-mist bg-paper px-3 py-2 lg:hidden">
      {ITENS.map((item) => {
        const ativo = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors",
              ativo ? "bg-mist text-ink-deep" : "text-stone-500 hover:text-ink"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
