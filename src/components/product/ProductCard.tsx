import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/supabase/types";
import { formatBRL } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const [front, side] = product.images;
  const esgotado = product.stock <= 0;

  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-surface">
        {/* Imagem INTEIRA (object-contain): o óculos nunca é cortado. O fundo do
            card usa bg-surface (a MESMA cor do fundo da página) — assim a sobra
            se funde com o fundo, sem moldura, nos dois temas. No hover, troca
            para a lateral apenas se o produto tiver uma segunda imagem. */}
        <Image
          src={front}
          alt={`${product.name} — frente`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={
            "object-contain transition-transform duration-content ease-refined group-hover:scale-[1.04]" +
            (side ? " group-hover:opacity-0" : "")
          }
        />
        {side && (
          <Image
            src={side}
            alt={`${product.name} — lateral`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="scale-[1.04] object-contain opacity-0 transition-all duration-content ease-refined group-hover:scale-100 group-hover:opacity-100"
          />
        )}

        {/* Selo de esgotado / últimas peças */}
        {esgotado ? (
          <span className="absolute left-3 top-3 rounded-sm bg-surface-dark/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-fg-onDark">
            Esgotado
          </span>
        ) : product.stock <= 5 ? (
          <span className="absolute left-3 top-3 rounded-sm bg-brand px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-brand-ink">
            Últimas {product.stock}
          </span>
        ) : null}

        {/* Pílula "Ver modelo" que sobe no hover */}
        <span className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 rounded-sm bg-surface-dark/90 py-2.5 text-center text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-fg-onDark opacity-0 backdrop-blur-sm transition-all duration-content ease-refined group-hover:translate-y-0 group-hover:opacity-100">
          Ver modelo
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-caption uppercase tracking-[0.14em] text-fg-subtle">
            {product.brand}
          </p>
          <h3 className="mt-1.5 font-display text-xl italic text-fg transition-colors duration-feedback group-hover:text-brand-text">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-fg-muted">{product.material}</p>
        </div>
        <p className="whitespace-nowrap font-display text-lg font-medium text-fg">
          {formatBRL(product.price_cents)}
        </p>
      </div>
    </Link>
  );
}
