import Link from "next/link";

export default function PendentePage() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-caption font-medium uppercase tracking-[0.12em] text-brand-deep">Pagamento pendente</p>
      <h1 className="mt-6 font-display text-display-lg font-semibold text-fg">
        Estamos aguardando a confirmação.
      </h1>
      <p className="mt-6 max-w-md text-fg-muted">
        Você receberá um email assim que o pagamento for confirmado.
      </p>
      <Link
        href="/cliente/pedidos"
        className="mt-12 text-sm text-fg underline decoration-brand underline-offset-4 hover:text-brand-deep"
      >
        Ver meus pedidos
      </Link>
    </section>
  );
}
