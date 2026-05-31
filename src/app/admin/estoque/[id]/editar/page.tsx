import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProdutoForm } from "@/components/admin/ProdutoForm";
import { getProductById } from "@/lib/data/products";

export const metadata = { title: "Editar produto" };

export default async function EditarProdutoPage({
  params,
}: {
  params: { id: string };
}) {
  const produto = await getProductById(params.id);
  if (!produto) notFound();

  return (
    <div>
      <Link
        href="/admin/estoque"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone-300 hover:text-ink"
      >
        <ArrowLeft size={15} /> Voltar ao estoque
      </Link>
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-ink-deep">
          Editar produto
        </h1>
        <p className="mt-1 text-sm text-stone-300">{produto.name} · {produto.code}</p>
      </div>
      <ProdutoForm produto={produto} />
    </div>
  );
}
