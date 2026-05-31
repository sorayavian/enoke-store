"use client";

import { useState } from "react";
import { Send, Sparkles, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import {
  CLASSIFICATION_BADGE,
  CLASSIFICATION_LABEL,
  CONV_STATUS_BADGE,
  CONV_STATUS_LABEL,
  SOURCE_BADGE,
  SOURCE_SHORT,
  formatHora,
} from "@/lib/admin/labels";
import type { Conversation, Message } from "@/lib/admin/types";

type Props = {
  conversas: Conversation[];
  mensagensPorConversa: Record<string, Message[]>;
};

export function MensagensClient({ conversas, mensagensPorConversa }: Props) {
  const [selecionadaId, setSelecionadaId] = useState(conversas[0]?.id ?? "");
  // Estado local do toggle de IA por conversa (mock — não persiste).
  const [iaPorConversa, setIaPorConversa] = useState<Record<string, boolean>>(
    Object.fromEntries(conversas.map((c) => [c.id, c.ai_enabled]))
  );
  const [rascunho, setRascunho] = useState("");

  const selecionada = conversas.find((c) => c.id === selecionadaId);
  const mensagens = mensagensPorConversa[selecionadaId] ?? [];

  return (
    <div className="grid h-[calc(100vh-13rem)] grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
      {/* Lista de conversas */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-mist bg-paper">
        <div className="border-b border-mist px-4 py-3 text-sm font-medium text-ink">
          Conversas ({conversas.length})
        </div>
        <ul className="flex-1 overflow-y-auto">
          {conversas.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setSelecionadaId(c.id)}
                className={cn(
                  "flex w-full flex-col gap-1 border-b border-mist/60 px-4 py-3 text-left transition-colors",
                  c.id === selecionadaId ? "bg-mist" : "hover:bg-mist/50"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <Badge className={SOURCE_BADGE[c.source]}>
                      {SOURCE_SHORT[c.source]}
                    </Badge>
                    <span className="text-sm text-ink">{c.customer_name}</span>
                  </span>
                  <span className="text-xs text-stone-300">
                    {formatHora(c.updated_at)}
                  </span>
                </div>
                <p className="line-clamp-1 text-xs text-stone-300">
                  {c.last_message_preview}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge className={CONV_STATUS_BADGE[c.status]}>
                    {CONV_STATUS_LABEL[c.status]}
                  </Badge>
                  {c.unread > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber px-1 text-[10px] font-semibold text-bone">
                      {c.unread}
                    </span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Conversa selecionada */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-mist bg-paper">
        {selecionada ? (
          <>
            {/* Cabeçalho da conversa */}
            <div className="flex items-center justify-between gap-3 border-b border-mist px-5 py-3">
              <div>
                <p className="text-sm font-medium text-ink">
                  {selecionada.customer_name}
                </p>
                <p className="text-xs text-stone-300">
                  {selecionada.customer_contact}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* Toggle IA */}
                <label className="flex cursor-pointer items-center gap-2 text-xs text-stone-300">
                  <Sparkles size={14} className="text-amber-soft" />
                  IA automática
                  <button
                    type="button"
                    onClick={() =>
                      setIaPorConversa((s) => ({
                        ...s,
                        [selecionada.id]: !s[selecionada.id],
                      }))
                    }
                    className={cn(
                      "relative h-5 w-9 rounded-full transition-colors",
                      iaPorConversa[selecionada.id] ? "bg-amber" : "bg-mist"
                    )}
                    aria-pressed={iaPorConversa[selecionada.id]}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-4 w-4 rounded-full bg-ink transition-transform",
                        iaPorConversa[selecionada.id]
                          ? "translate-x-4"
                          : "translate-x-0.5"
                      )}
                    />
                  </button>
                </label>
                <button className="flex items-center gap-1 rounded-md border border-mist px-2.5 py-1.5 text-xs text-stone-500 transition-colors hover:text-ink">
                  <ArrowUpRight size={14} />
                  Escalar
                </button>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {mensagens.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex flex-col gap-1",
                    m.direction === "out" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg px-3.5 py-2.5 text-sm",
                      m.direction === "out"
                        ? "bg-amber/20 text-ink"
                        : "bg-mist text-ink"
                    )}
                  >
                    {m.content}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-300">
                    {m.ai_generated && (
                      <span className="flex items-center gap-1 text-amber-soft">
                        <Sparkles size={11} /> IA
                      </span>
                    )}
                    {m.classification && (
                      <Badge className={CLASSIFICATION_BADGE[m.classification]}>
                        {CLASSIFICATION_LABEL[m.classification]}
                      </Badge>
                    )}
                    <span>{formatHora(m.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Composer */}
            <div className="border-t border-mist p-3">
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  value={rascunho}
                  onChange={(e) => setRascunho(e.target.value)}
                  placeholder={
                    iaPorConversa[selecionada.id]
                      ? "A IA responde automaticamente — ou escreva manualmente…"
                      : "Escreva uma resposta…"
                  }
                  className="flex-1 resize-none rounded-md border border-mist bg-bone px-3 py-2 text-sm text-ink placeholder:text-stone-300 focus:border-amber/50 focus:outline-none"
                />
                <button
                  onClick={() => setRascunho("")}
                  className="flex h-10 items-center gap-2 rounded-md bg-amber px-4 text-sm font-medium text-bone transition-opacity hover:opacity-90"
                >
                  <Send size={16} />
                  Enviar
                </button>
              </div>
              <p className="mt-1.5 px-1 text-[11px] text-stone-300">
                Demonstração — o envio real conecta WhatsApp/Instagram via webhooks.
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-stone-300">
            Selecione uma conversa
          </div>
        )}
      </div>
    </div>
  );
}
