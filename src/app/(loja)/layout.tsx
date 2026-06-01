import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";

// Chrome compartilhado das páginas públicas da loja.
export default function LojaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Wrapper de tema claro: escopa a identidade da loja (claro + dourado) sem
  // afetar o painel admin, que mantém o tema escuro herdado do body global.
  return (
    <div className="loja-theme min-h-screen bg-surface text-fg">
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
