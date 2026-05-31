import Link from "next/link";
import { ShoppingBag, User, Search } from "lucide-react";
import { NAV } from "@/lib/site";
import { Logo } from "@/components/brand/Logo";
import { getClienteAtual } from "@/lib/auth/session";

export async function Header() {
  // Ajusta o ícone de conta conforme o cliente esteja logado ou não.
  const cliente = await getClienteAtual();
  const contaHref = cliente ? "/cliente" : "/login";
  const contaLabel = cliente ? "Minha conta" : "Entrar";

  return (
    <header className="sticky top-0 z-40 border-b border-line-dark bg-surface-dark">
      <div className="container-page flex h-16 items-center justify-between md:h-[72px]">
        <div className="flex flex-1 items-center gap-8">
          <Logo variant="onDark" />
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="text-sm text-fg-onDarkMuted transition-colors duration-feedback ease-out hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/catalogo"
            aria-label="Buscar"
            className="rounded-sm p-2 text-fg-onDark transition-colors duration-feedback hover:bg-white/10 hover:text-brand"
          >
            <Search size={20} strokeWidth={1.5} />
          </Link>
          <Link
            href={contaHref}
            aria-label={contaLabel}
            title={contaLabel}
            className="rounded-sm p-2 text-fg-onDark transition-colors duration-feedback hover:bg-white/10 hover:text-brand"
          >
            <User size={20} strokeWidth={1.5} />
          </Link>
          <Link
            href="/carrinho"
            aria-label="Carrinho"
            className="relative rounded-sm p-2 text-fg-onDark transition-colors duration-feedback hover:bg-white/10 hover:text-brand"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  );
}
