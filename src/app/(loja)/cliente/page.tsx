import type { Metadata } from "next";

export const metadata: Metadata = { title: "Minha conta" };

export default function ClienteHomePage() {
  return (
    <div className="space-y-8">
      <div className="border border-mist bg-paper p-8">
        <p className="eyebrow">Bem-vinda</p>
        <p className="mt-3 font-display text-display-md text-ink">
          Sua conta está pronta.
        </p>
        <p className="mt-3 max-w-md text-sm text-stone-500">
          Conexão de autenticação real entra na Fase 9. Por enquanto, esta
          área serve de prévia da estrutura.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border border-mist bg-paper p-6">
          <p className="eyebrow">Últimos pedidos</p>
          <p className="mt-4 text-sm text-stone-500">
            Nenhum pedido ainda. Suas compras aparecerão aqui.
          </p>
        </div>
        <div className="border border-mist bg-paper p-6">
          <p className="eyebrow">Receitas salvas</p>
          <p className="mt-4 text-sm text-stone-500">
            Guarde sua receita oftalmológica para acelerar próximos pedidos.
          </p>
        </div>
      </div>
    </div>
  );
}
