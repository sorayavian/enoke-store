import type { Product } from "@/lib/supabase/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="border border-mist py-24 text-center">
        <p className="font-display text-display-md text-ink">Nada por aqui.</p>
        <p className="mt-2 text-sm text-stone-500">
          Ajuste os filtros para ver mais armações.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
