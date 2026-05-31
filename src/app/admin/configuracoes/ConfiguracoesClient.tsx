"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const TONS = ["Amigável", "Profissional", "Especializado", "Descontraído"];

function Campo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-stone-500">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-mist bg-bone px-3 py-2 text-sm text-ink placeholder:text-stone-300 focus:border-amber/50 focus:outline-none";

export function ConfiguracoesClient() {
  const [tom, setTom] = useState("Especializado");
  const [salvo, setSalvo] = useState(false);

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  }

  return (
    <form onSubmit={salvar} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardTitle>Dados da ótica</CardTitle>
        <div className="space-y-4">
          <Campo label="Nome da ótica">
            <input className={inputCls} defaultValue="ENOKE EWEYEAR STORE" />
          </Campo>
          <Campo label="Endereço">
            <input className={inputCls} defaultValue="Rua das Lentes, 100 — São Paulo/SP" />
          </Campo>
          <Campo label="Horário de funcionamento">
            <input className={inputCls} defaultValue="Seg a Sáb, 9h às 19h" />
          </Campo>
          <Campo label="Formas de pagamento">
            <input className={inputCls} defaultValue="Pix, cartão em até 10x, boleto" />
          </Campo>
        </div>
      </Card>

      <Card>
        <CardTitle>Redes sociais e contato</CardTitle>
        <div className="space-y-4">
          <Campo label="WhatsApp">
            <input className={inputCls} defaultValue="+55 11 98433-3042" />
          </Campo>
          <Campo label="Instagram">
            <input className={inputCls} defaultValue="@enoke.store" />
          </Campo>
          <Campo label="E-mail">
            <input className={inputCls} defaultValue="contato@enoke.store" />
          </Campo>
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <CardTitle>Comportamento da IA de atendimento</CardTitle>
        <div className="space-y-4">
          <Campo label="Tom de voz">
            <div className="flex flex-wrap gap-2">
              {TONS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTom(t)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm transition-colors",
                    tom === t
                      ? "border-amber/60 bg-amber/15 text-ink"
                      : "border-mist bg-bone text-stone-500 hover:text-ink"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </Campo>
          <Campo label="Mensagem padrão de saudação">
            <textarea
              className={cn(inputCls, "resize-none")}
              rows={2}
              defaultValue="Olá! Sou a assistente da ENOKE. Como posso ajudar você a encontrar o óculos perfeito? 😊"
            />
          </Campo>
          <Campo label="Política de troca e garantia">
            <textarea
              className={cn(inputCls, "resize-none")}
              rows={3}
              defaultValue="Trocas em até 7 dias corridos. Garantia de 12 meses contra defeitos de fabricação. Ajuste de armação gratuito."
            />
          </Campo>
          <label className="flex items-center gap-2 text-sm text-stone-500">
            <input type="checkbox" defaultChecked className="accent-amber" />
            Sempre tentar converter dúvidas em visita à loja ou venda no site
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-500">
            <input type="checkbox" defaultChecked className="accent-amber" />
            Coletar nome e contato do cliente antes de encerrar a conversa
          </label>
        </div>
      </Card>

      <div className="flex items-center gap-3 lg:col-span-2">
        <button
          type="submit"
          className="rounded-md bg-amber px-5 py-2.5 text-sm font-medium text-bone transition-opacity hover:opacity-90"
        >
          Salvar configurações
        </button>
        {salvo && (
          <span className="text-sm text-success">✓ Salvo (demonstração)</span>
        )}
      </div>
    </form>
  );
}
