"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/store";
import type { Product } from "@/lib/supabase/types";

export function AddToCartButton({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const inStock = product.stock > 0;

  const handle = () => {
    if (!inStock) return;
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price_cents: product.price_cents,
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={!inStock}
      className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-4 text-sm font-medium uppercase tracking-[0.04em] text-bone transition-colors duration-feedback hover:bg-ink-deep disabled:cursor-not-allowed disabled:bg-stone-300"
    >
      {!inStock ? "Indisponível" : added ? "Adicionado ✓" : "Adicionar ao carrinho"}
    </button>
  );
}
