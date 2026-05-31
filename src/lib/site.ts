export const SITE = {
  name: "ENOKE",
  fullName: "ENOKE EWEYEAR STORE",
  tagline: "Eyewear curated for the considered.",
  description:
    "Armações autorais e lentes sob medida. ENOKE EWEYEAR STORE — ótica de luxo com curadoria minimalista.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511984333042",
  email: "contato@enoke.store",
} as const;

export const NAV = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo?genero=feminino", label: "Feminino" },
  { href: "/catalogo?genero=masculino", label: "Masculino" },
  { href: "/catalogo?estilo=sol", label: "Solares" },
] as const;
