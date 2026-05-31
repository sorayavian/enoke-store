/**
 * Mock de produtos espelhando supabase/seed.sql.
 * Usado em desenvolvimento offline (Fases 3-8) enquanto Supabase real
 * não está conectado (Fase 9 vai plugar de verdade).
 *
 * Toda página deve consumir via `lib/data/products.ts` — nunca importar
 * este arquivo diretamente fora de `lib/data/`.
 */

import type { Product, Category } from "@/lib/supabase/types";

const NOW = "2026-05-28T00:00:00.000Z";

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-grau", slug: "grau", name: "Óculos de grau", description: "Armações para uso com lentes de grau", created_at: NOW },
  { id: "cat-sol", slug: "sol", name: "Óculos de sol", description: "Solares autorais com proteção UV400", created_at: NOW },
  { id: "cat-infantil", slug: "infantil", name: "Infantil", description: "Coleção para crianças", created_at: NOW },
];

const make = (
  id: string,
  slug: string,
  code: string,
  name: string,
  brand: string,
  material: string,
  price_cents: number,
  stock: number,
  specs: Product["specs"],
  category_slug: "grau" | "sol" | "infantil"
): Product => ({
  id,
  slug,
  code,
  name,
  brand,
  material,
  description: null,
  price_cents,
  stock,
  images: [`/placeholders/${slug}-1.svg`, `/placeholders/${slug}-2.svg`],
  blur_data_url: null,
  specs,
  category_id: MOCK_CATEGORIES.find((c) => c.slug === category_slug)!.id,
  is_active: true,
  created_at: NOW,
  updated_at: NOW,
});

export const MOCK_PRODUCTS: Product[] = [
  make("p-001", "aurora-acetato-grafite", "ENK-001", "Aurora", "Enoke Atelier", "Acetato italiano", 189000, 8,
    { formato_rosto: ["oval", "coracao"], estilo: ["classico"], genero: "feminino", tipo: "grau", cor: "grafite" }, "grau"),
  make("p-002", "lume-titanio-bronze", "ENK-002", "Lume", "Enoke Atelier", "Titânio escovado", 245000, 5,
    { formato_rosto: ["quadrado", "oval"], estilo: ["moderno"], genero: "unissex", tipo: "grau", cor: "bronze" }, "grau"),
  make("p-003", "volta-acetato-tartaruga", "ENK-003", "Volta", "Cinque Terre", "Acetato Mazzucchelli", 198000, 12,
    { formato_rosto: ["redondo", "oval"], estilo: ["vintage", "classico"], genero: "masculino", tipo: "sol", cor: "tartaruga" }, "sol"),
  make("p-004", "siena-metal-dourado", "ENK-004", "Siena", "Cinque Terre", "Metal", 175000, 9,
    { formato_rosto: ["coracao", "oval"], estilo: ["classico"], genero: "feminino", tipo: "sol", cor: "dourado" }, "sol"),
  make("p-005", "orto-aviador-prata", "ENK-005", "Orto", "Maison Ortolani", "Aço inoxidável", 289000, 4,
    { formato_rosto: ["oval", "diamante"], estilo: ["classico", "moderno"], genero: "masculino", tipo: "sol", cor: "prata" }, "sol"),
  make("p-006", "petra-acetato-creme", "ENK-006", "Petra", "Enoke Atelier", "Acetato italiano", 215000, 6,
    { formato_rosto: ["redondo", "oval"], estilo: ["moderno"], genero: "feminino", tipo: "grau", cor: "creme" }, "grau"),
  make("p-007", "mira-titanio-negro", "ENK-007", "Mira", "Maison Ortolani", "Titânio", 325000, 3,
    { formato_rosto: ["quadrado", "diamante"], estilo: ["moderno"], genero: "unissex", tipo: "ambos", cor: "negro" }, "grau"),
  make("p-008", "alba-acetato-mel", "ENK-008", "Alba", "Cinque Terre", "Acetato", 168000, 14,
    { formato_rosto: ["coracao", "oval"], estilo: ["vintage"], genero: "feminino", tipo: "sol", cor: "mel" }, "sol"),
  make("p-009", "porto-acetato-azul", "ENK-009", "Porto", "Enoke Atelier", "Bio-acetato", 199000, 7,
    { formato_rosto: ["quadrado", "oval"], estilo: ["moderno"], genero: "masculino", tipo: "grau", cor: "azul" }, "grau"),
  make("p-010", "nido-infantil-coral", "ENK-010", "Nido", "Piccolo", "TR-90 flexível", 89000, 20,
    { formato_rosto: ["redondo"], estilo: ["moderno"], genero: "unissex", tipo: "grau", cor: "coral" }, "infantil"),
];
