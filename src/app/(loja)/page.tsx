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
      <section className="relative overflow-hidden border-b border-mist">
        <div className="container-page grid items-center gap-12 py-20 md:grid-cols-12 md:py-32">
          <div className="md:col-span-7">
            <p className="eyebrow">Coleção Permanente · 2026</p>
            <h1 className="mt-6 font-display text-display-xl font-light leading-[1.02] tracking-tight text-ink md:text-[5.5rem]">
              Olhar
              <br />
              <span className="italic text-stone-500">considerado</span>.
            </h1>
            <p className="mt-8 max-w-md text-pretty text-stone-500">
              {SITE.tagline} Armações autorais, acetatos italianos e titânio
              escovado — para quem escolhe poucas peças e as escolhe bem.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium uppercase tracking-[0.04em] text-bone transition-colors duration-feedback hover:bg-ink-deep"
              >
                Ver catálogo
              </Link>
              <Link
                href="/catalogo?estilo=sol"
                className="inline-flex items-center gap-2 border border-ink px-6 py-3 text-sm font-medium uppercase tracking-[0.04em] text-ink transition-colors duration-feedback hover:bg-ink hover:text-bone"
              >
                Solares
              </Link>
            </div>
          </div>
          <div className="relative md:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-mist">
              <Image
                src="/placeholders/lume-titanio-bronze-1.svg"
                alt="Armação em destaque"
                fill
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-4 text-caption uppercase text-stone-500">
              Lume · Titânio escovado
            </p>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="container-page py-24 md:py-32">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Em destaque</p>
            <h2 className="mt-3 font-display text-display-lg font-light text-ink">
              Curadoria do mês
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="hidden text-sm text-stone-500 underline decoration-stone-100 underline-offset-4 transition-colors duration-feedback hover:text-ink md:block"
          >
            Ver todos →
          </Link>
        </div>
        <div className="mt-12">
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* Categorias */}
      <section className="container-page pb-32">
        <p className="eyebrow">Por estilo</p>
        <h2 className="mt-3 font-display text-display-lg font-light text-ink">
          Para cada momento.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/catalogo?categoria=${c.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden bg-mist"
            >
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <p className="font-display text-display-md text-ink transition-transform duration-content ease-refined group-hover:-translate-y-1">
                  {c.name}
                </p>
                {c.description && (
                  <p className="mt-2 max-w-xs text-sm text-stone-500">
                    {c.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Manifesto */}
      <section className="border-t border-mist bg-paper py-24 md:py-32">
        <div className="container-page grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Manifesto</p>
          </div>
          <div className="md:col-span-8">
            <p className="font-display text-display-md font-light leading-snug text-ink md:text-display-lg">
              Menos é o caminho. Cada armação ENOKE é desenhada para durar mais
              do que a próxima estação — em material, em forma, em intenção.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
