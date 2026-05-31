"use client";

import { Bell, Search } from "lucide-react";
import { KPIS } from "@/lib/admin/mock";

// Barra superior do admin: busca rápida (decorativa) + alertas + perfil do dono.
export function Topbar() {
  const pendencias = KPIS.mensagens_pendentes + KPIS.alertas_estoque + KPIS.erros_site;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-mist bg-bone/80 px-5 backdrop-blur-sm md:px-8">
      <div className="relative hidden flex-1 sm:block">
        <Search
          size={16}
          strokeWidth={1.5}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-300"
        />
        <input
          type="search"
          placeholder="Buscar pedidos, clientes, produtos…"
          className="w-full max-w-md rounded-md border border-mist bg-paper py-2 pl-9 pr-3 text-sm text-ink placeholder:text-stone-300 focus:border-amber/50 focus:outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          aria-label="Notificações"
          className="relative rounded-md p-2 text-ink transition-colors hover:bg-mist"
        >
          <Bell size={18} strokeWidth={1.5} />
          {pendencias > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber px-1 text-[10px] font-semibold text-bone">
              {pendencias}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 border-l border-mist pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber/20 text-sm font-medium text-amber-soft">
            D
          </div>
          <div className="hidden text-sm leading-tight sm:block">
            <p className="text-ink">Dono</p>
            <p className="text-xs text-stone-300">Acesso total</p>
          </div>
        </div>
      </div>
    </header>
  );
}
