# Painel Administrativo + IA — ENOKE

Painel administrativo da ótica integrado ao site `enoke-store`, com sistema de IA
de mensagens, módulo de Instagram e gestão da loja. Construído sobre o mesmo
Next.js 14 (App Router), Tailwind e design system (`bone/ink/amber`) do site.

> **Estado atual:** telas completas e navegáveis com **dados de exemplo (mock)**.
> As integrações externas (Anthropic, Supabase, WhatsApp, Instagram, DALL-E)
> estão como **stubs** prontos para receber as credenciais reais.

## Como rodar

```bash
npm install
npm run dev      # http://localhost:3000 (ou 3001 se a porta estiver ocupada)
```

Acesse `/admin` (redireciona para `/admin/dashboard`).

## Estrutura

```
src/
├── app/
│   ├── (loja)/              # site público (home, catálogo, produto, carrinho, checkout, cliente)
│   ├── admin/               # PAINEL — chrome próprio (sidebar + topbar)
│   │   ├── dashboard/       # KPIs + gráficos + resumo da IA
│   │   ├── mensagens/       # caixa unificada WA+IG, tags, toggle IA, estatísticas
│   │   ├── relatorios/      # vendas, modelos buscados, reclamações, exportar CSV
│   │   ├── monitor/         # erros do site + logs e custos de IA
│   │   ├── instagram/       # visão geral, novo-post, scanner, relatórios
│   │   ├── estoque/         # controle de estoque + alertas
│   │   ├── pedidos/         # gestão de pedidos
│   │   ├── clientes/        # base de clientes
│   │   ├── configuracoes/   # dados da ótica + comportamento da IA
│   │   └── login/           # tela de login (sem chrome)
│   └── api/
│       ├── ai/              # reply, classify, extract-intent, monitor, gerar-legenda
│       └── webhooks/        # whatsapp, instagram
├── components/admin/        # Sidebar, Topbar, MobileNav, AdminShell, charts, ui, InstagramSubnav
├── lib/admin/               # types.ts, mock.ts, labels.ts (dados e rótulos do painel)
└── lib/ai/                  # client.ts (stub) + system-prompt.ts (especialista em ótica)
```

## Segurança / acesso restrito ao dono

O acesso ao `/admin` é controlado por `src/middleware.ts`:

- **Dev (padrão):** `ADMIN_PROTECTION_ENABLED=false` → painel liberado para construir/navegar.
- **Produção:** defina `ADMIN_PROTECTION_ENABLED=true`. Sem sessão de admin válida,
  `/admin/*` redireciona para `/admin/login`.

Para ativar a autenticação real (Supabase Auth + role `admin`):

1. Adicionar coluna `role` na tabela `customers` (`'admin' | 'customer'`).
2. Descomentar o bloco de integração no `middleware.ts` (já preparado com `@supabase/ssr`).
3. Implementar o login em `/admin/login` com Supabase Auth.

## Conectar as integrações reais

| Integração | Onde plugar | Variável(is) |
|---|---|---|
| IA (Claude) | `src/lib/ai/client.ts` | `ANTHROPIC_API_KEY` |
| WhatsApp | `src/app/api/webhooks/whatsapp/route.ts` | `WHATSAPP_API_URL`, `WHATSAPP_API_TOKEN` |
| Instagram | `src/app/api/webhooks/instagram/route.ts` | `META_GRAPH_TOKEN`, `IG_VERIFY_TOKEN` |
| Imagens (DALL-E) | `/api/ai/gerar-legenda` (e futura `gerar-imagem`) | `OPENAI_API_KEY` |
| Banco de dados | trocar `lib/admin/mock.ts` por queries Supabase | já configurado em `lib/supabase/*` |

Hoje `IA_CONECTADA` (em `lib/ai/client.ts`) detecta automaticamente a presença da
`ANTHROPIC_API_KEY` e alterna entre stub e a implementação real.

## Novas tabelas previstas (Supabase)

Os tipos já estão em `src/lib/admin/types.ts`, prontos para virar migrations:
`messages`, `conversations`, `site_errors`, `ai_logs`, `instagram_posts`,
`instagram_metrics`, `instagram_reports`, `scanned_glasses`, `stock_alerts`,
`automation_logs`, `ai_costs`.
