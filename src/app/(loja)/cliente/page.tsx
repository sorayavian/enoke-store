import type { Metadata } from "next";

export const metadata: Metadata = { title: "Minha conta" };

export default function ClienteHomePage() {
  return (
    <div className="space-y-8">
      <div className="rounded-sm border border-line bg-surface-alt p-8">
        <p className="text-caption font-medium uppercase tracking-[0.12em] text-brand-text">Bem-vindo</p>
        <p className="mt-3 font-display text-display-md font-semibold text-fg">
          Sua conta está pronta.
        </p>
        <p className="mt-3 max-w-md text-sm text-fg-muted">
          Aqui você acompanha seus pedidos e guarda suas receitas para acelerar
          as próximas compras.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-sm border border-line bg-surface-alt p-6">
          <p className="text-caption font-medium uppercase tracking-[0.12em] text-fg-subtle">Últimos pedidos</p>
          <p className="mt-4 text-sm text-fg-muted">
            Nenhum pedido ainda. Suas compras aparecerão aqui.
          </p>
        </div>
        <div className="rounded-sm border border-line bg-surface-alt p-6">
          <p className="text-caption font-medium uppercase tracking-[0.12em] text-fg-subtle">Receitas salvas</p>
          <p className="mt-4 text-sm text-fg-muted">
            Guarde sua receita oftalmológica para acelerar próximos pedidos.
          </p>
        </div>
      </div>
    </div>
  );
}
