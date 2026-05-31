/**
 * Camada de dados de produtos.
 *
 * Hoje (Fases 3-8): lê dos mocks em `lib/mock/products.ts`.
 * Fase 9: troca para consultas Supabase reais — interface das funções
 * permanece idêntica, então as páginas não precisam mudar.
 */

import "server-only";
import type { Product, Category, ProductSpecs } from "@/lib/supabase/types";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock/products";

export type ProductFilters = {
  formato_rosto?: string;
  estilo?: string;
  genero?: "feminino" | "masculino" | "unissex";
  tipo?: "grau" | "sol" | "ambos";
  marca?: string;
  material?: string;
  preco_min?: number; // em reais
  preco_max?: number;
  q?: string;
};

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return MOCK_PRODUCTS.slice(0, limit);
}

export async function getAllProducts(filters: ProductFilters = {}): Promise<Product[]> {
  return MOCK_PRODUCTS.filter((p) => matchesFilters(p, filters));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getAllProductSlugs(): Promise<string[]> {
  return MOCK_PRODUCTS.map((p) => p.slug);
}

export async function getCategories(): Promise<Category[]> {
  return MOCK_CATEGORIES;
}

export async function getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);
  if (!product) return [];
  return MOCK_PRODUCTS
    .filter((p) => p.id !== productId && p.specs.tipo === product.specs.tipo)
    .slice(0, limit);
}

export function listBrands(): string[] {
  return Array.from(new Set(MOCK_PRODUCTS.map((p) => p.brand))).sort();
}

export function listMaterials(): string[] {
  return Array.from(new Set(MOCK_PRODUCTS.map((p) => p.material))).sort();
}

function matchesFilters(p: Product, f: ProductFilters): boolean {
  const s: ProductSpecs = p.specs;
  if (f.formato_rosto && !s.formato_rosto?.includes(f.formato_rosto as never)) return false;
  if (f.estilo && !s.estilo?.includes(f.estilo as never)) return false;
  if (f.genero) {
    const ok = s.genero === f.genero || s.genero === "unissex";
    if (!ok) return false;
  }
  if (f.tipo) {
    const ok = s.tipo === f.tipo || s.tipo === "ambos";
    if (!ok) return false;
  }
  if (f.marca && p.brand !== f.marca) return false;
  if (f.material && p.material !== f.material) return false;
  if (f.preco_min && p.price_cents < f.preco_min * 100) return false;
  if (f.preco_max && p.price_cents > f.preco_max * 100) return false;
  if (f.q) {
    const hay = `${p.name} ${p.brand} ${p.code} ${p.material}`.toLowerCase();
    if (!hay.includes(f.q.toLowerCase())) return false;
  }
  return true;
}
