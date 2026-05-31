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
      <p className="text-caption font-medium uppercase tracking-[0.12em] text-success">Pedido recebido</p>
      <h1 className="mt-6 font-display text-display-xl font-semibold text-fg">
        Obrigado!
      </h1>
      <p className="mt-6 max-w-md text-fg-muted">
        {isStub
          ? "Esta é uma confirmação simulada — Mercado Pago entra na Fase 9."
          : "Você receberá um email com os detalhes do pagamento e do envio em instantes."}
      </p>
      {searchParams.order_id && (
        <p className="mt-4 text-xs uppercase tracking-[0.12em] text-fg-muted">
          Pedido: {searchParams.order_id}
        </p>
      )}
      <Link
        href="/catalogo"
        className="mt-12 inline-flex items-center rounded-sm bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.04em] text-brand-ink hover:bg-brand-deep"
      >
        Continuar comprando
      </Link>
    </section>
  );
}
