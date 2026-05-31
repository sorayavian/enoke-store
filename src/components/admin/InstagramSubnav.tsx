import Link from "next/link";
import { Plus, CalendarDays, Camera, BarChart3 } from "lucide-react";

const SUBNAV = [
  { href: "/admin/instagram", label: "Visão geral", icon: CalendarDays },
  { href: "/admin/instagram/novo-post", label: "Novo post", icon: Plus },
  { href: "/admin/instagram/scanner", label: "Scanner", icon: Camera },
  { href: "/admin/instagram/relatorios", label: "Relatórios", icon: BarChart3 },
];

// Sub-navegação entre as páginas do módulo Instagram.
export function InstagramSubnav({ atual }: { atual: string }) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2">
      {SUBNAV.map((s) => {
        const Icon = s.icon;
        const ativo = s.href === atual;
        return (
          <Link
            key={s.href}
            href={s.href}
            className={`flex items-center gap-2 rounded-md px-3.5 py-2 text-sm transition-colors ${
              ativo
                ? "bg-amber text-bone"
                : "border border-mist bg-paper text-stone-500 hover:text-ink"
            }`}
          >
            <Icon size={15} strokeWidth={1.5} />
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
