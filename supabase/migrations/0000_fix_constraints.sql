-- ============================================================================
-- 0000 — Ajuste de constraints em tabelas pré-existentes
--
-- Rode ANTES do seed (e depois das 0001–0003) se o banco já tinha tabelas
-- criadas sem as constraints UNIQUE esperadas. Seguro e idempotente:
--   • remove duplicatas (mantém a linha mais antiga por created_at/ctid)
--   • adiciona a UNIQUE só se ainda não existir
--
-- Se as tabelas já estavam corretas, este script não faz nada de prejudicial.
-- ============================================================================

-- ── Garante default gen_random_uuid() na coluna id ────────────────────────
-- Tabelas pré-existentes podem ter sido criadas sem default no id, causando
-- "null value in column id" ao inserir. Aplica o default em todas elas.
create extension if not exists "pgcrypto";

do $$
declare
  t text;
  tabelas text[] := array[
    'categories','products','customers','orders','order_items','prescriptions',
    'conversations','messages','site_errors','ai_logs','stock_alerts',
    'instagram_posts','instagram_metrics'
  ];
begin
  foreach t in array tabelas loop
    -- só age se a tabela existe e tem coluna id sem default
    if exists (
      select 1 from information_schema.columns
      where table_schema='public' and table_name=t and column_name='id'
    ) then
      execute format(
        'alter table public.%I alter column id set default gen_random_uuid()', t
      );
    end if;
  end loop;
end $$;

-- ── categories.slug ───────────────────────────────────────────────────────
delete from public.categories a using public.categories b
where a.ctid > b.ctid and a.slug = b.slug;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'categories_slug_key'
  ) and not exists (
    select 1 from pg_indexes where schemaname='public' and indexname='categories_slug_key'
  ) then
    alter table public.categories add constraint categories_slug_key unique (slug);
  end if;
end $$;

-- ── products.slug e products.code ─────────────────────────────────────────
delete from public.products a using public.products b
where a.ctid > b.ctid and a.slug = b.slug;
delete from public.products a using public.products b
where a.ctid > b.ctid and a.code = b.code;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'products_slug_key') then
    alter table public.products add constraint products_slug_key unique (slug);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'products_code_key') then
    alter table public.products add constraint products_code_key unique (code);
  end if;
end $$;

-- ── customers.email ───────────────────────────────────────────────────────
delete from public.customers a using public.customers b
where a.ctid > b.ctid and a.email = b.email;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'customers_email_key') then
    alter table public.customers add constraint customers_email_key unique (email);
  end if;
end $$;

-- ── conversations (source, customer_contact) ──────────────────────────────
delete from public.conversations a using public.conversations b
where a.ctid > b.ctid
  and a.source = b.source
  and a.customer_contact = b.customer_contact;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'conversations_source_contact_key') then
    alter table public.conversations
      add constraint conversations_source_contact_key unique (source, customer_contact);
  end if;
end $$;
