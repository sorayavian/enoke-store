"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessagesSquare,
  BarChart3,
  Activity,
  Camera,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

type NavItem = { href: string; label: string; icon: React.ReactNode };

const ICON = { size: 18, strokeWidth: 1.5 } as const;

const GRUPOS: { titulo: string; itens: NavItem[] }[] = [
  {
    titulo: "Visão geral",
    itens: [
      { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard {...ICON} /> },
      { href: "/admin/mensagens", label: "Mensagens", icon: <MessagesSquare {...ICON} /> },
      { href: "/admin/relatorios", label: "Relatórios", icon: <BarChart3 {...ICON} /> },
      { href: "/admin/monitor", label: "Monitor", icon: <Activity {...ICON} /> },
    ],
  },
  {
    titulo: "Conteúdo",
    itens: [
      { href: "/admin/instagram", label: "Instagram", icon: <Camera {...ICON} /> },
    ],
  },
  {
    titulo: "Loja",
    itens: [
      { href: "/admin/estoque", label: "Estoque", icon: <Package {...ICON} /> },
      { href: "/admin/pedidos", label: "Pedidos", icon: <ShoppingCart {...ICON} /> },
      { href: "/admin/clientes", label: "Clientes", icon: <Users {...ICON} /> },
      { href: "/admin/configuracoes", label: "Configurações", icon: <Settings {...ICON} /> },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-mist bg-paper lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-mist px-6">
        <span className="font-display text-xl tracking-tight text-ink">
          {SITE.name}
        </span>
        <span className="rounded-sm bg-amber/20 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-soft">
          Admin
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {GRUPOS.map((grupo) => (
          <div key={grupo.titulo} className="mb-6">
            <p className="px-3 pb-2 text-caption font-medium uppercase text-stone-300">
              {grupo.titulo}
            </p>
            <ul className="space-y-0.5">
              {grupo.itens.map((item) => {
                const ativo =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-feedback",
                        ativo
                          ? "bg-mist text-ink-deep"
                          : "text-stone-500 hover:bg-mist/60 hover:text-ink"
                      )}
                    >
                      <span className={ativo ? "text-amber-soft" : ""}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-mist p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-stone-300 transition-colors hover:text-ink"
        >
          <ExternalLink size={14} strokeWidth={1.5} />
          Ver loja
        </Link>
      </div>
    </aside>
  );
}
