"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { excluirProduto } from "@/app/admin/estoque/actions";

// Menu de três pontinhos com Editar e Excluir, por linha de produto.
export function ProdutoAcoes({ id, nome }: { id: string; nome: string }) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora.
  useEffect(() => {
    function fora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    }
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, []);

  function editar() {
    setAberto(false);
    router.push(`/admin/estoque/${id}/editar`);
  }

  function excluir() {
    setAberto(false);
    const ok = window.confirm(
      `Excluir o produto "${nome}"? Ele deixará de aparecer na loja.`
    );
    if (!ok) return;
    startTransition(async () => {
      const r = await excluirProduto(id);
      if (r.ok) router.refresh();
      else window.alert(r.erro ?? "Erro ao excluir.");
    });
  }

  return (
    <div className="relative flex justify-end" ref={ref}>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        disabled={pending}
        aria-label="Ações"
        className="rounded-md p-1.5 text-stone-300 transition-colors hover:bg-mist hover:text-ink disabled:opacity-50"
      >
        <MoreVertical size={18} />
      </button>

      {aberto && (
        <div className="absolute right-0 top-9 z-10 w-40 overflow-hidden rounded-md border border-mist bg-paper shadow-modal">
          <button
            type="button"
            onClick={editar}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink hover:bg-mist"
          >
            <Pencil size={15} /> Editar
          </button>
          <button
            type="button"
            onClick={excluir}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-mist"
          >
            <Trash2 size={15} /> Excluir
          </button>
        </div>
      )}
    </div>
  );
}
