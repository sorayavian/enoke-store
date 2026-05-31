import Link from "next/link";

export default function PendentePage() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow text-warning">Pagamento pendente</p>
      <h1 className="mt-6 font-display text-display-lg font-light text-ink">
        Estamos aguardando a confirmação.
      </h1>
      <p className="mt-6 max-w-md text-stone-500">
        Você receberá um email assim que o pagamento for confirmado.
      </p>
      <Link
        href="/cliente/pedidos"
        className="mt-12 text-sm text-ink underline underline-offset-4"
      >
        Ver meus pedidos
      </Link>
    </section>
  );
}
