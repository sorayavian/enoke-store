import type { Metadata } from "next";
import {
  getAllProducts,
  listBrands,
  listMaterials,
  type ProductFilters,
} from "@/lib/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CatalogFilters } from "@/components/product/CatalogFilters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Toda a curadoria Enoke em um só lugar. Filtre por formato, estilo, gênero, marca, material e preço.",
};

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

function parseFilters(sp: SearchParams): ProductFilters {
  const pick = (k: string) => {
    const v = sp[k];
    return typeof v === "string" && v.length > 0 ? v : undefined;
  };
  return {
    formato_rosto: pick("formato_rosto"),
    estilo: pick("estilo"),
    genero: pick("genero") as ProductFilters["genero"],
    tipo: pick("tipo") as ProductFilters["tipo"],
    categoria: pick("categoria"),
    marca: pick("marca"),
    material: pick("material"),
    preco_min: pick("preco_min") ? Number(pick("preco_min")) : undefined,
    preco_max: pick("preco_max") ? Number(pick("preco_max")) : undefined,
    q: pick("q"),
  };
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = parseFilters(searchParams);
  const [products, brands, materials] = await Promise.all([
    getAllProducts(filters),
    listBrands(),
    listMaterials(),
  ]);

  return (
    <section className="container-page py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="flex items-center gap-3 text-caption font-medium uppercase tracking-[0.2em] text-brand-text">
          <span className="inline-block h-px w-8 bg-brand-deep" />
          Catálogo
        </p>
        <h1 className="mt-5 font-display text-display-xl font-light text-fg md:text-display-2xl">
          Toda a <span className="italic text-brand-deep">coleção</span>.
        </h1>
        <p className="mt-5 text-fg-muted">
          {products.length} {products.length === 1 ? "armação" : "armações"}{" "}
          disponíveis.
        </p>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-[260px_1fr]">
        <CatalogFilters
          current={filters}
          brands={brands}
          materials={materials}
        />
        <div>
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  );
}
