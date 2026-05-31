import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProductBySlug,
  getAllProductSlugs,
  getRelatedProducts,
} from "@/lib/data/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductGrid } from "@/components/product/ProductGrid";
import { formatBRL } from "@/lib/utils";
import { SITE } from "@/lib/site";

export const revalidate = 600;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Produto não encontrado" };
  return {
    title: `${product.name} · ${product.brand}`,
    description: `${product.name} em ${product.material} — armação autoral ENOKE EWEYEAR STORE.`,
    openGraph: {
      title: `${product.name} · ${product.brand}`,
      description: product.material,
      images: product.images,
      url: `${SITE.url}/produto/${product.slug}`,
    },
  };
}

const SPEC_LABELS: Record<string, string> = {
  tipo: "Tipo",
  genero: "Gênero",
  cor: "Cor",
  formato_rosto: "Formato do rosto",
  estilo: "Estilo",
  lentes_compativeis: "Lentes compatíveis",
};

const SPEC_VALUE_LABELS: Record<string, string> = {
  feminino: "Feminino",
  masculino: "Masculino",
  unissex: "Unissex",
  grau: "Grau",
  sol: "Sol",
  ambos: "Grau e sol",
  oval: "Oval",
  redondo: "Redondo",
  quadrado: "Quadrado",
  coracao: "Coração",
  diamante: "Diamante",
  classico: "Clássico",
  moderno: "Moderno",
  vintage: "Vintage",
  esportivo: "Esportivo",
  monofocal: "Monofocal",
  multifocal: "Multifocal",
};

const fmt = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(fmt).join(", ");
  if (typeof v === "string") return SPEC_VALUE_LABELS[v] ?? v;
  return String(v);
};

export default async function ProdutoPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.code,
    brand: { "@type": "Brand", name: product.brand },
    material: product.material,
    image: product.images.map((src) => `${SITE.url}${src}`),
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/produto/${product.slug}`,
      priceCurrency: "BRL",
      price: (product.price_cents / 100).toFixed(2),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="container-page py-12 md:py-20">
        <nav className="mb-10 text-xs uppercase tracking-[0.12em] text-stone-500">
          <Link href="/" className="hover:text-ink">Início</Link>
          <span className="mx-2">/</span>
          <Link href="/catalogo" className="hover:text-ink">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <ProductGallery images={product.images} productName={product.name} />

          <div>
            <p className="eyebrow">{product.brand}</p>
            <h1 className="mt-3 font-display text-display-xl font-light leading-none text-ink">
              {product.name}
            </h1>
            <p className="mt-3 text-sm text-stone-500">
              Modelo {product.code}
            </p>

            <p className="mt-8 font-display text-display-md text-ink">
              {formatBRL(product.price_cents)}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-stone-500">
              em até 6× sem juros
            </p>

            {product.description && (
              <p className="mt-8 text-sm leading-relaxed text-stone-500">
                {product.description}
              </p>
            )}

            <div className="mt-10">
              <AddToCartButton product={product} />
              {product.stock > 0 && product.stock <= 5 && (
                <p className="mt-4 text-xs uppercase tracking-[0.12em] text-warning">
                  Últimas {product.stock} peças
                </p>
              )}
            </div>

            <dl className="mt-12 divide-y divide-mist border-y border-mist">
              <div className="grid grid-cols-[160px_1fr] gap-4 py-4">
                <dt className="eyebrow self-center">Material</dt>
                <dd className="text-sm text-ink">{product.material}</dd>
              </div>
              {Object.entries(product.specs).map(([key, value]) => {
                if (!value) return null;
                return (
                  <div key={key} className="grid grid-cols-[160px_1fr] gap-4 py-4">
                    <dt className="eyebrow self-center">
                      {SPEC_LABELS[key] ?? key}
                    </dt>
                    <dd className="text-sm text-ink">{fmt(value)}</dd>
                  </div>
                );
              })}
            </dl>

            <details className="mt-10 border-b border-mist pb-6">
              <summary className="cursor-pointer text-sm font-medium text-ink">
                Atendimento e entrega
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-stone-500">
                Enviamos para todo o Brasil. Receitas podem ser anexadas no
                checkout. Dúvidas? Fale conosco no WhatsApp — atendimento
                consultivo, sem pressa.
              </p>
            </details>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-page border-t border-mist py-20">
          <p className="eyebrow">Você também pode gostar</p>
          <h2 className="mt-3 font-display text-display-md font-light text-ink">
            Combinações próximas.
          </h2>
          <div className="mt-10">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </article>
  );
}
