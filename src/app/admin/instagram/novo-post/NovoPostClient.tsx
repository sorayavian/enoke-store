"use client";

import { useState } from "react";
import { Sparkles, Check, Image as ImageIcon, Clock } from "lucide-react";
import { Card, CardTitle, Badge } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { IG_POST_TYPE_LABEL } from "@/lib/admin/labels";
import type { InstagramPostType } from "@/lib/admin/types";
import type { Product } from "@/lib/supabase/types";

const TIPOS: InstagramPostType[] = [
  "foto_produto",
  "dica_saude",
  "tendencia",
  "promocao",
];

// Legendas simuladas (no real, viriam de POST /api/ai/gerar-legenda).
function gerarLegendas(tipo: InstagramPostType, produto?: Product): string[] {
  const nome = produto?.name ?? "nosso novo modelo";
  switch (tipo) {
    case "foto_produto":
      return [
        `${nome}. Design autoral, acabamento impecável. Para quem valoriza o essencial. ✨`,
        `Conheça ${nome} — leveza e estilo em cada detalhe. Disponível na loja e no site. 👓`,
        `Novo na ENOKE: ${nome}. Experimente o conforto de uma armação pensada para você.`,
      ];
    case "dica_saude":
      return [
        "Você sabia? Pausas de 20 segundos a cada 20 minutos descansam sua visão. 👀",
        "Lentes com filtro de luz azul reduzem o cansaço visual no dia a dia digital.",
        "Proteção UV não é só no verão: use óculos de sol o ano todo. ☀️",
      ];
    case "tendencia":
      return [
        "Armações em titânio dominam 2026: leveza, resistência e elegância atemporal.",
        "Tons terrosos e formatos arredondados são a cara da estação. Vem ver!",
        "O minimalismo continua em alta — menos é definitivamente mais. 🤍",
      ];
    case "promocao":
      return [
        "Semana especial: 15% OFF em modelos selecionados. Corre que é por tempo limitado! 🔥",
        "Leve 2, pague 1 nas lentes antirreflexo. Só nesta semana na ENOKE!",
        "Frete grátis em todo o site para compras acima de R$ 500. Aproveite! 🚚",
      ];
  }
}

const HASHTAGS = ["#otica", "#oculos", "#eyewear", "#enoke", "#estilo"];

export function NovoPostClient({ produtos }: { produtos: Product[] }) {
  const [tipo, setTipo] = useState<InstagramPostType>("foto_produto");
  const [produtoId, setProdutoId] = useState<string>("");
  const [legendas, setLegendas] = useState<string[]>([]);
  const [legendaEscolhida, setLegendaEscolhida] = useState<number | null>(null);
  const [imagemEscolhida, setImagemEscolhida] = useState<number | null>(null);
  const [gerando, setGerando] = useState(false);

  const produto = produtos.find((p) => p.id === produtoId);

  function gerar() {
    setGerando(true);
    // Simula latência da chamada de IA.
    setTimeout(() => {
      setLegendas(gerarLegendas(tipo, produto));
      setLegendaEscolhida(null);
      setImagemEscolhida(null);
      setGerando(false);
    }, 700);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
      {/* Configuração */}
      <div className="space-y-4">
        <Card>
          <CardTitle>1. Tipo de post</CardTitle>
          <div className="grid grid-cols-2 gap-2">
            {TIPOS.map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={cn(
                  "rounded-md border px-3 py-2 text-left text-sm transition-colors",
                  tipo === t
                    ? "border-amber/60 bg-amber/15 text-ink"
                    : "border-mist bg-bone text-stone-500 hover:text-ink"
                )}
              >
                {IG_POST_TYPE_LABEL[t]}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>2. Produto (opcional)</CardTitle>
          <select
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
            className="w-full rounded-md border border-mist bg-bone px-3 py-2 text-sm text-ink focus:border-amber/50 focus:outline-none"
          >
            <option value="">Nenhum produto específico</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.code}
              </option>
            ))}
          </select>
        </Card>

        <button
          onClick={gerar}
          disabled={gerando}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-amber px-4 py-2.5 text-sm font-medium text-bone transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Sparkles size={16} />
          {gerando ? "Gerando com IA…" : "Gerar opções com IA"}
        </button>
        <p className="text-center text-[11px] text-stone-300">
          Demonstração — conecta /api/ai/gerar-legenda e /api/ai/gerar-imagem
        </p>
      </div>

      {/* Resultado */}
      <div className="space-y-6">
        {legendas.length === 0 ? (
          <Card className="flex h-64 items-center justify-center text-sm text-stone-300">
            Escolha o tipo e clique em “Gerar opções com IA”.
          </Card>
        ) : (
          <>
            <Card>
              <CardTitle>3. Escolha a legenda</CardTitle>
              <div className="space-y-3">
                {legendas.map((l, i) => (
                  <button
                    key={i}
                    onClick={() => setLegendaEscolhida(i)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-md border p-3 text-left text-sm transition-colors",
                      legendaEscolhida === i
                        ? "border-amber/60 bg-amber/10"
                        : "border-mist bg-bone hover:border-stone-300"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                        legendaEscolhida === i
                          ? "border-amber bg-amber text-bone"
                          : "border-mist"
                      )}
                    >
                      {legendaEscolhida === i && <Check size={12} />}
                    </span>
                    <span>
                      <span className="text-ink">{l}</span>
                      <span className="mt-1 block text-xs text-amber-soft">
                        {HASHTAGS.join(" ")}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <CardTitle>4. Escolha a imagem</CardTitle>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => setImagemEscolhida(i)}
                    className={cn(
                      "flex aspect-square flex-col items-center justify-center gap-2 rounded-md border text-xs transition-colors",
                      imagemEscolhida === i
                        ? "border-amber/60 bg-amber/10 text-ink"
                        : "border-mist bg-bone text-stone-300 hover:border-stone-300"
                    )}
                  >
                    <ImageIcon size={24} strokeWidth={1.25} />
                    Opção {i + 1}
                    {imagemEscolhida === i && (
                      <Badge className="bg-amber/25 text-amber-soft">selecionada</Badge>
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-stone-300">
                Imagens geradas por DALL-E 3 (placeholder na demonstração).
              </p>
            </Card>

            <Card>
              <CardTitle>5. Publicação</CardTitle>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="datetime-local"
                  className="rounded-md border border-mist bg-bone px-3 py-2 text-sm text-ink focus:border-amber/50 focus:outline-none"
                />
                <button
                  disabled={legendaEscolhida === null || imagemEscolhida === null}
                  className="flex items-center gap-2 rounded-md border border-mist px-4 py-2 text-sm text-ink transition-colors hover:border-amber/50 disabled:opacity-50"
                >
                  <Clock size={15} /> Agendar
                </button>
                <button
                  disabled={legendaEscolhida === null || imagemEscolhida === null}
                  className="flex items-center gap-2 rounded-md bg-amber px-4 py-2 text-sm font-medium text-bone transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  Publicar agora
                </button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
