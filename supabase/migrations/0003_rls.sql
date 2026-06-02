-- ============================================================================
-- 0003 — Row Level Security (RLS) e policies
--
-- Modelo de acesso do app:
--  • Loja pública (anon key): SELECT em categories/products ativos.
--  • Cliente logado (anon key + sessão): vê/gerencia só os próprios
--    pedidos, itens, receitas (auth.uid() = customer_id).
--  • Painel admin (service_role key): ignora RLS por padrão → acesso total.
--    Por isso as tabelas de mensagens/IA NÃO recebem policy de anon:
--    só o service role (admin) acessa.
-- ============================================================================

-- Liga RLS em todas as tabelas. Sem policy = ninguém via anon; service_role
-- continua passando direto (bypassa RLS).
alter table public.categories        enable row level security;
alter table public.products          enable row level security;
alter table public.customers         enable row level security;
alter table public.orders            enable row level security;
alter table public.order_items       enable row level security;
alter table public.prescriptions     enable row level security;
alter table public.conversations     enable row level security;
alter table public.messages          enable row level security;
alter table public.site_errors       enable row level security;
alter table public.ai_logs           enable row level security;
alter table public.stock_alerts      enable row level security;
alter table public.instagram_posts   enable row level security;
alter table public.instagram_metrics enable row level security;

-- ── Catálogo: leitura pública ─────────────────────────────────────────────
drop policy if exists "catalogo: categorias visíveis a todos" on public.categories;
create policy "catalogo: categorias visíveis a todos"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "catalogo: produtos ativos visíveis a todos" on public.products;
create policy "catalogo: produtos ativos visíveis a todos"
  on public.products for select
  to anon, authenticated
  using (is_active = true);

-- ── Cliente: vê e edita o próprio cadastro ────────────────────────────────
drop policy if exists "cliente: vê o próprio cadastro" on public.customers;
create policy "cliente: vê o próprio cadastro"
  on public.customers for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "cliente: atualiza o próprio cadastro" on public.customers;
create policy "cliente: atualiza o próprio cadastro"
  on public.customers for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── Cliente: só os próprios pedidos ───────────────────────────────────────
drop policy if exists "cliente: vê os próprios pedidos" on public.orders;
create policy "cliente: vê os próprios pedidos"
  on public.orders for select
  to authenticated
  using (auth.uid() = customer_id);

drop policy if exists "cliente: cria os próprios pedidos" on public.orders;
create policy "cliente: cria os próprios pedidos"
  on public.orders for insert
  to authenticated
  with check (auth.uid() = customer_id);

-- ── Cliente: itens dos próprios pedidos ───────────────────────────────────
drop policy if exists "cliente: vê itens dos próprios pedidos" on public.order_items;
create policy "cliente: vê itens dos próprios pedidos"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.customer_id = auth.uid()
    )
  );

-- ── Cliente: só as próprias receitas ──────────────────────────────────────
drop policy if exists "cliente: gerencia as próprias receitas" on public.prescriptions;
create policy "cliente: gerencia as próprias receitas"
  on public.prescriptions for all
  to authenticated
  using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);

-- As tabelas de mensagens/IA/monitor/instagram NÃO têm policy de anon:
-- o painel acessa via service_role (bypassa RLS). Isso mantém conversas de
-- clientes, logs de IA e erros do site fora do alcance do anon key público.
