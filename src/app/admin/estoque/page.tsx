import { AlertTriangle } from "lucide-react";
import { Card, CardTitle, Badge, StatCard } from "@/components/admin/ui";
import { MOCK_PRODUCTS } from "@/lib/mock/products";
import { ESTOQUE_MINIMO_PADRAO } from "@/lib/admin/mock";
import { formatBRL } from "@/lib/utils";

export const metadata = { title: "Estoque" };

export default function EstoquePage() {
  const produtos = [...MOCK_PRODUCTS].sort((a, b) => a.stock - b.stock);
  const baixos = produtos.filter((p) => p.stock <= ESTOQUE_MINIMO_PADRAO);
  const valorTotal = produtos.reduce(
    (s, p) => s + p.price_cents * p.stock,
    0
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-ink-deep">Estoque</h1>
        <p className="mt-1 text-sm text-stone-300">
          Controle de estoque com alerta automático abaixo do mínimo
        </p>
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
                <th className="pb-2 font-medium">Situação</th>
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
                    <td className="py-2.5">
                      {baixo ? (
                        <Badge className="bg-danger/25 text-ink">Baixo</Badge>
                      ) : (
                        <Badge className="bg-success/25 text-success">OK</Badge>
                      )}
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
