import { Card, CardTitle, StatCard } from "@/components/admin/ui";
import { getClientes } from "@/lib/admin/data";
import { formatBRL } from "@/lib/utils";

export const metadata = { title: "Clientes" };

export default async function ClientesPage() {
  const CLIENTES = await getClientes();
  const ltvTotal = CLIENTES.reduce((s, c) => s + c.total_gasto_cents, 0);
  const totalPedidos = CLIENTES.reduce((s, c) => s + c.pedidos, 0);
  const ticketMedio = totalPedidos > 0 ? ltvTotal / totalPedidos : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-ink-deep">Clientes</h1>
        <p className="mt-1 text-sm text-stone-300">
          Histórico de compras e conversas
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Clientes cadastrados" value={String(CLIENTES.length)} />
        <StatCard label="Receita total" value={formatBRL(ltvTotal)} accent />
        <StatCard label="Ticket médio" value={formatBRL(ticketMedio)} />
      </div>

      <Card className="mt-6">
        <CardTitle>Lista de clientes</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mist text-left text-xs uppercase tracking-wider text-stone-300">
                <th className="pb-2 pr-4 font-medium">Nome</th>
                <th className="pb-2 pr-4 font-medium">Contato</th>
                <th className="pb-2 pr-4 font-medium text-right">Pedidos</th>
                <th className="pb-2 pr-4 font-medium text-right">Total gasto</th>
                <th className="pb-2 font-medium">Cliente desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist/60">
              {CLIENTES.map((c) => (
                <tr key={c.id} className="text-stone-500">
                  <td className="py-2.5 pr-4 text-ink">{c.full_name}</td>
                  <td className="py-2.5 pr-4">
                    <span className="block text-xs">{c.email}</span>
                    <span className="block text-xs text-stone-300">{c.phone}</span>
                  </td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{c.pedidos}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums text-ink">
                    {formatBRL(c.total_gasto_cents)}
                  </td>
                  <td className="py-2.5 text-xs">
                    {new Date(c.created_at).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
