import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getCategories } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { HeroCarousel } from "@/components/product/HeroCarousel";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

export const revalidate = 600;

export default async function Home() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  return (
    <>
      {/* ───────────────────────── HERO cinematográfico ───────────────────────── */}
      <section className="grain relative overflow-hidden bg-surface-dark text-fg-onDark">
        {/* Brilho dourado de fundo */}
        <div
          aria-hidden
          className="glow pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-brand/20 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-brand/10 blur-[100px]"
        />

        <div className="container-page relative grid items-center gap-12 py-24 md:grid-cols-12 md:py-36">
          <div className="md:col-span-7">
            <p className="rise rise-1 flex items-center gap-3 text-caption font-medium uppercase tracking-[0.24em] text-brand">
              <span className="inline-block h-px w-10 bg-brand" />
              Nova coleção · 2026
            </p>

            <h1 className="mt-8 font-display text-[3.25rem] font-light leading-[0.95] tracking-tight md:text-display-2xl">
              <span className="rise rise-1 block">Visão</span>
              <span className="rise rise-2 block italic text-brand">
                &amp; Propósito.
              </span>
            </h1>

            <p className="rise rise-3 mt-8 max-w-md text-pretty text-fg-onDarkMuted">
              Um novo conceito em ótica on-line. Óculos de grau e de sol com
              curadoria, lentes sob medida e atendimento especializado — para
              enxergar o mundo com mais clareza.
            </p>

            <div className="rise rise-4 mt-12 flex flex-wrap items-center gap-4">
              <Link
                href="/catalogo"
                className="group inline-flex items-center gap-3 rounded-sm bg-brand px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-brand-ink transition-all duration-ui hover:gap-5 hover:bg-brand-soft"
              >
                Ver catálogo
                <span aria-hidden className="transition-transform">
                  →
                </span>
              </Link>
              <Link
                href="/catalogo?estilo=sol"
                className="inline-flex items-center gap-2 rounded-sm border border-white/25 px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-fg-onDark transition-colors duration-ui hover:border-brand hover:text-brand"
              >
                Óculos de Sol
              </Link>
            </div>
          </div>

          {/* Brasão do leão em destaque, com moldura e glow */}
          <div className="rise rise-3 relative md:col-span-5">
            <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
              <div
                aria-hidden
                className="glow absolute inset-0 rounded-full bg-brand/15 blur-3xl"
              />
              <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.02]">
                <div className="absolute inset-6 rounded-full border border-brand/20" />
                <Image
                  src="/enoke-leao.png"
                  alt="Enoke"
                  width={234}
                  height={264}
                  priority
                  className="relative w-1/2 drop-shadow-[0_8px_40px_rgba(241,196,15,0.35)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Faixa de marca rolando na base do hero */}
        <div className="relative border-t border-white/10 py-5">
          <div className="container-page flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-caption uppercase tracking-[0.2em] text-fg-onDarkMuted">
            <span>Acetato italiano</span>
            <span className="text-brand">·</span>
            <span>Titânio</span>
            <span className="text-brand">·</span>
            <span>Lentes sob medida</span>
            <span className="text-brand">·</span>
            <span>Garantia de fábrica</span>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Carrossel de destaques ───────────────────────── */}
      <HeroCarousel />

      {/* ───────────────────────── Selos de confiança ───────────────────────── */}
      <section className="border-b border-line bg-surface">
        <div className="container-page grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { t: "Parcele em até 10x", d: "Em todos os cartões" },
            { t: "Site 100% seguro", d: "Compra protegida" },
            { t: "Garantia de fábrica", d: "Em todos os modelos" },
          ].map((item) => (
            <div key={item.t} className="px-4 py-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-fg">
                {item.t}
              </p>
              <p className="mt-1 text-xs text-fg-muted">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────── Destaques ───────────────────────── */}
      <section className="container-page py-24 md:py-32">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-3 text-caption font-medium uppercase tracking-[0.2em] text-brand-text">
              <span className="inline-block h-px w-8 bg-brand-deep" />
              Em destaque
            </p>
            <h2 className="mt-4 font-display text-display-lg font-light text-fg md:text-display-xl">
              Mais <span className="italic text-brand-deep">vendidos</span>
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="hidden text-sm font-medium uppercase tracking-wide text-fg-muted transition-colors duration-feedback hover:text-brand-text md:block"
          >
            Ver todos →
          </Link>
        </Reveal>
        <Reveal delay={120} className="mt-14">
          <ProductGrid products={featured} />
        </Reveal>
      </section>

      {/* ───────────────────────── Categorias ───────────────────────── */}
      <section className="border-y border-line bg-surface-alt py-24 md:py-32">
        <div className="container-page">
          <Reveal>
            <p className="flex items-center gap-3 text-caption font-medium uppercase tracking-[0.2em] text-brand-text">
              <span className="inline-block h-px w-8 bg-brand-deep" />
              Por estilo
            </p>
            <h2 className="mt-4 font-display text-display-lg font-light text-fg md:text-display-xl">
              Para cada <span className="italic text-brand-deep">momento</span>.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {categories.map((c, i) => (
              <Reveal as="article" key={c.id} delay={i * 110}>
                <Link
                  href={`/catalogo?categoria=${c.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-sm border border-line bg-surface"
                >
                  <span className="absolute right-5 top-5 z-10 font-display text-2xl italic text-line transition-colors duration-content group-hover:text-brand">
                    0{i + 1}
                  </span>
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <span className="mb-3 h-px w-12 bg-brand transition-all duration-content group-hover:w-20" />
                    <p className="font-display text-display-md text-fg transition-transform duration-content ease-refined group-hover:-translate-y-1">
                      {c.name}
                    </p>
                    {c.description && (
                      <p className="mt-2 max-w-xs text-sm text-fg-muted">
                        {c.description}
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── Manifesto ───────────────────────── */}
      <section className="grain relative overflow-hidden bg-surface-dark py-28 text-fg-onDark md:py-36">
        <div
          aria-hidden
          className="glow pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]"
        />
        <div className="container-page relative">
          <Reveal className="mx-auto max-w-4xl text-center">
            <Image
              src="/enoke-leao.png"
              alt="Enoke"
              width={234}
              height={264}
              className="mx-auto mb-10 w-16 opacity-90"
            />
            <p className="font-display text-display-md font-light leading-snug md:text-display-lg">
              Acreditamos que enxergar bem é também viver com{" "}
              <span className="italic text-brand">propósito</span>. Cada armação
              Enoke é escolhida a dedo — em material, em forma e em intenção.
            </p>
            <div className="rule-gold mx-auto mt-12 w-24" />
            <p className="mt-6 text-caption uppercase tracking-[0.24em] text-brand">
              {SITE.fullName}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
