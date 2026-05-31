import Link from "next/link";
import type { ProductFilters } from "@/lib/data/products";

const GROUPS = [
  {
    key: "genero",
    label: "Gênero",
    options: [
      { value: "feminino", label: "Feminino" },
      { value: "masculino", label: "Masculino" },
      { value: "unissex", label: "Unissex" },
    ],
  },
  {
    key: "tipo",
    label: "Tipo",
    options: [
      { value: "grau", label: "Grau" },
      { value: "sol", label: "Sol" },
    ],
  },
  {
    key: "formato_rosto",
    label: "Formato do rosto",
    options: [
      { value: "oval", label: "Oval" },
      { value: "redondo", label: "Redondo" },
      { value: "quadrado", label: "Quadrado" },
      { value: "coracao", label: "Coração" },
      { value: "diamante", label: "Diamante" },
    ],
  },
  {
    key: "estilo",
    label: "Estilo",
    options: [
      { value: "classico", label: "Clássico" },
      { value: "moderno", label: "Moderno" },
      { value: "vintage", label: "Vintage" },
      { value: "esportivo", label: "Esportivo" },
    ],
  },
] as const;

export function CatalogFilters({
  current,
  brands,
  materials,
}: {
  current: ProductFilters;
  brands: string[];
  materials: string[];
}) {
  const buildHref = (overrides: Partial<ProductFilters>) => {
    const merged = { ...current, ...overrides };
    const params = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && v !== null) params.set(k, String(v));
    });
    const q = params.toString();
    return q ? `/catalogo?${q}` : "/catalogo";
  };

  const isActive = (key: keyof ProductFilters, value: string) =>
    String(current[key] ?? "") === value;

  const Pill = ({
    href,
    active,
    children,
  }: {
    href: string;
    active: boolean;
    children: React.ReactNode;
  }) => (
    <Link
      href={href}
      className={
        "inline-flex items-center rounded-sm border px-3 py-1.5 text-xs uppercase tracking-[0.08em] transition-colors duration-feedback " +
        (active
          ? "border-brand bg-brand text-brand-ink"
          : "border-line text-fg-muted hover:border-fg hover:text-fg")
      }
    >
      {children}
    </Link>
  );

  return (
    <aside className="space-y-10">
      {GROUPS.map((group) => (
        <div key={group.key}>
          <p className="mb-4 text-caption font-medium uppercase tracking-[0.12em] text-fg-subtle">{group.label}</p>
          <div className="flex flex-wrap gap-2">
            <Pill
              href={buildHref({ [group.key]: undefined } as Partial<ProductFilters>)}
              active={!current[group.key as keyof ProductFilters]}
            >
              Todos
            </Pill>
            {group.options.map((opt) => (
              <Pill
                key={opt.value}
                href={buildHref({
                  [group.key]: isActive(group.key as keyof ProductFilters, opt.value)
                    ? undefined
                    : opt.value,
                } as Partial<ProductFilters>)}
                active={isActive(group.key as keyof ProductFilters, opt.value)}
              >
                {opt.label}
              </Pill>
            ))}
          </div>
        </div>
      ))}

      <div>
        <p className="mb-4 text-caption font-medium uppercase tracking-[0.12em] text-fg-subtle">Marca</p>
        <div className="flex flex-wrap gap-2">
          <Pill href={buildHref({ marca: undefined })} active={!current.marca}>
            Todas
          </Pill>
          {brands.map((b) => (
            <Pill
              key={b}
              href={buildHref({ marca: current.marca === b ? undefined : b })}
              active={current.marca === b}
            >
              {b}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4 text-caption font-medium uppercase tracking-[0.12em] text-fg-subtle">Material</p>
        <div className="flex flex-wrap gap-2">
          <Pill href={buildHref({ material: undefined })} active={!current.material}>
            Todos
          </Pill>
          {materials.map((m) => (
            <Pill
              key={m}
              href={buildHref({ material: current.material === m ? undefined : m })}
              active={current.material === m}
            >
              {m}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4 text-caption font-medium uppercase tracking-[0.12em] text-fg-subtle">Faixa de preço</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Até R$ 1.500", min: undefined, max: 1500 },
            { label: "R$ 1.500 – R$ 2.500", min: 1500, max: 2500 },
            { label: "Acima de R$ 2.500", min: 2500, max: undefined },
          ].map((range) => {
            const active =
              current.preco_min === range.min && current.preco_max === range.max;
            return (
              <Pill
                key={range.label}
                href={buildHref(
                  active
                    ? { preco_min: undefined, preco_max: undefined }
                    : { preco_min: range.min, preco_max: range.max }
                )}
                active={active}
              >
                {range.label}
              </Pill>
            );
          })}
        </div>
      </div>

      <div className="pt-4">
        <Link
          href="/catalogo"
          className="text-xs uppercase tracking-[0.12em] text-fg-muted underline decoration-line underline-offset-4 hover:text-brand-deep"
        >
          Limpar filtros
        </Link>
      </div>
    </aside>
  );
}
