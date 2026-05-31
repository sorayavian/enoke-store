"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PERIODOS, type PeriodoId } from "@/lib/admin/dashboard-data";

// Botões de período do dashboard; troca o ?periodo= na URL.
export function SeletorPeriodo({ atual }: { atual: PeriodoId }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-1 rounded-md border border-mist bg-paper p-1">
      {PERIODOS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => router.push(`${pathname}?periodo=${p.id}`)}
          className={cn(
            "rounded px-3 py-1.5 text-sm transition-colors",
            atual === p.id
              ? "bg-amber text-bone"
              : "text-stone-500 hover:text-ink"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
