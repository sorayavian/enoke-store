import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  const year = 2026;
  return (
    <footer className="mt-32 border-t border-mist bg-paper">
      <div className="container-page grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-display-md text-ink">{SITE.name}</p>
          <p className="mt-3 max-w-sm text-sm text-stone-500">{SITE.tagline}</p>
        </div>

        <div>
          <p className="eyebrow">Loja</p>
          <ul className="mt-4 space-y-2 text-sm text-stone-500">
            <li><Link href="/catalogo" className="hover:text-ink">Catálogo</Link></li>
            <li><Link href="/catalogo?estilo=sol" className="hover:text-ink">Solares</Link></li>
            <li><Link href="/catalogo?estilo=grau" className="hover:text-ink">Grau</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Conta</p>
          <ul className="mt-4 space-y-2 text-sm text-stone-500">
            <li><Link href="/cliente" className="hover:text-ink">Minha conta</Link></li>
            <li><Link href="/cliente/pedidos" className="hover:text-ink">Pedidos</Link></li>
            <li><Link href="/cliente/receitas" className="hover:text-ink">Receitas</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-mist">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-6 text-xs text-stone-500 md:flex-row md:items-center">
          <p>© {year} {SITE.fullName}. Todos os direitos reservados.</p>
          <p>{SITE.email}</p>
        </div>
      </div>
    </footer>
  );
}
