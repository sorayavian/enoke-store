-- ============================================================================
-- 0001 — Schema base da loja Enoke
-- Catálogo, clientes, pedidos e receitas.
-- Espelha src/lib/supabase/types.ts (Database type).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Categorias ────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);

-- ── Produtos ──────────────────────────────────────────────────────────────
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  code          text not null unique,
  name          text not null,
  brand         text not null,
  material      text not null,
  description   text,
  price_cents   integer not null check (price_cents >= 0),
  stock         integer not null default 0 check (stock >= 0),
  images        text[] not null default '{}',
  blur_data_url text,
  specs         jsonb not null default '{}'::jsonb,
  category_id   uuid references public.categories(id) on delete set null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(is_active);

-- ── Clientes ──────────────────────────────────────────────────────────────
-- id casa com auth.users.id quando o cliente cria conta (Supabase Auth).
create table if not exists public.customers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  full_name  text,
  phone      text,
  role       text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

-- ── Pedidos ───────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  customer_id       uuid not null references public.customers(id) on delete restrict,
  status            text not null default 'pending'
                      check (status in ('pending','paid','shipped','delivered','cancelled','refunded')),
  total_cents       integer not null check (total_cents >= 0),
  mp_payment_id     text,
  mp_preference_id  text,
  shipping_address  jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists orders_customer_idx on public.orders(customer_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_idx on public.orders(created_at desc);

-- ── Itens do pedido ───────────────────────────────────────────────────────
create table if not exists public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders(id) on delete cascade,
  product_id       uuid not null references public.products(id) on delete restrict,
  quantity         integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  product_snapshot jsonb not null default '{}'::jsonb
);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- ── Receitas (prescrições) ────────────────────────────────────────────────
create table if not exists public.prescriptions (
  id                 uuid primary key default gen_random_uuid(),
  customer_id        uuid not null references public.customers(id) on delete cascade,
  label              text not null,
  od_sphere          numeric,
  od_cylinder        numeric,
  od_axis            numeric,
  oe_sphere          numeric,
  oe_cylinder        numeric,
  oe_axis            numeric,
  add_value          numeric,
  pupillary_distance numeric,
  notes              text,
  created_at         timestamptz not null default now()
);
create index if not exists prescriptions_customer_idx on public.prescriptions(customer_id);

-- ── Gatilho de updated_at ─────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();
