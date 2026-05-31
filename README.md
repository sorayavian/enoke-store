# ENOKE EWEYEAR STORE

E-commerce de óculos autorais — Next.js 14 + Supabase + Mercado Pago.

> **Estética:** luxo minimalista — fundo branco quente, paleta neutra, bronze âmbar como único acento. Tipografia: Cormorant Garamond (display) + Manrope (sans).
> **Status:** Fases 0–8 concluídas localmente. Fase 9 (conexão de contas externas e deploy) pendente.

---

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** com tokens custom (ver [tailwind.config.ts](tailwind.config.ts))
- **Supabase** (Postgres + Auth + Storage) — schema em [supabase/migrations/](supabase/migrations/)
- **Mercado Pago** (Pix + cartão) — checkout em [src/app/api/checkout/route.ts](src/app/api/checkout/route.ts)
- **Zustand** para carrinho persistido em localStorage
- **Zod** para validação em todos os boundaries de servidor

---

## Como rodar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra http://localhost:3000. O site funciona **sem credenciais** — produtos vêm de `src/lib/mock/products.ts`. Migrations e clientes Supabase prontos para a Fase 9.

---

## Roadmap

| Fase | Status | Entrega |
|---|---|---|
| 0  | ✅ | Arquitetura + design system |
| 1  | ✅ | Scaffold + layout raiz + WhatsApp FAB |
| 2  | ✅ | Schema SQL + RLS + tipos TS + seed + mocks |
| 3  | ✅ | Home (hero, destaques, categorias, manifesto) |
| 4  | ✅ | `/catalogo` com filtros server-side |
| 5  | ✅ | `/produto/[slug]` com galeria + JSON-LD + ISR |
| 6  | ✅ | Carrinho + páginas auth + `/cliente` |
| 7  | ✅ | Checkout stub + páginas de retorno + esqueleto webhook |
| 8  | ✅ | sitemap, robots, 404, headers de segurança, README |
| 9  | ⏳ | **Criar contas** Supabase/MP/Vercel, plugar credenciais reais, deploy |

---

## O que falta para produção (Fase 9)

1. Criar projeto Supabase (região São Paulo) → rodar `supabase/migrations/*.sql` no SQL Editor + `supabase/seed.sql`.
2. Subir imagens reais para o bucket `products/` (substituir placeholders SVG).
3. Trocar `src/lib/data/products.ts` para consultar via `createSupabaseServerClient()` em vez dos mocks.
4. Habilitar Supabase Auth nas páginas `/login`, `/signup`, `/cliente` (server actions + middleware).
5. Criar app no Mercado Pago → preencher `MERCADOPAGO_ACCESS_TOKEN` e `MERCADOPAGO_WEBHOOK_SECRET`.
6. Substituir o STUB em `/api/checkout/route.ts` pelo SDK do MP (criar `Preference` real).
7. Completar `/api/webhooks/mercadopago/route.ts` para chamar a RPC `confirm_order_payment`.
8. Trocar o número do WhatsApp placeholder em `NEXT_PUBLIC_WHATSAPP_NUMBER`.
9. Deploy na Vercel → conectar repo, configurar env vars, deploy.
10. Rate limiting em `/api/checkout` (Vercel KV / Upstash).

---

## Segurança aplicada

- `import "server-only"` em arquivos que tocam `SUPABASE_SERVICE_ROLE_KEY`.
- RLS habilitada em todas as tabelas em [supabase/migrations/0002_rls.sql](supabase/migrations/0002_rls.sql).
- Preço de checkout **recalculado no servidor** — payload do client é ignorado.
- Webhook MP valida assinatura HMAC-SHA256 com `timingSafeEqual`.
- Headers globais: `X-Frame-Options: DENY`, HSTS, Referrer-Policy, Permissions-Policy.
- Validação Zod em todos os route handlers.

---

## Design

[docs/design-system.md](../docs/design-system.md) — tokens completos.
[docs/architecture.md](../docs/architecture.md) — diagramas e decisões.

Princípio inegociável: ≥80% da tela é `bone`/`paper`, ~15% é tipografia em `ink`/`stone`, **≤5%** é `amber`.
