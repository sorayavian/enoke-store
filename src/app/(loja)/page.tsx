import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getCategories } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SITE } from "@/lib/site";

export const revalidate = 600;

export default async function Home() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-surface-alt">
        <div className="container-page grid items-center gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <p className="text-caption font-medium uppercase tracking-[0.12em] text-brand-deep">
              Nova coleção · 2026
            </p>
            <h1 className="mt-6 font-display text-display-xl font-semibold leading-[1.05] tracking-tight text-fg md:text-[5rem]">
              Visão
              <br />
              <span className="text-brand-deep">e Propósito</span>.
            </h1>
            <p className="mt-8 max-w-md text-pretty text-fg-muted">
              Um novo conceito em ótica on-line. Óculos de grau e de sol com
              curadoria, lentes sob medida e atendimento especializado — para
              enxergar o mundo com mais clareza.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 rounded-sm bg-brand px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.04em] text-brand-ink transition-colors duration-feedback hover:bg-brand-deep"
              >
                Ver catálogo
              </Link>
              <Link
                href="/catalogo?estilo=sol"
                className="inline-flex items-center gap-2 rounded-sm border border-fg px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.04em] text-fg transition-colors duration-feedback hover:bg-fg hover:text-surface"
              >
                Óculos de Sol
              </Link>
            </div>
          </div>
          <div className="relative md:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-surface">
              <Image
                src="/placeholders/lume-titanio-bronze-1.svg"
                alt="Armação em destaque"
                fill
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-4 text-caption uppercase tracking-[0.12em] text-fg-subtle">
              Lume · Titânio escovado
            </p>
          </div>
        </div>
      </section>

      {/* Selos de confiança */}
      <section className="border-b border-line bg-surface">
        <div className="container-page grid gap-6 py-8 text-center sm:grid-cols-3">
          {[
            { t: "Parcele em até 10x", d: "Em todos os cartões" },
            { t: "Site 100% seguro", d: "Compra protegida" },
            { t: "Garantia de fábrica", d: "Em todos os modelos" },
          ].map((item) => (
            <div key={item.t}>
              <p className="text-sm font-semibold text-fg">{item.t}</p>
              <p className="mt-0.5 text-xs text-fg-muted">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destaques */}
      <section className="container-page py-20 md:py-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-caption font-medium uppercase tracking-[0.12em] text-brand-deep">
              Em destaque
            </p>
            <h2 className="mt-3 font-display text-display-lg font-semibold text-fg">
              Mais vendidos
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="hidden text-sm text-fg-muted underline decoration-line underline-offset-4 transition-colors duration-feedback hover:text-brand-deep md:block"
          >
            Ver todos →
          </Link>
        </div>
        <div className="mt-12">
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* Categorias */}
      <section className="container-page pb-24">
        <p className="text-caption font-medium uppercase tracking-[0.12em] text-brand-deep">
          Por estilo
        </p>
        <h2 className="mt-3 font-display text-display-lg font-semibold text-fg">
          Para cada momento.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/catalogo?categoria=${c.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-sm border border-line bg-surface-alt"
            >
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <p className="font-display text-display-md font-semibold text-fg transition-transform duration-content ease-refined group-hover:-translate-y-1">
                  {c.name}
                </p>
                {c.description && (
                  <p className="mt-2 max-w-xs text-sm text-fg-muted">
                    {c.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Manifesto (bloco escuro com destaque dourado) */}
      <section className="border-t border-line-dark bg-surface-dark py-24 text-fg-onDark md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-caption font-medium uppercase tracking-[0.12em] text-brand">
              {SITE.name}
            </p>
          </div>
          <div className="md:col-span-8">
            <p className="font-display text-display-md font-light leading-snug md:text-display-lg">
              Acreditamos que enxergar bem é também viver com{" "}
              <span className="text-brand">propósito</span>. Cada armação Enoke é
              escolhida a dedo — em material, em forma e em intenção.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
