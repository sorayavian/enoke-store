"use client";

/**
 * Gráficos do admin baseados em Recharts, estilizados com a paleta ENOKE.
 * Componentes client — recebem dados já prontos (séries do mock).
 */

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PontoSerie, PontoSerieDupla } from "@/lib/admin/types";

const AMBER = "#C9A66B";
const AMBER_DEEP = "#8C6A2F";
const GRID = "#44444B";
const STONE = "#8E8E94";

// Formatadores serializáveis: o nome do formato cruza o limite server→client
// (uma função, não). Cada gráfico resolve o formatador internamente.
export type ValueFormat = "int" | "brl-k" | "milhar";

const FORMATTERS: Record<ValueFormat, (v: number) => string> = {
  int: (v) => String(v),
  "brl-k": (v) => `R$ ${(v / 1000).toFixed(0)}k`,
  milhar: (v) => v.toLocaleString("pt-BR"),
};

const tooltipStyle = {
  backgroundColor: "#34343A",
  border: "1px solid #44444B",
  borderRadius: 8,
  color: "#F2EFEA",
  fontSize: 12,
};

const axisProps = {
  stroke: STONE,
  fontSize: 11,
  tickLine: false,
  axisLine: { stroke: GRID },
};

/** Gráfico de área — bom para evolução de vendas */
export function AreaChartView({
  data,
  format,
}: {
  data: PontoSerie[];
  format?: ValueFormat;
}) {
  const formatValue = format ? FORMATTERS[format] : undefined;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="amberFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={AMBER} stopOpacity={0.35} />
            <stop offset="100%" stopColor={AMBER} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={formatValue} width={56} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v: number) => (formatValue ? formatValue(v) : v)}
          cursor={{ stroke: GRID }}
        />
        <Area
          type="monotone"
          dataKey="valor"
          stroke={AMBER}
          strokeWidth={2}
          fill="url(#amberFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Barras verticais simples */
export function BarChartView({
  data,
  format,
}: {
  data: PontoSerie[];
  format?: ValueFormat;
}) {
  const formatValue = format ? FORMATTERS[format] : undefined;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={formatValue} width={40} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v: number) => (formatValue ? formatValue(v) : v)}
          cursor={{ fill: "rgba(201,166,107,0.08)" }}
        />
        <Bar dataKey="valor" fill={AMBER} radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Barras horizontais — bom para rankings (top modelos, etc.) */
export function RankingBars({ data }: { data: PontoSerie[] }) {
  const max = Math.max(...data.map((d) => d.valor), 1);
  return (
    <ul className="space-y-3">
      {data.map((d, i) => (
        <li key={d.label} className="text-sm">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-ink">
              <span className="mr-2 text-stone-300">{i + 1}.</span>
              {d.label}
            </span>
            <span className="tabular-nums text-stone-300">{d.valor}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-mist">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(d.valor / max) * 100}%`,
                background: `linear-gradient(90deg, ${AMBER_DEEP}, ${AMBER})`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Duas barras agrupadas — ex.: mensagens recebidas x respondidas */
export function GroupedBars({
  data,
  labelA,
  labelB,
}: {
  data: PontoSerieDupla[];
  labelA: string;
  labelB: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} width={32} />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: "rgba(201,166,107,0.08)" }}
          formatter={(v: number, name) => [v, name === "a" ? labelA : labelB]}
        />
        <Bar dataKey="a" fill={AMBER_DEEP} radius={[4, 4, 0, 0]} maxBarSize={20} />
        <Bar dataKey="b" fill={AMBER} radius={[4, 4, 0, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Donut simples feito com SVG (sem peso extra) para breakdown por tipo */
export function DonutBreakdown({
  segments,
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let acc = 0;
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-6">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke={GRID} strokeWidth="14" />
        {segments.map((s) => {
          const frac = s.value / total;
          const dash = `${frac * c} ${c}`;
          const offset = -acc * c;
          acc += frac;
          return (
            <circle
              key={s.label}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="14"
              strokeDasharray={dash}
              strokeDashoffset={offset}
            />
          );
        })}
      </svg>
      <ul className="space-y-2 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ background: s.color }}
            />
            <span className="text-ink">{s.label}</span>
            <span className="text-stone-300">
              {((s.value / total) * 100).toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
