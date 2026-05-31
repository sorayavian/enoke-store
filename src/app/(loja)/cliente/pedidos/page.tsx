import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pedidos" };

export default function PedidosPage() {
  return (
    <div>
      <p className="text-caption font-medium uppercase tracking-[0.12em] text-brand-deep">Pedidos</p>
      <h2 className="mt-3 font-display text-display-md font-semibold text-fg">
        Histórico de compras.
      </h2>
      <div className="mt-10 rounded-sm border border-line bg-surface-alt py-16 text-center">
        <p className="text-sm text-fg-muted">
          Você ainda não fez nenhum pedido.
        </p>
      </div>
    </div>
  );
}
