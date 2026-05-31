import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pedido recebido" };

export default function SucessoPage({
  searchParams,
}: {
  searchParams: { order_id?: string; stub?: string };
}) {
  const isStub = searchParams.stub === "1";
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow text-success">Pedido recebido</p>
      <h1 className="mt-6 font-display text-display-xl font-light text-ink">
        Obrigada.
      </h1>
      <p className="mt-6 max-w-md text-stone-500">
        {isStub
          ? "Esta é uma confirmação simulada — Mercado Pago entra na Fase 9."
          : "Você receberá um email com os detalhes do pagamento e do envio em instantes."}
      </p>
      {searchParams.order_id && (
        <p className="mt-4 text-xs uppercase tracking-[0.12em] text-stone-500">
          Pedido: {searchParams.order_id}
        </p>
      )}
      <Link
        href="/catalogo"
        className="mt-12 inline-flex items-center rounded-sm bg-ink px-6 py-3 text-sm font-medium uppercase tracking-[0.04em] text-bone hover:bg-ink-deep"
      >
        Continuar comprando
      </Link>
    </section>
  );
}
