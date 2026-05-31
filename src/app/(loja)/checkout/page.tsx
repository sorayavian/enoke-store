import type { Metadata } from "next";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <section className="container-page py-16 md:py-24">
      <p className="text-caption font-medium uppercase tracking-[0.12em] text-brand-deep">Checkout</p>
      <h1 className="mt-4 font-display text-display-xl font-semibold text-fg">
        Finalizar compra.
      </h1>
      <div className="mt-12">
        <CheckoutForm />
      </div>
    </section>
  );
}
