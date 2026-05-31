import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pedidos" };

export default function PedidosPage() {
  return (
    <div>
      <p className="eyebrow">Pedidos</p>
      <h2 className="mt-3 font-display text-display-md text-ink">
        Histórico de compras.
      </h2>
      <div className="mt-10 border border-mist bg-paper py-16 text-center">
        <p className="text-sm text-stone-500">
          Você ainda não fez nenhum pedido.
        </p>
      </div>
    </div>
  );
}
