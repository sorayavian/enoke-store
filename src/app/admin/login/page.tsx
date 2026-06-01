import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SITE } from "@/lib/site";
import { ADMIN_COOKIE, validarTokenSessao } from "@/lib/admin/auth";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata = {
  title: "Entrar · Admin",
  robots: { index: false, follow: false },
};

// Página de login do painel: acesso por senha (do dono).
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  // Se já houver sessão válida, vai direto ao painel.
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (await validarTokenSessao(token)) redirect("/admin/dashboard");

  const next =
    searchParams.next?.startsWith("/admin") && !searchParams.next.startsWith("//")
      ? searchParams.next
      : undefined;

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

        <AdminLoginForm next={next} />

        <p className="mt-4 text-center text-xs text-stone-300">
          Acesso restrito ao dono da ótica.
        </p>
      </div>
    </div>
  );
}
