import type { Metadata } from "next";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <section className="container-page py-16 md:py-24">
      <p className="flex items-center gap-3 text-caption font-medium uppercase tracking-[0.2em] text-brand-text">
        <span className="inline-block h-px w-8 bg-brand-deep" />
        Checkout
      </p>
      <h1 className="mt-5 font-display text-display-xl font-light text-fg md:text-display-2xl">
        Finalizar <span className="italic text-brand-deep">compra</span>.
      </h1>
      <div className="mt-12">
        <CheckoutForm />
      </div>
    </section>
  );
}
