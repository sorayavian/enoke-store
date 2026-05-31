import { Card, CardTitle, Badge, StatCard } from "@/components/admin/ui";
import { PEDIDOS } from "@/lib/admin/mock";
import { ORDER_STATUS_BADGE, ORDER_STATUS_LABEL, formatDataHora } from "@/lib/admin/labels";
import { formatBRL } from "@/lib/utils";

export const metadata = { title: "Pedidos" };

export default function PedidosPage() {
  const receita = PEDIDOS.filter((p) =>
    ["paid", "shipped", "delivered"].includes(p.status)
  ).reduce((s, p) => s + p.total_cents, 0);
  const pendentes = PEDIDOS.filter((p) => p.status === "pending").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-ink-deep">Pedidos</h1>
        <p className="mt-1 text-sm text-stone-300">
          Listagem e gestão de todos os pedidos
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total de pedidos" value={String(PEDIDOS.length)} />
        <StatCard label="Aguardando pagamento" value={String(pendentes)} accent={pendentes > 0} />
        <StatCard label="Receita confirmada" value={formatBRL(receita)} />
      </div>

      <Card className="mt-6">
        <CardTitle>Todos os pedidos</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mist text-left text-xs uppercase tracking-wider text-stone-300">
                <th className="pb-2 pr-4 font-medium">Pedido</th>
                <th className="pb-2 pr-4 font-medium">Cliente</th>
                <th className="pb-2 pr-4 font-medium text-right">Itens</th>
                <th className="pb-2 pr-4 font-medium text-right">Total</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 font-medium">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist/60">
              {PEDIDOS.map((p) => (
                <tr key={p.id} className="text-stone-500">
                  <td className="py-2.5 pr-4">
                    <code className="text-xs text-ink">{p.id}</code>
                  </td>
                  <td className="py-2.5 pr-4 text-ink">{p.cliente}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{p.itens}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums text-ink">
                    {formatBRL(p.total_cents)}
                  </td>
                  <td className="py-2.5 pr-4">
                    <Badge className={ORDER_STATUS_BADGE[p.status]}>
                      {ORDER_STATUS_LABEL[p.status]}
                    </Badge>
                  </td>
                  <td className="py-2.5 text-xs">{formatDataHora(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-stone-300">
          A atualização de status notificará o cliente por WhatsApp automaticamente
          (integração na fase de produção).
        </p>
      </Card>
    </div>
  );
}
