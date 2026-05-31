import Link from "next/link";

export default function NotFound() {
  // Renderizado fora do layout da loja (herda o body global escuro), por isso
  // recebe um wrapper próprio claro para manter a identidade da loja.
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface text-fg">
      <section className="container-page flex flex-col items-center justify-center py-24 text-center">
        <p className="text-caption font-medium uppercase tracking-[0.12em] text-brand-deep">Erro 404</p>
        <h1 className="mt-6 font-display text-display-xl font-light text-fg md:text-display-2xl">
          Página não <span className="italic text-brand-deep">encontrada</span>.
        </h1>
        <p className="mt-6 max-w-md text-fg-muted">
          O endereço que você acessou não existe ou foi movido. Que tal voltar
          para a coleção?
        </p>
        <Link
          href="/"
          className="mt-12 inline-flex items-center rounded-sm bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.04em] text-brand-ink hover:bg-brand-deep"
        >
          Voltar ao início
        </Link>
      </section>
    </div>
  );
}
