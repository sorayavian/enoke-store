/**
 * Componentes de UI básicos do painel admin, no estilo do design system
 * ENOKE (bone/paper/ink/amber). Sem dependências externas além de Tailwind.
 */

import { cn } from "@/lib/utils";

// ── Card ──────────────────────────────────────────────────────────────────

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-mist bg-paper p-5 shadow-soft",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="font-display text-lg text-ink">{children}</h3>
      {action}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

// ── StatCard (KPI) ────────────────────────────────────────────────────────

export function StatCard({
  label,
  value,
  hint,
  trend,
  icon,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  /** variação percentual; positivo verde, negativo vermelho */
  trend?: number;
  icon?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Card className={cn(accent && "border-amber/40")}>
      <div className="flex items-start justify-between">
        <p className="eyebrow">{label}</p>
        {icon && <span className="text-amber-soft">{icon}</span>}
      </div>
      <p className="mt-3 font-display text-display-md text-ink-deep">{value}</p>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {typeof trend === "number" && (
          <span className={trend >= 0 ? "text-success" : "text-danger"}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        {hint && <span className="text-stone-300">{hint}</span>}
      </div>
    </Card>
  );
}

// ── Cabeçalho de página ───────────────────────────────────────────────────

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-display-lg text-ink-deep">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-stone-300">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Estado vazio ──────────────────────────────────────────────────────────

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-mist bg-paper/50 p-10 text-center text-sm text-stone-300">
      {children}
    </div>
  );
}
