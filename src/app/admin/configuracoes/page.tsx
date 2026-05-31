import { ConfiguracoesClient } from "./ConfiguracoesClient";

export const metadata = { title: "Configurações" };

export default function ConfiguracoesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-ink-deep">
          Configurações
        </h1>
        <p className="mt-1 text-sm text-stone-300">
          Dados da ótica, atendimento e comportamento da IA
        </p>
      </div>
      <ConfiguracoesClient />
    </div>
  );
}
