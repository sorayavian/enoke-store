"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { MobileNav } from "@/components/admin/MobileNav";

// Decide o chrome do painel: a página de login é exibida sem sidebar/topbar.
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const semChrome = pathname?.startsWith("/admin/login");

  if (semChrome) {
    return <div className="min-h-screen bg-bone">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-bone">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <MobileNav />
        <main className="flex-1 px-5 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
