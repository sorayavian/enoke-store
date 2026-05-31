"use client";

import { useState } from "react";
import { Upload, Sparkles, Check, ScanLine } from "lucide-react";
import { Card, CardTitle, Badge } from "@/components/admin/ui";

const VARIACOES = [
  { titulo: "Post de lançamento", desc: "Anúncio do modelo recém-chegado com foco em novidade." },
  { titulo: "Destaque de características", desc: "Material, formato e diferenciais técnicos da armação." },
  { titulo: "Estilo de vida", desc: "O modelo em contexto real — combinações e ocasiões de uso." },
  { titulo: "Story com enquete", desc: "Enquete interativa: 'Você usaria este modelo?'" },
  { titulo: "Reel curto", desc: "Roteiro de 15s + prompt de vídeo para geração automática." },
];

export function ScannerClient() {
  const [estado, setEstado] = useState<"vazio" | "lendo" | "lido">("vazio");
  const [codigo, setCodigo] = useState("");
  const [selecionados, setSelecionados] = useState<number[]>([0, 1, 2, 3, 4]);

  function simularUpload() {
    setEstado("lendo");
    setTimeout(() => {
      setCodigo("ENK-011");
      setEstado("lido");
    }, 1100);
  }

  function toggle(i: number) {
    setSelecionados((s) =>
      s.includes(i) ? s.filter((x) => x !== i) : [...s, i]
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
      <div className="space-y-4">
        <Card>
          <CardTitle>1. Foto do óculos</CardTitle>
          <button
            onClick={simularUpload}
            disabled={estado === "lendo"}
            className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-md border border-dashed border-mist bg-bone text-stone-300 transition-colors hover:border-amber/50 disabled:opacity-60"
          >
            {estado === "lendo" ? (
              <>
                <ScanLine size={36} strokeWidth={1.25} className="animate-pulse text-amber-soft" />
                <span className="text-sm">Lendo código com IA de visão…</span>
              </>
            ) : (
              <>
                <Upload size={36} strokeWidth={1.25} />
                <span className="text-sm">Clique para enviar a foto</span>
                <span className="text-xs">(com o código visível)</span>
              </>
            )}
          </button>
        </Card>

        {estado === "lido" && (
          <Card className="border-amber/40">
            <CardTitle
              action={<Sparkles size={16} className="text-amber-soft" />}
            >
              Código detectado
            </CardTitle>
            <p className="font-display text-display-md text-ink-deep">{codigo}</p>
            <Badge className="mt-2 bg-warning/25 text-amber-soft">
              Não encontrado no catálogo
            </Badge>
            <p className="mt-2 text-xs text-stone-300">
              O produto será criado automaticamente ao aprovar os posts.
            </p>
          </Card>
        )}
      </div>

      <div>
        {estado !== "lido" ? (
          <Card className="flex h-64 items-center justify-center text-sm text-stone-300">
            Envie uma foto para a IA detectar o modelo e gerar os posts.
          </Card>
        ) : (
          <Card>
            <CardTitle
              action={
                <span className="text-xs text-stone-300">
                  {selecionados.length} de {VARIACOES.length} selecionados
                </span>
              }
            >
              2. Variações geradas pela IA
            </CardTitle>
            <div className="space-y-3">
              {VARIACOES.map((v, i) => (
                <button
                  key={v.titulo}
                  onClick={() => toggle(i)}
                  className={`flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors ${
                    selecionados.includes(i)
                      ? "border-amber/60 bg-amber/10"
                      : "border-mist bg-bone hover:border-stone-300"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      selecionados.includes(i)
                        ? "border-amber bg-amber text-bone"
                        : "border-mist"
                    }`}
                  >
                    {selecionados.includes(i) && <Check size={12} />}
                  </span>
                  <span>
                    <span className="text-sm text-ink">{v.titulo}</span>
                    <span className="mt-0.5 block text-xs text-stone-300">
                      {v.desc}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <button
              disabled={selecionados.length === 0}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-amber px-4 py-2.5 text-sm font-medium text-bone transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Aprovar e agendar {selecionados.length} posts
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}
