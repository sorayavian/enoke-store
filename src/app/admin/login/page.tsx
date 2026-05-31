import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Entrar · Admin",
  robots: { index: false, follow: false },
};

// Página de login do painel. Visual pronto; a autenticação real (Supabase Auth
// + verificação de role 'admin') será plugada junto com o middleware.
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-display text-3xl tracking-tight text-ink">
            {SITE.name}
          </span>
          <p className="mt-1 text-caption uppercase text-stone-300">
            Painel administrativo
          </p>
        </div>

        <form className="space-y-4 rounded-lg border border-mist bg-paper p-6 shadow-soft">
          <label className="block">
            <span className="mb-1.5 block text-sm text-stone-500">E-mail</span>
            <input
              type="email"
              placeholder="dono@enoke.store"
              className="w-full rounded-md border border-mist bg-bone px-3 py-2 text-sm text-ink placeholder:text-stone-300 focus:border-amber/50 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-stone-500">Senha</span>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-mist bg-bone px-3 py-2 text-sm text-ink placeholder:text-stone-300 focus:border-amber/50 focus:outline-none"
            />
          </label>
          <Link
            href="/admin/dashboard"
            className="block w-full rounded-md bg-amber py-2.5 text-center text-sm font-medium text-bone transition-opacity hover:opacity-90"
          >
            Entrar
          </Link>
        </form>

        <p className="mt-4 text-center text-xs text-stone-300">
          Acesso restrito ao dono da ótica.
        </p>
      </div>
    </div>
  );
}
