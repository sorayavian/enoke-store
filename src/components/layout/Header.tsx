import Link from "next/link";
import { ShoppingBag, User, Search } from "lucide-react";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-bone/80 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between md:h-[72px]">
        <div className="flex flex-1 items-center gap-8">
          <Link
            href="/"
            aria-label="ENOKE — início"
            className="font-display text-2xl font-medium tracking-tight text-ink"
          >
            {SITE.name}
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="text-sm text-stone-500 transition-colors duration-feedback ease-out hover:text-ink"
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
            className="rounded-sm p-2 text-ink transition-colors duration-feedback hover:bg-mist"
          >
            <Search size={20} strokeWidth={1.5} />
          </Link>
          <Link
            href="/cliente"
            aria-label="Minha conta"
            className="rounded-sm p-2 text-ink transition-colors duration-feedback hover:bg-mist"
          >
            <User size={20} strokeWidth={1.5} />
          </Link>
          <Link
            href="/carrinho"
            aria-label="Carrinho"
            className="relative rounded-sm p-2 text-ink transition-colors duration-feedback hover:bg-mist"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  );
}
