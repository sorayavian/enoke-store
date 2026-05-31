export const SITE = {
  name: "Enoke",
  fullName: "Enoke Eyewear Store",
  tagline: "Visão e Propósito",
  description:
    "Um novo conceito em ótica on-line, promovendo Visão e Propósito na sua vida. Óculos de grau e de sol com curadoria, lentes sob medida e atendimento especializado.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511984333042",
  email: "contato@enoke.com.br",
} as const;

export const NAV = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo?genero=feminino", label: "Feminino" },
  { href: "/catalogo?genero=masculino", label: "Masculino" },
  { href: "/catalogo?estilo=sol", label: "Solares" },
] as const;
