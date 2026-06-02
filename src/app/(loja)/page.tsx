import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getCategories } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { HeroCarousel } from "@/components/product/HeroCarousel";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

export const revalidate = 600;

// Imagens de fundo dos cards de categoria, por slug. Fotos do Unsplash
// (uso livre, comercial, sem atribuição). Trocar por fotos próprias quando tiver.
const CATEGORIA_IMAGENS: Record<string, string> = {
  // Pessoa usando óculos de grau
  grau: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80",
  // Pessoa usando óculos de sol
  sol: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
  // Criança usando óculos (imagem própria, em public/)
  infantil: "/categoria-infantil.png",
};

export default async function Home() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  return (
    <>
      {/* ───────────────────────── HERO — carrossel de imagens ───────────────────────── */}
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
                  {/* Imagem de fundo por categoria (Unsplash — uso livre). */}
                  <Image
                    src={CATEGORIA_IMAGENS[c.slug] ?? CATEGORIA_IMAGENS.grau}
                    alt={c.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-content ease-refined group-hover:scale-[1.04]"
                  />
                  {/* Gradiente escuro para o texto ficar legível sobre a foto. */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
                  <span className="absolute right-5 top-5 z-10 font-display text-2xl italic text-white/70 transition-colors duration-content group-hover:text-brand">
                    0{i + 1}
                  </span>
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <span className="mb-3 h-px w-12 bg-brand transition-all duration-content group-hover:w-20" />
                    <p className="font-display text-display-md text-white transition-transform duration-content ease-refined group-hover:-translate-y-1">
                      {c.name}
                    </p>
                    {c.description && (
                      <p className="mt-2 max-w-xs text-sm text-white/80">
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
