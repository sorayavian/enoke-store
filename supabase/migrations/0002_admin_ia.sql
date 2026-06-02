-- ============================================================================
-- 0002 — Painel administrativo + IA de mensagens
-- conversations, messages, site_errors, ai_logs, stock_alerts,
-- instagram_posts, instagram_metrics + função confirm_order_payment.
-- Espelha src/lib/admin/types.ts e src/lib/supabase/types.ts.
-- ============================================================================

-- ── Conversas (caixa unificada WhatsApp + Instagram) ──────────────────────
create table if not exists public.conversations (
  id               uuid primary key default gen_random_uuid(),
  source           text not null check (source in ('wa','ig')),
  customer_contact text not null,                       -- telefone (WA) ou @ (IG)
  customer_name    text,
  status           text not null default 'open' check (status in ('open','resolved','escalated')),
  ai_enabled       boolean not null default true,       -- resposta automática da IA por conversa
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (source, customer_contact)
);
create index if not exists conversations_status_idx on public.conversations(status);
create index if not exists conversations_updated_idx on public.conversations(updated_at desc);

-- ── Mensagens ─────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid references public.conversations(id) on delete cascade,
  source           text not null check (source in ('wa','ig')),
  customer_contact text not null,
  content          text not null,
  direction        text not null check (direction in ('in','out')),  -- recebida | enviada
  classification   text check (classification in ('reclamacao','avaliacao','pergunta','intencao_compra')),
  ai_generated     boolean not null default false,      -- resposta gerada pela IA (só direction 'out')
  created_at       timestamptz not null default now()
);
create index if not exists messages_conversation_idx on public.messages(conversation_id);
create index if not exists messages_created_idx on public.messages(created_at);
create index if not exists messages_classification_idx on public.messages(classification);

-- ── Erros do site (monitor) ───────────────────────────────────────────────
create table if not exists public.site_errors (
  id          uuid primary key default gen_random_uuid(),
  type        text not null,                            -- 404 | checkout_falha | imagem_faltando | erro_servidor | outro
  path        text not null,
  description text not null,
  severity    text not null default 'media' check (severity in ('baixa','media','alta')),
  detected_at timestamptz not null default now(),
  resolved    boolean not null default false
);
create index if not exists site_errors_resolved_idx on public.site_errors(resolved);
create index if not exists site_errors_detected_idx on public.site_errors(detected_at desc);

-- ── Logs de IA (tokens e custo por chamada) ───────────────────────────────
create table if not exists public.ai_logs (
  id            uuid primary key default gen_random_uuid(),
  endpoint      text not null,                          -- /api/ai/reply, /api/ai/classify, ...
  module        text not null,                          -- mensagens | instagram | monitor | scanner
  input_tokens  integer not null default 0,
  output_tokens integer not null default 0,
  cost_usd      numeric not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists ai_logs_created_idx on public.ai_logs(created_at desc);
create index if not exists ai_logs_module_idx on public.ai_logs(module);

-- ── Alertas de estoque baixo ──────────────────────────────────────────────
create table if not exists public.stock_alerts (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid references public.products(id) on delete cascade,
  min_quantity     integer not null,
  current_quantity integer not null,
  alerted_at       timestamptz not null default now()
);
create index if not exists stock_alerts_product_idx on public.stock_alerts(product_id);

-- ── Instagram: posts ──────────────────────────────────────────────────────
create table if not exists public.instagram_posts (
  id           uuid primary key default gen_random_uuid(),
  type         text not null check (type in ('foto_produto','dica_saude','tendencia','promocao')),
  caption      text not null,
  hashtags     text[] not null default '{}',
  image_url    text,
  video_url    text,
  product_id   uuid references public.products(id) on delete set null,
  scheduled_at timestamptz,
  published_at timestamptz,
  status       text not null default 'draft' check (status in ('draft','scheduled','published','failed')),
  ig_post_id   text,
  created_at   timestamptz not null default now()
);
create index if not exists instagram_posts_status_idx on public.instagram_posts(status);

-- ── Instagram: métricas ───────────────────────────────────────────────────
create table if not exists public.instagram_metrics (
  id               uuid primary key default gen_random_uuid(),
  post_id          uuid references public.instagram_posts(id) on delete cascade,
  likes            integer not null default 0,
  comments         integer not null default 0,
  saves            integer not null default 0,
  reach            integer not null default 0,
  direct_messages  integer not null default 0,
  followers_gained integer not null default 0,
  collected_at     timestamptz not null default now()
);
create index if not exists instagram_metrics_post_idx on public.instagram_metrics(post_id);

-- ── Atualiza updated_at das conversas a cada nova mensagem ─────────────────
create or replace function public.touch_conversation()
returns trigger language plpgsql as $$
begin
  update public.conversations
     set updated_at = now()
   where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists messages_touch_conversation on public.messages;
create trigger messages_touch_conversation
  after insert on public.messages
  for each row execute function public.touch_conversation();

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

-- ── Confirmação de pagamento (chamada pelo webhook do Mercado Pago) ────────
-- Marca o pedido como pago e baixa o estoque dos itens, de forma atômica.
create or replace function public.confirm_order_payment(
  p_order_id uuid,
  p_payment_id text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.orders
     set status = 'paid',
         mp_payment_id = p_payment_id,
         updated_at = now()
   where id = p_order_id
     and status = 'pending';

  -- Baixa de estoque conforme os itens do pedido.
  update public.products p
     set stock = greatest(p.stock - oi.quantity, 0)
    from public.order_items oi
   where oi.order_id = p_order_id
     and oi.product_id = p.id;
end;
$$;
