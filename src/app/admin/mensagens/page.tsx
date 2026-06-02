import { Card, CardTitle } from "@/components/admin/ui";
import { DonutBreakdown, RankingBars } from "@/components/admin/charts";
import { MensagensClient } from "./MensagensClient";
import { AutoRefresh } from "@/components/admin/AutoRefresh";
import { getConversas, getMensagens, getMensagensStats } from "@/lib/admin/data";
import type { Message } from "@/lib/admin/types";

export const metadata = { title: "Mensagens" };

// Sempre busca dados frescos do banco (sem cache estático): mensagens novas
// que chegam pelos webhooks aparecem ao recarregar/revalidar.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MensagensPage() {
  const [CONVERSAS, MENSAGENS, MENSAGENS_STATS] = await Promise.all([
    getConversas(),
    getMensagens(),
    getMensagensStats(),
  ]);

  // Agrupa mensagens por conversa (no real, seria uma query por conversa).
  const mensagensPorConversa: Record<string, Message[]> = {};
  for (const m of MENSAGENS) {
    (mensagensPorConversa[m.conversation_id] ??= []).push(m);
  }
  for (const id in mensagensPorConversa) {
    mensagensPorConversa[id].sort((a, b) =>
      a.created_at.localeCompare(b.created_at)
    );
  }

  const { por_tipo, top_perguntas, top_modelos, total_respondidas } =
    MENSAGENS_STATS;

  return (
    <div>
      {/* Atualiza as conversas automaticamente a cada 20s. */}
      <AutoRefresh segundos={20} />
      <div className="mb-6">
        <h1 className="font-display text-display-lg text-ink-deep">Mensagens</h1>
        <p className="mt-1 text-sm text-stone-300">
          Caixa de entrada unificada · WhatsApp + Instagram
        </p>
      </div>

      {/* Caixa de entrada */}
      <MensagensClient
        conversas={CONVERSAS}
        mensagensPorConversa={mensagensPorConversa}
      />

      {/* Estatísticas */}
      <div className="mt-8">
        <h2 className="mb-4 font-display text-display-md text-ink">
          Estatísticas
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card>
            <CardTitle>Respondidas por tipo</CardTitle>
            <p className="-mt-2 mb-4 text-sm text-stone-300">
              Total respondidas:{" "}
              <span className="text-ink">{total_respondidas}</span>
            </p>
            <DonutBreakdown
              segments={[
                { label: "Perguntas", value: por_tipo.pergunta, color: "#C9A66B" },
                { label: "Avaliações", value: por_tipo.avaliacao, color: "#3F5E3E" },
                { label: "Intenção compra", value: por_tipo.intencao_compra, color: "#8C6A2F" },
                { label: "Reclamações", value: por_tipo.reclamacao, color: "#7A2E22" },
              ]}
            />
          </Card>

          <Card>
            <CardTitle>Top 5 perguntas frequentes</CardTitle>
            <RankingBars
              data={top_perguntas.map((p) => ({
                label: p.pergunta,
                valor: p.vezes,
              }))}
            />
          </Card>

          <Card>
            <CardTitle>Top 5 modelos buscados</CardTitle>
            <RankingBars
              data={top_modelos.map((m) => ({ label: m.modelo, valor: m.vezes }))}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
