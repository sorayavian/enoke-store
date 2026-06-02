"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Atualiza os dados da página periodicamente (Server Components) sem recarregar
 * a página inteira nem perder o scroll/seleção. Usado no painel de mensagens
 * para novas conversas/mensagens aparecerem sozinhas.
 *
 * Pausa quando a aba está em segundo plano (economiza recursos).
 */
export function AutoRefresh({ segundos = 20 }: { segundos?: number }) {
  const router = useRouter();

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, segundos * 1000);
    return () => clearInterval(intervalo);
  }, [router, segundos]);

  return null;
}
