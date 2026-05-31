import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/supabase/types";
import { formatBRL } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const [front, side] = product.images;
  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-mist">
        <Image
          src={front}
          alt={`${product.name} — frente`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-opacity duration-content ease-refined group-hover:opacity-0"
        />
        {side && (
          <Image
            src={side}
            alt={`${product.name} — lateral`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-0 transition-opacity duration-content ease-refined group-hover:opacity-100"
          />
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-caption uppercase text-stone-500">{product.brand}</p>
          <h3 className="mt-1 font-display text-xl font-medium text-ink transition-colors duration-feedback group-hover:text-ink-deep">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-stone-500">{product.material}</p>
        </div>
        <p className="whitespace-nowrap text-sm font-semibold text-ink">
          {formatBRL(product.price_cents)}
        </p>
      </div>
    </Link>
  );
}
