-- Funções de apoio para checkout

-- Decremento transacional de estoque ao confirmar pagamento
create or replace function public.confirm_order_payment(p_order_id uuid, p_payment_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item record;
begin
  -- idempotência: se já confirmou esse payment_id, sai
  if exists (select 1 from orders where mp_payment_id = p_payment_id and status <> 'pending') then
    return;
  end if;

  for v_item in
    select product_id, quantity from order_items where order_id = p_order_id
  loop
    update products
       set stock = stock - v_item.quantity
     where id = v_item.product_id and stock >= v_item.quantity;

    if not found then
      raise exception 'insufficient stock for product %', v_item.product_id;
    end if;
  end loop;

  update orders
     set status = 'paid', mp_payment_id = p_payment_id
   where id = p_order_id;
end;
$$;
