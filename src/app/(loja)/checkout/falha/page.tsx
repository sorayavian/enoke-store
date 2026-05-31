import Link from "next/link";

export default function FalhaPage() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow text-danger">Pagamento não concluído</p>
      <h1 className="mt-6 font-display text-display-lg font-light text-ink">
        Algo não deu certo.
      </h1>
      <p className="mt-6 max-w-md text-stone-500">
        Seu cartão pode ter sido recusado ou a transação foi cancelada. Você
        pode tentar novamente ou escolher outro meio de pagamento.
      </p>
      <Link
        href="/carrinho"
        className="mt-12 inline-flex items-center rounded-sm bg-ink px-6 py-3 text-sm font-medium uppercase tracking-[0.04em] text-bone hover:bg-ink-deep"
      >
        Voltar ao carrinho
      </Link>
    </section>
  );
}
