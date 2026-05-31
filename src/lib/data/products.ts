/**
 * Camada de dados de produtos.
 *
 * Se o Supabase estiver configurado (ver `SUPABASE_CONFIGURED`), lê do banco
 * real. Caso contrário, cai para os mocks em `lib/mock/products.ts` — assim o
 * site funciona mesmo sem credenciais. A interface das funções é idêntica nos
 * dois casos, então as páginas não mudam.
 */

import "server-only";
import type { Product, Category, ProductSpecs } from "@/lib/supabase/types";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock/products";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/is-configured";
import { createSupabasePublicClient } from "@/lib/supabase/public";

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

// Produtos só ativos, ordenados por criação (mais recentes primeiro).
async function fetchAtivos(): Promise<Product[]> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[products] erro Supabase, usando mock:", error.message);
    return MOCK_PRODUCTS;
  }
  return (data as Product[]) ?? [];
}

async function todosProdutos(): Promise<Product[]> {
  return SUPABASE_CONFIGURED ? fetchAtivos() : MOCK_PRODUCTS;
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const produtos = await todosProdutos();
  return produtos.slice(0, limit);
}

export async function getAllProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const produtos = await todosProdutos();
  return produtos.filter((p) => matchesFilters(p, filters));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (SUPABASE_CONFIGURED) {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) console.error("[products] erro Supabase:", error.message);
    if (data) return data as Product;
    if (!error) return null;
  }
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

// Busca por id (inclui inativos) — usado na edição do admin.
export async function getProductById(id: string): Promise<Product | null> {
  if (SUPABASE_CONFIGURED) {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) console.error("[products] getProductById:", error.message);
    if (data) return data as Product;
    if (!error) return null;
  }
  return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
}

export async function getAllProductSlugs(): Promise<string[]> {
  const produtos = await todosProdutos();
  return produtos.map((p) => p.slug);
}

export async function getCategories(): Promise<Category[]> {
  if (SUPABASE_CONFIGURED) {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase.from("categories").select("*");
    if (!error && data) return data as Category[];
    if (error) console.error("[categories] erro Supabase:", error.message);
  }
  return MOCK_CATEGORIES;
}

export async function getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
  const produtos = await todosProdutos();
  const product = produtos.find((p) => p.id === productId);
  if (!product) return [];
  return produtos
    .filter((p) => p.id !== productId && p.specs.tipo === product.specs.tipo)
    .slice(0, limit);
}

// Marcas/materiais são derivados; em produção poderiam virar query distinct.
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
