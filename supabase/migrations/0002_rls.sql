-- Row Level Security — ENOKE
-- Princípio: público lê produtos/categorias; cliente só vê seus próprios dados.

alter table public.products      enable row level security;
alter table public.categories    enable row level security;
alter table public.customers     enable row level security;
alter table public.orders        enable row level security;
alter table public.order_items   enable row level security;
alter table public.prescriptions enable row level security;

-- ── products ──
drop policy if exists "products are publicly readable" on public.products;
create policy "products are publicly readable"
  on public.products for select
  using (is_active = true);

-- ── categories ──
drop policy if exists "categories are publicly readable" on public.categories;
create policy "categories are publicly readable"
  on public.categories for select
  using (true);

-- ── customers ──
drop policy if exists "customer reads own profile" on public.customers;
create policy "customer reads own profile"
  on public.customers for select
  using (auth.uid() = id);

drop policy if exists "customer updates own profile" on public.customers;
create policy "customer updates own profile"
  on public.customers for update
  using (auth.uid() = id);

drop policy if exists "customer creates own profile" on public.customers;
create policy "customer creates own profile"
  on public.customers for insert
  with check (auth.uid() = id);

-- ── orders ──
drop policy if exists "customer reads own orders" on public.orders;
create policy "customer reads own orders"
  on public.orders for select
  using (auth.uid() = customer_id);

-- inserts/updates de orders sempre via service role (route handlers),
-- nunca direto do client — por isso não criamos policy de insert/update aqui.

-- ── order_items ──
drop policy if exists "customer reads own order items" on public.order_items;
create policy "customer reads own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.customer_id = auth.uid()
    )
  );

-- ── prescriptions ──
drop policy if exists "customer manages own prescriptions" on public.prescriptions;
create policy "customer manages own prescriptions"
  on public.prescriptions for all
  using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);
