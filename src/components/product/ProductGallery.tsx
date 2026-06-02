"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div className="grid gap-4 md:grid-cols-[80px_1fr]">
      <div className="order-2 flex gap-3 md:order-1 md:flex-col">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Ver ângulo ${i + 1} de ${productName}`}
            className={cn(
              "relative aspect-square w-20 overflow-hidden rounded-sm bg-surface-alt transition-all duration-feedback",
              active === i
                ? "ring-2 ring-brand"
                : "opacity-70 hover:opacity-100"
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="80px"
              className="object-contain"
            />
          </button>
        ))}
      </div>
      {/* Imagem INTEIRA (object-contain): o óculos nunca é cortado. Fundo
          bg-surface (cor da página) para a sobra se fundir sem moldura. */}
      <div className="relative order-1 aspect-[4/5] w-full overflow-hidden rounded-sm bg-surface md:order-2">
        <Image
          key={main}
          src={main}
          alt={`${productName} — ângulo ${active + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="animate-[fadein_320ms_ease-out] object-contain"
        />
      </div>
      <style jsx>{`
        @keyframes fadein {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
      `}</style>
    </div>
  );
}
