import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Erro 404</p>
      <h1 className="mt-6 font-display text-display-xl font-light text-ink">
        Página não encontrada.
      </h1>
      <p className="mt-6 max-w-md text-stone-500">
        O endereço que você acessou não existe ou foi movido. Que tal voltar
        para a coleção?
      </p>
      <Link
        href="/"
        className="mt-12 inline-flex items-center rounded-sm bg-ink px-6 py-3 text-sm font-medium uppercase tracking-[0.04em] text-bone hover:bg-ink-deep"
      >
        Voltar ao início
      </Link>
    </section>
  );
}
