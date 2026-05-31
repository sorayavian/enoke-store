"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { excluirProduto } from "@/app/admin/estoque/actions";

// Menu de três pontinhos com Editar e Excluir, por linha de produto.
// O menu usa posição fixa (calculada a partir do botão) para não ser cortado
// pela rolagem horizontal da tabela.
export function ProdutoAcoes({ id, nome }: { id: string; nome: string }) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [pending, startTransition] = useTransition();
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora, rolar ou redimensionar.
  useEffect(() => {
    if (!aberto) return;
    function fechar() {
      setAberto(false);
    }
    function aoClicar(e: MouseEvent) {
      const alvo = e.target as Node;
      // Não fecha se o clique foi no botão OU dentro do próprio menu.
      if (btnRef.current?.contains(alvo) || menuRef.current?.contains(alvo)) {
        return;
      }
      setAberto(false);
    }
    document.addEventListener("mousedown", aoClicar);
    window.addEventListener("scroll", fechar, true);
    window.addEventListener("resize", fechar);
    return () => {
      document.removeEventListener("mousedown", aoClicar);
      window.removeEventListener("scroll", fechar, true);
      window.removeEventListener("resize", fechar);
    };
  }, [aberto]);

  function alternar() {
    if (!aberto && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      // posiciona logo abaixo do botão, alinhado à direita da tela
      setPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
    }
    setAberto((v) => !v);
  }

  function editar() {
    setAberto(false);
    router.push(`/admin/estoque/${id}/editar`);
  }

  function excluir() {
    setAberto(false);
    const ok = window.confirm(
      `Você tem certeza que deseja excluir esse produto?\n\n"${nome}" deixará de aparecer na loja.`
    );
    if (!ok) return;
    startTransition(async () => {
      const r = await excluirProduto(id);
      if (r.ok) router.refresh();
      else window.alert(r.erro ?? "Erro ao excluir.");
    });
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={alternar}
        disabled={pending}
        aria-label="Ações"
        className="rounded-md p-1.5 text-stone-300 transition-colors hover:bg-mist hover:text-ink disabled:opacity-50"
      >
        <MoreVertical size={18} />
      </button>

      {aberto && pos && (
        <div
          ref={menuRef}
          className="fixed z-50 w-40 overflow-hidden rounded-md border border-mist bg-paper shadow-modal"
          style={{ top: pos.top, right: pos.right }}
        >
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
    </>
  );
}
