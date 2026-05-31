"use server";

/**
 * Server Actions de produtos (cadastro/edição/exclusão).
 *
 * Usam o client com service_role (escrita), então rodam apenas no servidor.
 * Requer Supabase configurado; sem isso, retornam um aviso amigável.
 */

import { revalidatePath } from "next/cache";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/is-configured";
import { slugify } from "@/lib/utils";
import type { ProductSpecs } from "@/lib/supabase/types";

export type ResultadoAcao = { ok: boolean; erro?: string };

const BUCKET = "produtos";

/**
 * Faz upload de uma imagem para o Supabase Storage e devolve a URL pública.
 * Usado pelo formulário de produto (envia arquivos via FormData).
 */
export async function uploadImagem(formData: FormData): Promise<{
  ok: boolean;
  url?: string;
  erro?: string;
}> {
  if (!SUPABASE_CONFIGURED) {
    return { ok: false, erro: "Supabase não configurado." };
  }
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, erro: "Arquivo inválido." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, erro: "Envie um arquivo de imagem." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, erro: "Imagem muito grande (máx. 5 MB)." };
  }

  const sb = createSupabaseServiceClient();
  const ext = file.name.split(".").pop() || "jpg";
  // Nome único baseado no conteúdo/tamanho (sem Date.now, indisponível no build).
  const nome = `${slugify(file.name.replace(/\.[^.]+$/, ""))}-${file.size}.${ext}`;
  const caminho = `produtos/${nome}`;

  const { error } = await sb.storage
    .from(BUCKET)
    .upload(caminho, file, { upsert: true, contentType: file.type });

  if (error) return { ok: false, erro: error.message };

  const { data } = sb.storage.from(BUCKET).getPublicUrl(caminho);
  return { ok: true, url: data.publicUrl };
}

export async function criarProduto(formData: FormData): Promise<ResultadoAcao> {
  if (!SUPABASE_CONFIGURED) {
    return { ok: false, erro: "Supabase não configurado. Adicione as variáveis de ambiente." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const material = String(formData.get("material") ?? "").trim();
  const precoReais = Number(formData.get("price") ?? 0);
  const stock = Number(formData.get("stock") ?? 0);
  const genero = String(formData.get("genero") ?? "unissex");
  const tipo = String(formData.get("tipo") ?? "grau");
  const cor = String(formData.get("cor") ?? "").trim();

  // Lista de URLs de imagem (enviada como JSON pelo formulário).
  let images: string[] = [];
  try {
    const raw = String(formData.get("images") ?? "[]");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) images = parsed.filter((u) => typeof u === "string");
  } catch {
    images = [];
  }

  if (!name || !code || !brand) {
    return { ok: false, erro: "Preencha nome, código e marca." };
  }

  const specs: ProductSpecs = {
    genero: genero as ProductSpecs["genero"],
    tipo: tipo as ProductSpecs["tipo"],
    ...(cor ? { cor } : {}),
  };

  const sb = createSupabaseServiceClient();
  const { error } = await sb.from("products").insert({
    slug: slugify(`${name}-${code}`),
    code,
    name,
    brand,
    material,
    price_cents: Math.round(precoReais * 100),
    stock,
    images,
    specs,
    is_active: true,
  } as never);

  if (error) return { ok: false, erro: error.message };

  revalidatePath("/admin/estoque");
  revalidatePath("/catalogo");
  return { ok: true };
}

export async function editarProduto(
  id: string,
  formData: FormData
): Promise<ResultadoAcao> {
  if (!SUPABASE_CONFIGURED) {
    return { ok: false, erro: "Supabase não configurado." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const material = String(formData.get("material") ?? "").trim();
  const precoReais = Number(formData.get("price") ?? 0);
  const stock = Number(formData.get("stock") ?? 0);
  const genero = String(formData.get("genero") ?? "unissex");
  const tipo = String(formData.get("tipo") ?? "grau");
  const cor = String(formData.get("cor") ?? "").trim();

  let images: string[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("images") ?? "[]"));
    if (Array.isArray(parsed)) images = parsed.filter((u) => typeof u === "string");
  } catch {
    images = [];
  }

  if (!name || !code || !brand) {
    return { ok: false, erro: "Preencha nome, código e marca." };
  }

  const specs: ProductSpecs = {
    genero: genero as ProductSpecs["genero"],
    tipo: tipo as ProductSpecs["tipo"],
    ...(cor ? { cor } : {}),
  };

  const sb = createSupabaseServiceClient();
  const { error } = await sb
    .from("products")
    .update({
      code,
      name,
      brand,
      material,
      price_cents: Math.round(precoReais * 100),
      stock,
      images,
      specs,
    } as never)
    .eq("id", id);

  if (error) return { ok: false, erro: error.message };

  revalidatePath("/admin/estoque");
  revalidatePath("/catalogo");
  return { ok: true };
}

export async function excluirProduto(id: string): Promise<ResultadoAcao> {
  if (!SUPABASE_CONFIGURED) {
    return { ok: false, erro: "Supabase não configurado." };
  }
  const sb = createSupabaseServiceClient();
  // Soft delete: marca inativo (preserva histórico de pedidos).
  const { error } = await sb
    .from("products")
    .update({ is_active: false } as never)
    .eq("id", id);
  if (error) return { ok: false, erro: error.message };
  revalidatePath("/admin/estoque");
  revalidatePath("/catalogo");
  return { ok: true };
}

export async function ajustarEstoque(
  id: string,
  novoEstoque: number
): Promise<ResultadoAcao> {
  if (!SUPABASE_CONFIGURED) {
    return { ok: false, erro: "Supabase não configurado." };
  }
  const sb = createSupabaseServiceClient();
  const { error } = await sb
    .from("products")
    .update({ stock: Math.max(0, novoEstoque) } as never)
    .eq("id", id);
  if (error) return { ok: false, erro: error.message };
  revalidatePath("/admin/estoque");
  return { ok: true };
}
