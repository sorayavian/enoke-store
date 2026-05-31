import type { Metadata } from "next";

export const metadata: Metadata = { title: "Receitas" };

export default function ReceitasPage() {
  return (
    <div>
      <p className="eyebrow">Receitas</p>
      <h2 className="mt-3 font-display text-display-md text-ink">
        Receitas salvas.
      </h2>
      <div className="mt-10 border border-mist bg-paper py-16 text-center">
        <p className="text-sm text-stone-500">
          Nenhuma receita cadastrada ainda.
        </p>
      </div>
    </div>
  );
}
