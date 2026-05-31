"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/cart/store";
import { formatBRL } from "@/lib/utils";

export function CartView() {
  const [mounted, setMounted] = useState(false);
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQuantity = useCart((s) => s.setQuantity);
  const total = useCart((s) => s.totalCents());

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-40 animate-pulse bg-mist/40" />;
  }

  if (items.length === 0) {
    return (
      <div className="border border-mist py-24 text-center">
        <p className="font-display text-display-md text-ink">
          Seu carrinho está vazio.
        </p>
        <p className="mt-2 text-sm text-stone-500">
          Comece explorando a coleção permanente.
        </p>
        <Link
          href="/catalogo"
          className="mt-8 inline-flex items-center rounded-sm bg-ink px-6 py-3 text-sm font-medium uppercase tracking-[0.04em] text-bone transition-colors duration-feedback hover:bg-ink-deep"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
      <ul className="divide-y divide-mist border-y border-mist">
        {items.map((item) => (
          <li key={item.id} className="flex gap-6 py-6">
            <Link
              href={`/produto/${item.slug}`}
              className="relative h-32 w-24 shrink-0 overflow-hidden bg-mist"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </Link>
            <div className="flex flex-1 flex-col justify-between gap-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-caption uppercase text-stone-500">
                    {item.brand}
                  </p>
                  <Link
                    href={`/produto/${item.slug}`}
                    className="font-display text-xl text-ink hover:text-ink-deep"
                  >
                    {item.name}
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label="Remover do carrinho"
                  className="text-stone-300 transition-colors duration-feedback hover:text-ink"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center border border-mist">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.id, item.quantity - 1)}
                    aria-label="Diminuir quantidade"
                    className="p-2 text-ink hover:bg-mist"
                  >
                    <Minus size={14} strokeWidth={1.5} />
                  </button>
                  <span className="min-w-[2rem] text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.id, item.quantity + 1)}
                    aria-label="Aumentar quantidade"
                    className="p-2 text-ink hover:bg-mist"
                  >
                    <Plus size={14} strokeWidth={1.5} />
                  </button>
                </div>
                <p className="text-sm font-semibold text-ink">
                  {formatBRL(item.price_cents * item.quantity)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit border border-mist bg-paper p-8">
        <p className="eyebrow">Resumo</p>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone-500">Subtotal</dt>
            <dd className="text-ink">{formatBRL(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">Frete</dt>
            <dd className="text-stone-500">calculado no checkout</dd>
          </div>
        </dl>
        <div className="mt-8 flex justify-between border-t border-mist pt-6">
          <p className="font-display text-xl text-ink">Total</p>
          <p className="font-display text-xl text-ink">{formatBRL(total)}</p>
        </div>
        <Link
          href="/checkout"
          className="mt-8 inline-flex w-full items-center justify-center rounded-sm bg-ink px-6 py-4 text-sm font-medium uppercase tracking-[0.04em] text-bone transition-colors duration-feedback hover:bg-ink-deep"
        >
          Finalizar compra
        </Link>
        <p className="mt-4 text-center text-xs text-stone-500">
          Pix com 5% de desconto · cartão em até 6× sem juros
        </p>
      </aside>
    </div>
  );
}
