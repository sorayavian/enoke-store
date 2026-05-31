import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NovoProdutoForm } from "./NovoProdutoForm";

export const metadata = { title: "Novo produto" };

export default function NovoProdutoPage() {
  return (
    <div>
      <Link
        href="/admin/estoque"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone-300 hover:text-ink"
      >
        <ArrowLeft size={15} /> Voltar ao estoque
      </Link>
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-ink-deep">Novo produto</h1>
        <p className="mt-1 text-sm text-stone-300">
          Cadastre um óculos no catálogo da loja
        </p>
      </div>
      <NovoProdutoForm />
    </div>
  );
}
