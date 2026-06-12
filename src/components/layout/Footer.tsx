import Link from "next/link";
import { SITE } from "@/lib/site";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  const year = 2026;
  return (
    <footer className="mt-32 border-t border-line-dark bg-surface-dark text-fg-onDark">
      <div className="container-page grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo variant="onDark" />
          <p className="mt-4 max-w-sm text-sm text-fg-onDarkMuted">
            {SITE.description}
          </p>
        </div>

        <div>
          <p className="text-caption font-medium uppercase tracking-[0.12em] text-brand">
            Loja
          </p>
          <ul className="mt-4 space-y-2 text-sm text-fg-onDarkMuted">
            <li><Link href="/catalogo" className="transition-colors hover:text-brand">Catálogo</Link></li>
            <li><Link href="/catalogo?tipo=sol" className="transition-colors hover:text-brand">Óculos de Sol</Link></li>
            <li><Link href="/catalogo?tipo=grau" className="transition-colors hover:text-brand">Óculos de Grau</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-caption font-medium uppercase tracking-[0.12em] text-brand">
            Conta
          </p>
          <ul className="mt-4 space-y-2 text-sm text-fg-onDarkMuted">
            <li><Link href="/cliente" className="transition-colors hover:text-brand">Minha conta</Link></li>
            <li><Link href="/cliente/pedidos" className="transition-colors hover:text-brand">Pedidos</Link></li>
            <li><Link href="/cliente/receitas" className="transition-colors hover:text-brand">Receitas</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-6 text-xs text-fg-onDarkMuted md:flex-row md:items-center">
          <p>© {year} {SITE.fullName}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>{SITE.email}</span>
            <Link href="/privacidade" className="transition-colors hover:text-brand">
              Política de Privacidade
            </Link>
            {/* Acesso ao painel administrativo (uso interno do dono) */}
            <Link href="/admin" className="transition-colors hover:text-brand">
              Painel administrativo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
