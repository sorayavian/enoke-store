-- Adiciona descrição ao produto (texto livre, opcional)
alter table public.products
  add column if not exists description text;
