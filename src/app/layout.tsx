import type { Metadata } from "next";
import { Poppins, Manrope } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

// Display: Poppins (sans geométrica) — condiz com o wordmark "Enōke" da marca.
const display = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.fullName} — Óculos autorais`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.fullName,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.fullName,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.fullName,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

// Layout raiz: apenas html/body, fontes e metadados globais.
// O chrome da loja (Header/Footer) vive em (loja)/layout.tsx; o painel
// administrativo tem seu próprio chrome em admin/layout.tsx.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-bone text-ink antialiased">{children}</body>
    </html>
  );
}
