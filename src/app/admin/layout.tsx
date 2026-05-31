import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Painel administrativo",
  // O painel nunca deve ser indexado por buscadores.
  robots: { index: false, follow: false },
};

// Layout do painel administrativo. O AdminShell (client) decide quando exibir
// o chrome (sidebar + topbar) — a página de login fica sem ele.
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
