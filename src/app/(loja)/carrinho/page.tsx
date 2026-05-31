import type { Metadata } from "next";
import { CartView } from "./CartView";

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Suas armações selecionadas.",
};

export default function CarrinhoPage() {
  return (
    <section className="container-page py-16 md:py-24">
      <p className="text-caption font-medium uppercase tracking-[0.12em] text-brand-deep">Carrinho</p>
      <h1 className="mt-4 font-display text-display-xl font-semibold text-fg">
        Suas escolhas.
      </h1>
      <div className="mt-12">
        <CartView />
      </div>
    </section>
  );
}
