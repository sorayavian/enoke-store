-- ENOKE — tabelas do painel administrativo e sistema de IA
-- (mensagens, conversas, monitor, logs de IA, Instagram, alertas)

-- ─────────────────────────── conversations
create table if not exists public.conversations (
  id                uuid primary key default uuid_generate_v4(),
  source            text not null check (source in ('wa','ig')),
  customer_contact  text not null,
  customer_name     text,
  status            text not null default 'open' check (status in ('open','resolved','escalated')),
  ai_enabled        boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists conversations_source_idx on public.conversations (source);
create index if not exists conversations_status_idx on public.conversations (status);

-- ─────────────────────────── messages
create table if not exists public.messages (
  id                uuid primary key default uuid_generate_v4(),
  conversation_id   uuid references public.conversations(id) on delete cascade,
  source            text not null check (source in ('wa','ig')),
  customer_contact  text not null,
  content           text not null,
  direction         text not null check (direction in ('in','out')),
  classification    text check (classification in ('reclamacao','avaliacao','pergunta','intencao_compra')),
  ai_generated      boolean not null default false,
  created_at        timestamptz not null default now()
);
create index if not exists messages_conversation_idx on public.messages (conversation_id);
create index if not exists messages_created_idx on public.messages (created_at);

-- ─────────────────────────── site_errors (monitor)
create table if not exists public.site_errors (
  id           uuid primary key default uuid_generate_v4(),
  type         text not null,
  path         text not null,
  description  text not null,
  severity     text not null default 'media' check (severity in ('baixa','media','alta')),
  detected_at  timestamptz not null default now(),
  resolved     boolean not null default false
);

-- ─────────────────────────── ai_logs / ai_costs
create table if not exists public.ai_logs (
  id            uuid primary key default uuid_generate_v4(),
  endpoint      text not null,
  module        text not null,
  input_tokens  integer not null default 0,
  output_tokens integer not null default 0,
  cost_usd      numeric(10,5) not null default 0,
  created_at    timestamptz not null default now()
);

-- ─────────────────────────── instagram_posts
create table if not exists public.instagram_posts (
  id            uuid primary key default uuid_generate_v4(),
  type          text not null check (type in ('foto_produto','dica_saude','tendencia','promocao')),
  caption       text not null,
  hashtags      text[] not null default '{}',
  image_url     text,
  video_url     text,
  product_id    uuid references public.products(id) on delete set null,
  scheduled_at  timestamptz,
  published_at  timestamptz,
  status        text not null default 'draft' check (status in ('draft','scheduled','published','failed')),
  ig_post_id    text,
  created_at    timestamptz not null default now()
);
create index if not exists instagram_posts_status_idx on public.instagram_posts (status);

-- ─────────────────────────── instagram_metrics
create table if not exists public.instagram_metrics (
  id                uuid primary key default uuid_generate_v4(),
  post_id           uuid references public.instagram_posts(id) on delete cascade,
  likes             integer not null default 0,
  comments          integer not null default 0,
  saves             integer not null default 0,
  reach             integer not null default 0,
  direct_messages   integer not null default 0,
  followers_gained  integer not null default 0,
  collected_at      timestamptz not null default now()
);

-- ─────────────────────────── stock_alerts
create table if not exists public.stock_alerts (
  id                uuid primary key default uuid_generate_v4(),
  product_id        uuid references public.products(id) on delete cascade,
  min_quantity      integer not null,
  current_quantity  integer not null,
  alerted_at        timestamptz not null default now()
);

-- ─────────────────────────── role de admin em customers
-- Usado pelo middleware para liberar /admin apenas ao dono.
alter table public.customers
  add column if not exists role text not null default 'customer'
  check (role in ('customer','admin'));
