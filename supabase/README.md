# Banco de dados (Supabase) — Enoke

Migrations e seed da loja + painel admin + IA de mensagens.

## Ordem de aplicação

```
migrations/0001_schema_base.sql      →  catálogo, clientes, pedidos, receitas
migrations/0002_admin_ia.sql         →  conversas, mensagens, erros, ai_logs, estoque, instagram
migrations/0003_rls.sql              →  Row Level Security + policies
migrations/0000_fix_constraints.sql  →  (só se o banco já tinha tabelas) adiciona UNIQUE faltantes
seed.sql                             →  dados iniciais reais (idempotente, sem ON CONFLICT)
```

> **0000_fix_constraints** roda DEPOIS das 0001–0003 e ANTES do seed. É
> necessário quando o banco já tinha tabelas criadas sem as constraints UNIQUE
> (ex.: produtos de teste antigos). Remove duplicatas e adiciona as constraints.
> Se o banco estava limpo, pode pular — mas rodá-lo não causa dano.

## Como aplicar

### Opção A — SQL Editor (mais simples)

1. Acesse o painel do Supabase → **SQL Editor**.
2. Cole e rode, **nesta ordem**, o conteúdo de cada arquivo acima.
3. Confira em **Table Editor** se as tabelas e os dados apareceram.

### Opção B — Supabase CLI

```bash
# na raiz de enoke-store, com a CLI logada e o projeto linkado:
supabase db push                 # aplica as migrations da pasta migrations/
supabase db execute -f supabase/seed.sql
```

## Qual projeto?

O app usa o projeto definido em `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`).
**Aplique as migrations no MESMO projeto** que está nesse arquivo — senão o
site segue lendo de outro banco.

> O seed é **idempotente** (usa `ON CONFLICT` / checagens). Pode rodar de novo
> sem duplicar dados.

## O que o app faz sem banco

Se as variáveis do Supabase não estiverem definidas, a loja e o painel caem
automaticamente para dados de exemplo (`src/lib/admin/mock.ts` e
`src/lib/mock/products.ts`) — nada quebra. Ao preencher as variáveis e aplicar
as migrations, as páginas passam a ler do banco real sem mudar código.

## Tabelas

| Tabela | Origem | Usada em |
|---|---|---|
| `categories`, `products` | catálogo | loja + /admin/estoque |
| `customers`, `orders`, `order_items`, `prescriptions` | clientes/vendas | /admin/pedidos, /admin/clientes, /cliente |
| `conversations`, `messages` | IA de mensagens | /admin/mensagens, dashboard |
| `site_errors` | monitor | /admin/monitor |
| `ai_logs` | custo/uso da IA | /admin/monitor (preenchida automaticamente pela IA real) |
| `stock_alerts` | estoque baixo | dashboard, /admin/estoque |
| `instagram_posts`, `instagram_metrics` | Instagram | /admin/instagram |

## Função `confirm_order_payment(order_id, payment_id)`

Chamada pelo webhook do Mercado Pago: marca o pedido como `paid` e baixa o
estoque dos itens de forma atômica.
