"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/store";
import { formatBRL } from "@/lib/utils";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.totalCents());
  const clear = useCart((s) => s.clear);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const payload = {
      items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
      customer: {
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? "") || undefined,
      },
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Erro ao processar checkout");
        setSubmitting(false);
        return;
      }
      clear();
      router.push(json.init_point);
    } catch {
      setError("Falha de rede. Tente novamente.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-sm border border-line py-20 text-center">
        <p className="text-fg-muted">Adicione produtos ao carrinho antes de finalizar.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <fieldset className="space-y-4">
          <legend className="text-caption font-medium uppercase tracking-[0.12em] text-fg-subtle">Seus dados</legend>
          <label className="block">
            <span className="text-xs text-fg-muted">Nome completo</span>
            <input
              name="name"
              required
              minLength={2}
              className="mt-1 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-fg focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </label>
          <label className="block">
            <span className="text-xs text-fg-muted">Email</span>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-fg focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </label>
          <label className="block">
            <span className="text-xs text-fg-muted">Telefone (opcional)</span>
            <input
              name="phone"
              className="mt-1 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-fg focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </label>
        </fieldset>

        <div className="rounded-sm border border-brand/40 bg-brand-soft/20 p-6">
          <p className="text-xs uppercase tracking-[0.12em] text-brand-text">Modo desenvolvimento</p>
          <p className="mt-2 text-sm text-fg">
            O Mercado Pago será conectado na Fase 9. Por enquanto, o checkout
            simula sucesso e redireciona para a página de confirmação.
          </p>
        </div>

        {error && (
          <p className="rounded-sm border border-danger/40 bg-danger/5 p-4 text-sm text-danger">
            {error}
          </p>
        )}
      </div>

      <aside className="h-fit rounded-sm border border-line bg-surface-alt p-8">
        <p className="text-caption font-medium uppercase tracking-[0.12em] text-fg-subtle">Resumo</p>
        <ul className="mt-6 space-y-3 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-4">
              <span className="text-fg-muted">
                {i.name} × {i.quantity}
              </span>
              <span className="text-fg">{formatBRL(i.price_cents * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between border-t border-line pt-4">
          <p className="font-display text-xl font-semibold text-fg">Total</p>
          <p className="font-display text-xl font-semibold text-fg">{formatBRL(total)}</p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-8 inline-flex w-full items-center justify-center rounded-sm bg-brand px-6 py-4 text-sm font-semibold uppercase tracking-[0.04em] text-brand-ink transition-colors duration-feedback hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-fg-subtle"
        >
          {submitting ? "Processando..." : "Pagar"}
        </button>
      </aside>
    </form>
  );
}
