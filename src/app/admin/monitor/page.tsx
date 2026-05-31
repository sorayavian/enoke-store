import { AlertTriangle, CheckCircle2, Bell, Sparkles } from "lucide-react";
import { Card, CardTitle, Badge, StatCard } from "@/components/admin/ui";
import {
  ERROS_SITE,
  AI_LOGS,
  AI_CUSTO_TOTAL_USD,
} from "@/lib/admin/mock";
import {
  ERROR_TYPE_LABEL,
  SEVERITY_BADGE,
  formatDataHora,
} from "@/lib/admin/labels";

export const metadata = { title: "Monitor" };

export default function MonitorPage() {
  const naoResolvidos = ERROS_SITE.filter((e) => !e.resolved);
  const alta = naoResolvidos.filter((e) => e.severity === "alta").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-ink-deep">Monitor</h1>
        <p className="mt-1 text-sm text-stone-300">
          Erros do site detectados pela IA · logs e custos
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Erros em aberto"
          value={String(naoResolvidos.length)}
          hint={`${alta} de severidade alta`}
          icon={<AlertTriangle size={18} strokeWidth={1.5} />}
          accent={alta > 0}
        />
        <StatCard
          label="Chamadas de IA hoje"
          value={String(AI_LOGS.length)}
          hint="em todos os módulos"
          icon={<Sparkles size={18} strokeWidth={1.5} />}
        />
        <StatCard
          label="Custo de IA (estimado)"
          value={`US$ ${AI_CUSTO_TOTAL_USD.toFixed(4)}`}
          hint="tokens de entrada + saída"
        />
      </div>

      {/* Log de erros */}
      <Card className="mt-6">
        <CardTitle
          action={
            <button className="flex items-center gap-1.5 rounded-md border border-mist px-3 py-1.5 text-xs text-stone-500 transition-colors hover:text-ink">
              <Bell size={14} /> Alertar o dono
            </button>
          }
        >
          Log de erros do site
        </CardTitle>
        <ul className="divide-y divide-mist/60">
          {ERROS_SITE.map((e) => (
            <li key={e.id} className="flex items-start gap-4 py-3">
              <span className="mt-0.5">
                {e.resolved ? (
                  <CheckCircle2 size={18} className="text-success" strokeWidth={1.5} />
                ) : (
                  <AlertTriangle size={18} className="text-danger" strokeWidth={1.5} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-ink">
                    {ERROR_TYPE_LABEL[e.type]}
                  </span>
                  <Badge className={SEVERITY_BADGE[e.severity]}>
                    {e.severity}
                  </Badge>
                  <code className="rounded bg-bone px-1.5 py-0.5 text-xs text-stone-300">
                    {e.path}
                  </code>
                  {e.resolved && (
                    <Badge className="bg-success/25 text-success">resolvido</Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-stone-300">{e.description}</p>
                <p className="mt-0.5 text-xs text-stone-300">
                  {formatDataHora(e.detected_at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Logs de IA */}
      <Card className="mt-6">
        <CardTitle>Logs de chamadas de IA</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mist text-left text-xs uppercase tracking-wider text-stone-300">
                <th className="pb-2 pr-4 font-medium">Endpoint</th>
                <th className="pb-2 pr-4 font-medium">Módulo</th>
                <th className="pb-2 pr-4 font-medium text-right">Entrada</th>
                <th className="pb-2 pr-4 font-medium text-right">Saída</th>
                <th className="pb-2 pr-4 font-medium text-right">Custo</th>
                <th className="pb-2 font-medium">Quando</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist/60">
              {AI_LOGS.map((l) => (
                <tr key={l.id} className="text-stone-500">
                  <td className="py-2 pr-4">
                    <code className="text-xs text-ink">{l.endpoint}</code>
                  </td>
                  <td className="py-2 pr-4 capitalize">{l.module}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">
                    {l.input_tokens.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums">
                    {l.output_tokens.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums">
                    US$ {l.cost_usd.toFixed(4)}
                  </td>
                  <td className="py-2 text-xs">{formatDataHora(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
