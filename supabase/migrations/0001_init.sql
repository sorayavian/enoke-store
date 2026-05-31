-- ENOKE EWEYEAR STORE — schema inicial
-- Roda em qualquer instância Postgres (local via `supabase start` ou hosted)

create extension if not exists "uuid-ossp";

-- ─────────────────────────── categories
create table if not exists public.categories (
  id          uuid primary key default uuid_generate_v4(),
  slug        text not null unique,
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────── products
create table if not exists public.products (
  id              uuid primary key default uuid_generate_v4(),
  slug            text not null unique,
  code            text not null unique,
  name            text not null,
  brand           text not null,
  material        text not null,
  price_cents     integer not null check (price_cents >= 0),
  stock           integer not null default 0 check (stock >= 0),
  images          text[] not null default '{}',
  blur_data_url   text,
  specs           jsonb not null default '{}'::jsonb,
  category_id     uuid references public.categories(id) on delete set null,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists products_brand_idx on public.products (brand);
create index if not exists products_price_idx on public.products (price_cents);
create index if not exists products_specs_idx on public.products using gin (specs);
create index if not exists products_active_idx on public.products (is_active) where is_active = true;

-- ─────────────────────────── customers (espelha auth.users)
create table if not exists public.customers (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  phone       text,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────── orders
create table if not exists public.orders (
  id              uuid primary key default uuid_generate_v4(),
  customer_id     uuid not null references public.customers(id) on delete restrict,
  status          text not null default 'pending'
                  check (status in ('pending','paid','shipped','delivered','cancelled','refunded')),
  total_cents     integer not null check (total_cents >= 0),
  mp_payment_id   text unique,
  mp_preference_id text,
  shipping_address jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists orders_customer_idx on public.orders (customer_id);
create index if not exists orders_status_idx on public.orders (status);

-- ─────────────────────────── order_items
create table if not exists public.order_items (
  id            uuid primary key default uuid_generate_v4(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  product_id    uuid not null references public.products(id) on delete restrict,
  quantity      integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  product_snapshot jsonb not null
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- ─────────────────────────── prescriptions (receitas)
create table if not exists public.prescriptions (
  id              uuid primary key default uuid_generate_v4(),
  customer_id     uuid not null references public.customers(id) on delete cascade,
  label           text not null,
  od_sphere       numeric(4,2),
  od_cylinder     numeric(4,2),
  od_axis         integer,
  oe_sphere       numeric(4,2),
  oe_cylinder     numeric(4,2),
  oe_axis         integer,
  add_value       numeric(4,2),
  pupillary_distance numeric(5,2),
  notes           text,
  created_at      timestamptz not null default now()
);

create index if not exists prescriptions_customer_idx on public.prescriptions (customer_id);

-- ─────────────────────────── updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();
