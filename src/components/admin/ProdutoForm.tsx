"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Link2, X, Loader2, Sparkles } from "lucide-react";
import { Card, CardTitle } from "@/components/admin/ui";
import {
  criarProduto,
  editarProduto,
  uploadImagem,
  sugerirDescricao,
} from "@/app/admin/estoque/actions";
import type { Product } from "@/lib/supabase/types";

const inputCls =
  "w-full rounded-md border border-mist bg-bone px-3 py-2 text-sm text-ink placeholder:text-stone-300 focus:border-amber/50 focus:outline-none";

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-stone-500">{label}</span>
      {children}
    </label>
  );
}

// Formulário reutilizado para criar (sem `produto`) e editar (com `produto`).
export function ProdutoForm({ produto }: { produto?: Product }) {
  const router = useRouter();
  const editando = Boolean(produto);
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  const [imagens, setImagens] = useState<string[]>(produto?.images ?? []);
  const [enviando, setEnviando] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  // Descrição (controlada, para a IA poder preencher).
  const [descricao, setDescricao] = useState(produto?.description ?? "");
  const [sugerindo, setSugerindo] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function sugerirComIA() {
    const form = formRef.current;
    if (!form) return;
    const val = (n: string) =>
      (form.elements.namedItem(n) as HTMLInputElement | HTMLSelectElement | null)?.value ?? "";
    const nome = val("name").trim();
    if (!nome) {
      setErro("Preencha o nome do produto antes de sugerir a descrição.");
      return;
    }
    setErro(null);
    setSugerindo(true);
    const r = await sugerirDescricao({
      nome,
      marca: val("brand"),
      material: val("material"),
      genero: val("genero"),
      tipo: val("tipo"),
      cor: val("cor"),
    });
    setSugerindo(false);
    if (r.ok && r.descricao) setDescricao(r.descricao);
    else setErro(r.erro ?? "Não foi possível gerar a descrição.");
  }

  async function aoEscolherArquivos(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(e.target.files ?? []);
    if (!arquivos.length) return;
    setErro(null);
    setEnviando(true);
    for (const arquivo of arquivos) {
      const fd = new FormData();
      fd.append("file", arquivo);
      const r = await uploadImagem(fd);
      if (r.ok && r.url) setImagens((a) => [...a, r.url!]);
      else setErro(r.erro ?? "Falha no upload da imagem.");
    }
    setEnviando(false);
    e.target.value = "";
  }

  function adicionarUrl() {
    const u = urlInput.trim();
    if (u) {
      setImagens((a) => [...a, u]);
      setUrlInput("");
    }
  }

  function removerImagem(i: number) {
    setImagens((a) => a.filter((_, idx) => idx !== i));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    const fd = new FormData(e.currentTarget);
    fd.set("images", JSON.stringify(imagens));
    startTransition(async () => {
      const r = produto
        ? await editarProduto(produto.id, fd)
        : await criarProduto(fd);
      if (r.ok) {
        router.push("/admin/estoque");
        router.refresh();
      } else {
        setErro(r.erro ?? "Erro ao salvar.");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardTitle>Dados do produto</CardTitle>
        <div className="space-y-4">
          <Campo label="Nome *">
            <input name="name" className={inputCls} placeholder="Ex.: Aurora" defaultValue={produto?.name} required />
          </Campo>
          <Campo label="Código *">
            <input name="code" className={inputCls} placeholder="Ex.: ENK-011" defaultValue={produto?.code} required />
          </Campo>
          <Campo label="Marca *">
            <input name="brand" className={inputCls} placeholder="Ex.: Enoke Atelier" defaultValue={produto?.brand} required />
          </Campo>
          <Campo label="Material">
            <input name="material" className={inputCls} placeholder="Ex.: Acetato italiano" defaultValue={produto?.material} />
          </Campo>
        </div>
      </Card>

      <Card>
        <CardTitle>Preço, estoque e características</CardTitle>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Preço (R$)">
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                className={inputCls}
                placeholder="1890.00"
                defaultValue={produto ? (produto.price_cents / 100).toFixed(2) : ""}
              />
            </Campo>
            <Campo label="Estoque">
              <input name="stock" type="number" min="0" className={inputCls} placeholder="10" defaultValue={produto?.stock ?? ""} />
            </Campo>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Gênero">
              <select name="genero" className={inputCls} defaultValue={produto?.specs?.genero ?? "unissex"}>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
                <option value="unissex">Unissex</option>
              </select>
            </Campo>
            <Campo label="Tipo">
              <select name="tipo" className={inputCls} defaultValue={produto?.specs?.tipo ?? "grau"}>
                <option value="grau">Grau</option>
                <option value="sol">Sol</option>
                <option value="ambos">Ambos</option>
              </select>
            </Campo>
          </div>
          <Campo label="Cor">
            <input name="cor" className={inputCls} placeholder="Ex.: grafite" defaultValue={produto?.specs?.cor ?? ""} />
          </Campo>

          <div>
            <p className="mb-1.5 text-sm text-stone-500">Medidas (mm)</p>
            <div className="grid grid-cols-3 gap-3">
              <Campo label="Lente">
                <input
                  name="largura_lente"
                  type="number"
                  min="0"
                  className={inputCls}
                  placeholder="52"
                  defaultValue={produto?.specs?.largura_lente ?? ""}
                />
              </Campo>
              <Campo label="Ponte">
                <input
                  name="ponte"
                  type="number"
                  min="0"
                  className={inputCls}
                  placeholder="18"
                  defaultValue={produto?.specs?.ponte ?? ""}
                />
              </Campo>
              <Campo label="Haste">
                <input
                  name="haste"
                  type="number"
                  min="0"
                  className={inputCls}
                  placeholder="140"
                  defaultValue={produto?.specs?.haste ?? ""}
                />
              </Campo>
            </div>
            <p className="mt-1 text-xs text-stone-300">
              Padrão impresso na haste: largura da lente □ ponte − haste.
            </p>
          </div>
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <CardTitle
          action={
            <button
              type="button"
              onClick={sugerirComIA}
              disabled={sugerindo}
              className="flex items-center gap-1.5 rounded-md border border-amber/50 px-3 py-1.5 text-xs text-amber-soft transition-colors hover:bg-amber/10 disabled:opacity-60"
            >
              {sugerindo ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              {sugerindo ? "Gerando…" : "Sugerir com IA"}
            </button>
          }
        >
          Descrição
        </CardTitle>
        <textarea
          name="description"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={4}
          placeholder="Descreva o produto, ou clique em 'Sugerir com IA' para gerar automaticamente a partir dos dados acima."
          className="w-full resize-none rounded-md border border-mist bg-bone px-3 py-2 text-sm text-ink placeholder:text-stone-300 focus:border-amber/50 focus:outline-none"
        />
        <p className="mt-1.5 text-xs text-stone-300">
          A IA usa nome, marca, material, gênero e tipo para sugerir. Você pode
          editar livremente o texto gerado.
        </p>
      </Card>

      <Card className="lg:col-span-2">
        <CardTitle>Imagens do produto</CardTitle>

        {imagens.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3">
            {imagens.map((url, i) => (
              <div key={`${url}-${i}`} className="relative h-24 w-24 overflow-hidden rounded-md border border-mist bg-bone">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Imagem ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removerImagem(i)}
                  className="absolute right-1 top-1 rounded-full bg-bone/80 p-0.5 text-ink hover:bg-danger hover:text-ink-deep"
                  aria-label="Remover imagem"
                >
                  <X size={14} />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-amber/80 text-center text-[10px] text-bone">
                    capa
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-mist bg-bone px-4 py-6 text-sm text-stone-300 transition-colors hover:border-amber/50">
            {enviando ? (
              <Loader2 size={22} className="animate-spin text-amber-soft" />
            ) : (
              <Upload size={22} strokeWidth={1.5} />
            )}
            <span>{enviando ? "Enviando…" : "Enviar do computador"}</span>
            <span className="text-xs">JPG/PNG até 5 MB · pode escolher várias</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={aoEscolherArquivos} disabled={enviando} />
          </label>

          <div className="flex-1">
            <div className="mb-1.5 flex items-center gap-1.5 text-sm text-stone-500">
              <Link2 size={14} /> Ou cole o link de uma imagem
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..."
                className={inputCls}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    adicionarUrl();
                  }
                }}
              />
              <button
                type="button"
                onClick={adicionarUrl}
                className="shrink-0 rounded-md border border-mist px-3 text-sm text-ink hover:border-amber/50"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-3 lg:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-amber px-5 py-2.5 text-sm font-medium text-bone transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Salvando…" : editando ? "Salvar alterações" : "Cadastrar produto"}
        </button>
        {erro && <span className="text-sm text-danger">{erro}</span>}
      </div>
    </form>
  );
}
