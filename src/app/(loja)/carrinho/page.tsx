import type { Metadata } from "next";
import { CartView } from "./CartView";

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Suas armações selecionadas.",
};

export default function CarrinhoPage() {
  return (
    <section className="container-page py-16 md:py-24">
      <p className="flex items-center gap-3 text-caption font-medium uppercase tracking-[0.2em] text-brand-text">
        <span className="inline-block h-px w-8 bg-brand-deep" />
        Carrinho
      </p>
      <h1 className="mt-5 font-display text-display-xl font-light text-fg md:text-display-2xl">
        Suas <span className="italic text-brand-deep">escolhas</span>.
      </h1>
      <div className="mt-12">
        <CartView />
      </div>
    </section>
  );
}
