import "server-only";

/**
 * Camada de acesso à IA (Anthropic Claude).
 *
 * Dois modos, alternados automaticamente por `IA_CONECTADA`:
 *  • Com ANTHROPIC_API_KEY  → chamadas reais ao Claude (claude-sonnet-4-6),
 *    com prompt caching no system prompt e registro em `ai_logs`.
 *  • Sem a chave            → respostas/heurísticas de demonstração (stub),
 *    para o painel funcionar sem credenciais.
 *
 * As heurísticas do stub também servem de fallback se a IA real falhar
 * (ex.: classificação/extração que precisam de resultado garantido).
 */

import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, AI_MODEL } from "@/lib/ai/system-prompt";
import { registrarAiLog } from "@/lib/ai/log";
import type { MessageClassification } from "@/lib/admin/types";

export const IA_CONECTADA = Boolean(process.env.ANTHROPIC_API_KEY);

export type HistoricoItem = { role: "user" | "assistant"; content: string };

// ── Cliente Anthropic (singleton) ─────────────────────────────────────────
let _client: Anthropic | null = null;
function anthropic(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }
  return _client;
}

// System prompt com cache: é grande e fixo, então marcamos cache_control para
// reaproveitar entre chamadas e reduzir custo/latência (TTL ~5 min).
const SYSTEM_BLOCKS: Anthropic.TextBlockParam[] = [
  {
    type: "text",
    text: SYSTEM_PROMPT,
    cache_control: { type: "ephemeral" },
  },
];

// Extrai o texto concatenado de uma resposta do Claude.
function textoDaResposta(msg: Anthropic.Message): string {
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

// ── Atendimento ao cliente ────────────────────────────────────────────────
/** Resposta de atendimento ao cliente. */
export async function gerarResposta(
  mensagem: string,
  historico: HistoricoItem[] = []
): Promise<string> {
  if (!IA_CONECTADA) {
    return (
      "Olá! Obrigada pela sua mensagem. " +
      "Posso te ajudar com modelos, lentes, prazos e agendamento de visita. " +
      "(Resposta de demonstração — conecte ANTHROPIC_API_KEY para respostas reais.)"
    );
  }

  const messages: Anthropic.MessageParam[] = [
    ...historico.map((h) => ({ role: h.role, content: h.content })),
    { role: "user" as const, content: mensagem },
  ];

  const resp = await anthropic().messages.create({
    model: AI_MODEL,
    max_tokens: 1024,
    system: SYSTEM_BLOCKS,
    messages,
  });

  await registrarAiLog({
    endpoint: "/api/ai/reply",
    module: "mensagens",
    inputTokens: resp.usage.input_tokens,
    outputTokens: resp.usage.output_tokens,
  });

  return textoDaResposta(resp);
}

// ── Classificação ─────────────────────────────────────────────────────────
const CLASSIFICACOES: MessageClassification[] = [
  "reclamacao",
  "avaliacao",
  "pergunta",
  "intencao_compra",
];

// Heurística simples (stub + fallback): por palavras-chave.
function classificarHeuristica(mensagem: string): MessageClassification {
  const m = mensagem.toLowerCase();
  if (/(ruim|riscad|defeito|reclama|quebr|errad|atras|demor)/.test(m)) return "reclamacao";
  if (/(obrigad|excelente|amei|ótimo|otimo|parab|maravilh|perfeito)/.test(m)) return "avaliacao";
  if (/(comprar|quero|preço|preco|valor|disponível|disponivel|ainda tem)/.test(m))
    return "intencao_compra";
  return "pergunta";
}

/** Classifica a mensagem do cliente. */
export async function classificar(
  mensagem: string
): Promise<MessageClassification> {
  if (!IA_CONECTADA) return classificarHeuristica(mensagem);

  try {
    const resp = await anthropic().messages.create({
      model: AI_MODEL,
      max_tokens: 16,
      system: [
        {
          type: "text",
          text:
            "Você classifica mensagens de clientes de uma ótica em EXATAMENTE uma categoria. " +
            "Responda SOMENTE com uma destas palavras, sem pontuação: " +
            "reclamacao, avaliacao, pergunta, intencao_compra.",
        },
      ],
      messages: [{ role: "user", content: mensagem }],
    });

    await registrarAiLog({
      endpoint: "/api/ai/classify",
      module: "mensagens",
      inputTokens: resp.usage.input_tokens,
      outputTokens: resp.usage.output_tokens,
    });

    const bruto = textoDaResposta(resp).toLowerCase().replace(/[^a-z_]/g, "");
    const achado = CLASSIFICACOES.find((c) => bruto.includes(c));
    return achado ?? classificarHeuristica(mensagem);
  } catch (e) {
    console.error("[ai/classificar] fallback heurístico:", (e as Error).message);
    return classificarHeuristica(mensagem);
  }
}

// ── Extração de intenção (modelo de produto mencionado) ───────────────────
const MODELOS = ["Aurora", "Lume", "Volta", "Siena", "Orto", "Mira", "Petra", "Alba", "Porto", "Nido"];

function extrairHeuristica(mensagem: string): { modelo: string | null } {
  const achado = MODELOS.find((m) => mensagem.toLowerCase().includes(m.toLowerCase()));
  return { modelo: achado ?? null };
}

/** Extrai o nome de um modelo de produto mencionado na mensagem. */
export async function extrairIntencao(
  mensagem: string
): Promise<{ modelo: string | null }> {
  if (!IA_CONECTADA) return extrairHeuristica(mensagem);

  try {
    const resp = await anthropic().messages.create({
      model: AI_MODEL,
      max_tokens: 24,
      system: [
        {
          type: "text",
          text:
            "Você identifica se a mensagem menciona um modelo de óculos da ótica. " +
            `Modelos conhecidos: ${MODELOS.join(", ")}. ` +
            "Responda SOMENTE com o nome do modelo (ex.: Aurora) ou a palavra NENHUM. " +
            "Pode ser um modelo de outra marca (ex.: Ray-Ban Wayfarer) — nesse caso responda o nome citado.",
        },
      ],
      messages: [{ role: "user", content: mensagem }],
    });

    await registrarAiLog({
      endpoint: "/api/ai/extract-intent",
      module: "mensagens",
      inputTokens: resp.usage.input_tokens,
      outputTokens: resp.usage.output_tokens,
    });

    const bruto = textoDaResposta(resp).replace(/[.\n]/g, "").trim();
    if (!bruto || /^nenhum$/i.test(bruto)) return { modelo: null };
    return { modelo: bruto };
  } catch (e) {
    console.error("[ai/extrairIntencao] fallback heurístico:", (e as Error).message);
    return extrairHeuristica(mensagem);
  }
}

// ── Descrição de produto ──────────────────────────────────────────────────
export type DadosProduto = {
  nome: string;
  marca?: string;
  material?: string;
  genero?: string;
  tipo?: string;
  cor?: string;
};

/** Gera uma descrição de produto de ótica. */
export async function gerarDescricao(dados: DadosProduto): Promise<string> {
  if (IA_CONECTADA) {
    try {
      const resp = await anthropic().messages.create({
        model: AI_MODEL,
        max_tokens: 400,
        system: SYSTEM_BLOCKS,
        messages: [
          {
            role: "user",
            content:
              "Escreva uma descrição comercial curta (2 a 4 frases), elegante e em pt-BR, " +
              "para a página deste produto de ótica. Não invente preço nem disponibilidade.\n" +
              `Dados: ${JSON.stringify(dados)}`,
          },
        ],
      });

      await registrarAiLog({
        endpoint: "/api/ai/gerar-descricao",
        module: "instagram",
        inputTokens: resp.usage.input_tokens,
        outputTokens: resp.usage.output_tokens,
      });

      const texto = textoDaResposta(resp);
      if (texto) return texto;
    } catch (e) {
      console.error("[ai/gerarDescricao] fallback modelo:", (e as Error).message);
    }
  }

  // ── Descrição-modelo (sem IA real / fallback) ──
  const tipoTxt =
    dados.tipo === "sol"
      ? "óculos de sol"
      : dados.tipo === "ambos"
      ? "armação versátil para grau e solar"
      : "óculos de grau";
  const generoTxt =
    dados.genero === "feminino"
      ? "feminino"
      : dados.genero === "masculino"
      ? "masculino"
      : "unissex";

  const partes: string[] = [];
  partes.push(
    `${dados.nome}${dados.marca ? `, da ${dados.marca},` : ""} é um modelo de ${tipoTxt} de design ${generoTxt}.`
  );
  if (dados.material) {
    partes.push(
      `Confeccionado em ${dados.material.toLowerCase()}, alia leveza, conforto e durabilidade para o uso diário.`
    );
  }
  if (dados.cor) {
    partes.push(`Disponível na cor ${dados.cor.toLowerCase()}, combina com diferentes estilos e ocasiões.`);
  }
  partes.push(
    "Acompanha garantia da ótica e pode receber lentes sob medida conforme sua receita. Compre pelo site com entrega para todo o Brasil."
  );
  return partes.join(" ");
}

// ── Monitor de erros do site ──────────────────────────────────────────────
type Problema = {
  type: string;
  path: string;
  description: string;
  severity: "baixa" | "media" | "alta";
};

function monitorarHeuristica(eventos: { type: string; path: string }[]): Problema[] {
  return eventos.map((e) => ({
    type: e.type,
    path: e.path,
    description: `Evento ${e.type} detectado em ${e.path}.`,
    severity: e.type === "checkout_falha" ? "alta" : e.type === "404" ? "baixa" : "media",
  }));
}

/** Analisa eventos do site e retorna problemas detectados. */
export async function monitorar(
  eventos: { type: string; path: string }[]
): Promise<Problema[]> {
  if (!IA_CONECTADA || eventos.length === 0) return monitorarHeuristica(eventos);

  try {
    const resp = await anthropic().messages.create({
      model: AI_MODEL,
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text:
            "Você monitora a saúde de um e-commerce de ótica. Recebe eventos do site e " +
            "retorna problemas priorizados. Responda SOMENTE com um array JSON, sem texto ao redor, " +
            'no formato: [{"type": string, "path": string, "description": string em pt-BR, ' +
            '"severity": "baixa"|"media"|"alta"}]. ' +
            "Use 'alta' para falhas de checkout/pagamento, 'media' para imagens/erros de servidor, 'baixa' para 404 isolados.",
        },
      ],
      messages: [{ role: "user", content: JSON.stringify(eventos) }],
    });

    await registrarAiLog({
      endpoint: "/api/ai/monitor",
      module: "monitor",
      inputTokens: resp.usage.input_tokens,
      outputTokens: resp.usage.output_tokens,
    });

    const bruto = textoDaResposta(resp);
    const inicio = bruto.indexOf("[");
    const fim = bruto.lastIndexOf("]");
    if (inicio !== -1 && fim !== -1) {
      const parsed = JSON.parse(bruto.slice(inicio, fim + 1)) as Problema[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
    return monitorarHeuristica(eventos);
  } catch (e) {
    console.error("[ai/monitorar] fallback heurístico:", (e as Error).message);
    return monitorarHeuristica(eventos);
  }
}
