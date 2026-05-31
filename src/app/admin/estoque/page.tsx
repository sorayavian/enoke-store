import Link from "next/link";
import { AlertTriangle, Plus } from "lucide-react";
import { Card, CardTitle, Badge, StatCard } from "@/components/admin/ui";
import { ProdutoAcoes } from "@/components/admin/ProdutoAcoes";
import { getAllProducts } from "@/lib/data/products";
import { ESTOQUE_MINIMO_PADRAO } from "@/lib/admin/mock";
import { formatBRL } from "@/lib/utils";

export const metadata = { title: "Estoque" };

export default async function EstoquePage() {
  const todos = await getAllProducts();
  const produtos = [...todos].sort((a, b) => a.stock - b.stock);
  const baixos = produtos.filter((p) => p.stock <= ESTOQUE_MINIMO_PADRAO);
  const valorTotal = produtos.reduce(
    (s, p) => s + p.price_cents * p.stock,
    0
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-display-lg text-ink-deep">Estoque</h1>
          <p className="mt-1 text-sm text-stone-300">
            Controle de estoque com alerta automático abaixo do mínimo
          </p>
        </div>
        <Link
          href="/admin/estoque/novo"
          className="flex items-center gap-2 self-start rounded-md bg-amber px-4 py-2 text-sm font-medium text-bone transition-opacity hover:opacity-90"
        >
          <Plus size={16} /> Novo produto
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Produtos cadastrados" value={String(produtos.length)} />
        <StatCard
          label="Em alerta"
          value={String(baixos.length)}
          hint={`mínimo: ${ESTOQUE_MINIMO_PADRAO} un.`}
          icon={<AlertTriangle size={18} strokeWidth={1.5} />}
          accent={baixos.length > 0}
        />
        <StatCard label="Valor em estoque" value={formatBRL(valorTotal)} />
      </div>

      <Card className="mt-6">
        <CardTitle>Produtos</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mist text-left text-xs uppercase tracking-wider text-stone-300">
                <th className="pb-2 pr-4 font-medium">Código</th>
                <th className="pb-2 pr-4 font-medium">Produto</th>
                <th className="pb-2 pr-4 font-medium">Marca</th>
                <th className="pb-2 pr-4 font-medium text-right">Preço</th>
                <th className="pb-2 pr-4 font-medium text-right">Estoque</th>
                <th className="pb-2 pr-4 font-medium">Situação</th>
                <th className="pb-2 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist/60">
              {produtos.map((p) => {
                const baixo = p.stock <= ESTOQUE_MINIMO_PADRAO;
                return (
                  <tr key={p.id} className="text-stone-500">
                    <td className="py-2.5 pr-4">
                      <code className="text-xs text-ink">{p.code}</code>
                    </td>
                    <td className="py-2.5 pr-4 text-ink">{p.name}</td>
                    <td className="py-2.5 pr-4">{p.brand}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">
                      {formatBRL(p.price_cents)}
                    </td>
                    <td className="py-2.5 pr-4 text-right tabular-nums text-ink">
                      {p.stock}
                    </td>
                    <td className="py-2.5 pr-4">
                      {baixo ? (
                        <Badge className="bg-danger/25 text-ink">Baixo</Badge>
                      ) : (
                        <Badge className="bg-success/25 text-success">OK</Badge>
                      )}
                    </td>
                    <td className="py-2.5 text-right">
                      <ProdutoAcoes id={p.id} nome={p.name} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
