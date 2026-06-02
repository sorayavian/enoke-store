-- ============================================================================
-- seed.sql — Dados iniciais reais da loja Enoke
--
-- Idempotente SEM depender de constraints UNIQUE: usa WHERE NOT EXISTS, então
-- funciona mesmo em tabelas pré-existentes criadas sem unique(slug)/unique(email).
-- Rode DEPOIS das migrations 0001–0003. Pode rodar mais de uma vez sem duplicar.
--
-- Cobre: categorias, 10 produtos, clientes, pedidos+itens, conversas com
-- histórico de mensagens (WhatsApp+Instagram), erros do site, logs de IA,
-- alertas de estoque e posts/métricas de Instagram.
-- ============================================================================

-- ── Categorias ────────────────────────────────────────────────────────────
insert into public.categories (id, slug, name, description)
select gen_random_uuid(), v.slug, v.name, v.description
from (values
  ('grau',     'Óculos de grau', 'Armações para uso com lentes de grau'),
  ('sol',      'Óculos de sol',  'Solares autorais com proteção UV400'),
  ('infantil', 'Infantil',       'Coleção para crianças')
) as v(slug, name, description)
where not exists (select 1 from public.categories c where c.slug = v.slug);

-- ── Produtos (espelha lib/mock/products.ts; paths de imagem corretos) ─────
insert into public.products (id, slug, code, name, brand, material, price_cents, stock, images, specs, category_id, is_active)
select gen_random_uuid(), v.slug, v.code, v.name, v.brand, v.material, v.price_cents, v.stock, v.images, v.specs::jsonb,
       (select id from public.categories c where c.slug = v.cat), true
from (values
  ('aurora-acetato-grafite',  'ENK-001', 'Aurora', 'Enoke Atelier',  'Acetato italiano',     189000,  8,
    array['/placeholders/aurora-acetato-grafite-1.svg','/placeholders/aurora-acetato-grafite-2.svg'],
    '{"formato_rosto":["oval","coracao"],"estilo":["classico"],"genero":"feminino","tipo":"grau","cor":"grafite"}', 'grau'),
  ('lume-titanio-bronze',     'ENK-002', 'Lume',   'Enoke Atelier',  'Titânio escovado',     245000,  5,
    array['/placeholders/lume-titanio-bronze-1.svg','/placeholders/lume-titanio-bronze-2.svg'],
    '{"formato_rosto":["quadrado","oval"],"estilo":["moderno"],"genero":"unissex","tipo":"grau","cor":"bronze"}', 'grau'),
  ('volta-acetato-tartaruga', 'ENK-003', 'Volta',  'Cinque Terre',   'Acetato Mazzucchelli', 198000, 12,
    array['/placeholders/volta-acetato-tartaruga-1.svg','/placeholders/volta-acetato-tartaruga-2.svg'],
    '{"formato_rosto":["redondo","oval"],"estilo":["vintage","classico"],"genero":"masculino","tipo":"sol","cor":"tartaruga"}', 'sol'),
  ('siena-metal-dourado',     'ENK-004', 'Siena',  'Cinque Terre',   'Metal',                175000,  9,
    array['/placeholders/siena-metal-dourado-1.svg','/placeholders/siena-metal-dourado-2.svg'],
    '{"formato_rosto":["coracao","oval"],"estilo":["classico"],"genero":"feminino","tipo":"sol","cor":"dourado"}', 'sol'),
  ('orto-aviador-prata',      'ENK-005', 'Orto',   'Maison Ortolani','Aço inoxidável',       289000,  4,
    array['/placeholders/orto-aviador-prata-1.svg','/placeholders/orto-aviador-prata-2.svg'],
    '{"formato_rosto":["oval","diamante"],"estilo":["classico","moderno"],"genero":"masculino","tipo":"sol","cor":"prata"}', 'sol'),
  ('petra-acetato-creme',     'ENK-006', 'Petra',  'Enoke Atelier',  'Acetato italiano',     215000,  6,
    array['/placeholders/petra-acetato-creme-1.svg','/placeholders/petra-acetato-creme-2.svg'],
    '{"formato_rosto":["redondo","oval"],"estilo":["moderno"],"genero":"feminino","tipo":"grau","cor":"creme"}', 'grau'),
  ('mira-titanio-negro',      'ENK-007', 'Mira',   'Maison Ortolani','Titânio',              325000,  3,
    array['/placeholders/mira-titanio-negro-1.svg','/placeholders/mira-titanio-negro-2.svg'],
    '{"formato_rosto":["quadrado","diamante"],"estilo":["moderno"],"genero":"unissex","tipo":"ambos","cor":"negro"}', 'grau'),
  ('alba-acetato-mel',        'ENK-008', 'Alba',   'Cinque Terre',   'Acetato',              168000, 14,
    array['/placeholders/alba-acetato-mel-1.svg','/placeholders/alba-acetato-mel-2.svg'],
    '{"formato_rosto":["coracao","oval"],"estilo":["vintage"],"genero":"feminino","tipo":"sol","cor":"mel"}', 'sol'),
  ('porto-acetato-azul',      'ENK-009', 'Porto',  'Enoke Atelier',  'Bio-acetato',          199000,  7,
    array['/placeholders/porto-acetato-azul-1.svg','/placeholders/porto-acetato-azul-2.svg'],
    '{"formato_rosto":["quadrado","oval"],"estilo":["moderno"],"genero":"masculino","tipo":"grau","cor":"azul"}', 'grau'),
  ('nido-infantil-coral',     'ENK-010', 'Nido',   'Piccolo',        'TR-90 flexível',        89000, 20,
    array['/placeholders/nido-infantil-coral-1.svg','/placeholders/nido-infantil-coral-2.svg'],
    '{"formato_rosto":["redondo"],"estilo":["moderno"],"genero":"unissex","tipo":"grau","cor":"coral"}', 'infantil')
) as v(slug, code, name, brand, material, price_cents, stock, images, specs, cat)
where not exists (select 1 from public.products p where p.slug = v.slug or p.code = v.code);

-- ── Clientes e pedidos ────────────────────────────────────────────────────
-- PULADOS no seed: a tabela `customers` tem FK para auth.users (cada cliente
-- precisa ser um usuário real do Supabase Auth). Clientes e pedidos passam a
-- existir naturalmente quando pessoas reais se cadastram e compram no site.
-- As páginas /admin/clientes e /admin/pedidos usam fallback de mock até lá.

-- ── Conversas + mensagens (histórico) ─────────────────────────────────────
-- Independem de `customers` (usam só telefone/@), então populam normalmente.
insert into public.conversations (id, source, customer_contact, customer_name, status, ai_enabled, created_at, updated_at)
select gen_random_uuid(), v.source, v.contato, v.nome, v.status, v.ai_enabled, v.criada, v.atualizada
from (values
  ('wa', '+55 11 99812-3344', 'Mariana Alves',  'open',      true,  now() - interval '3 hour', now() - interval '28 minute'),
  ('ig', '@joao.pedro',        'João Pedro',     'open',      true,  now() - interval '2 hour', now() - interval '58 minute'),
  ('wa', '+55 21 98765-1122', 'Carla Souza',    'escalated', false, now() - interval '6 hour', now() - interval '4 hour'),
  ('ig', '@lu.ferreira',       'Luana Ferreira', 'resolved',  true,  now() - interval '1 day',  now() - interval '20 hour'),
  ('wa', '+55 11 91234-5678', 'Rafael Lima',    'open',      true,  now() - interval '5 hour', now() - interval '3 hour'),
  ('ig', '@bia.martins',       'Beatriz Martins','resolved',  true,  now() - interval '2 day',  now() - interval '1 day')
) as v(source, contato, nome, status, ai_enabled, criada, atualizada)
where not exists (
  select 1 from public.conversations c
  where c.source = v.source and c.customer_contact = v.contato
);

-- Mensagens: insere só se a conversa ainda não tem mensagens (idempotência).
do $$
declare c_id uuid;
begin
  select id into c_id from public.conversations where source='wa' and customer_contact='+55 11 99812-3344' limit 1;
  if c_id is not null and not exists (select 1 from public.messages where conversation_id = c_id) then
    insert into public.messages (conversation_id, source, customer_contact, content, direction, classification, ai_generated, created_at) values
      (c_id,'wa','+55 11 99812-3344','Oi! Vi o modelo Aurora no site, vocês têm em outra cor além do grafite?','in','pergunta',false, now() - interval '32 minute'),
      (c_id,'wa','+55 11 99812-3344','Olá, Mariana! A Aurora é em acetato italiano e no momento temos pronta entrega na cor grafite. Posso verificar a disponibilidade de encomenda em outras cores para você. Qual cor você procura? 😊','out',null,true, now() - interval '31 minute'),
      (c_id,'wa','+55 11 99812-3344','A Aurora tem disponível em outra cor? Queria uma mais clara','in','intencao_compra',false, now() - interval '28 minute');
  end if;

  select id into c_id from public.conversations where source='ig' and customer_contact='@joao.pedro' limit 1;
  if c_id is not null and not exists (select 1 from public.messages where conversation_id = c_id) then
    insert into public.messages (conversation_id, source, customer_contact, content, direction, classification, ai_generated, created_at) values
      (c_id,'ig','@joao.pedro','Quero comprar o modelo Lume, ainda tem?','in','intencao_compra',false, now() - interval '1 hour'),
      (c_id,'ig','@joao.pedro','Oi, João! Sim, a Lume está disponível 🙌 É em titânio escovado na cor bronze, super leve. Quer que eu te envie o link para finalizar a compra pelo site?','out',null,true, now() - interval '58 minute');
  end if;

  select id into c_id from public.conversations where source='wa' and customer_contact='+55 21 98765-1122' limit 1;
  if c_id is not null and not exists (select 1 from public.messages where conversation_id = c_id) then
    insert into public.messages (conversation_id, source, customer_contact, content, direction, classification, ai_generated, created_at) values
      (c_id,'wa','+55 21 98765-1122','A lente do meu óculos veio riscada, quero reclamar.','in','reclamacao',false, now() - interval '4 hour' - interval '5 minute'),
      (c_id,'wa','+55 21 98765-1122','Sinto muito pelo ocorrido, Carla. Vou encaminhar seu caso para um de nossos atendentes resolverem a troca com prioridade. Pode me confirmar o número do pedido?','out',null,true, now() - interval '4 hour');
  end if;

  select id into c_id from public.conversations where source='ig' and customer_contact='@lu.ferreira' limit 1;
  if c_id is not null and not exists (select 1 from public.messages where conversation_id = c_id) then
    insert into public.messages (conversation_id, source, customer_contact, content, direction, classification, ai_generated, created_at) values
      (c_id,'ig','@lu.ferreira','Perfeito, muito obrigada pelo atendimento!','in','avaliacao',false, now() - interval '20 hour');
  end if;

  select id into c_id from public.conversations where source='wa' and customer_contact='+55 11 91234-5678' limit 1;
  if c_id is not null and not exists (select 1 from public.messages where conversation_id = c_id) then
    insert into public.messages (conversation_id, source, customer_contact, content, direction, classification, ai_generated, created_at) values
      (c_id,'wa','+55 11 91234-5678','Vocês têm lente fotossensível para o modelo Volta?','in','pergunta',false, now() - interval '3 hour' - interval '10 minute'),
      (c_id,'wa','+55 11 91234-5678','Olá, Rafael! Sim, a Volta aceita lentes fotossensíveis (fotocromáticas), que escurecem no sol e clareiam em ambientes internos. Posso montar um orçamento com o seu grau. Você tem a receita em mãos? 👓','out',null,true, now() - interval '3 hour');
  end if;

  select id into c_id from public.conversations where source='ig' and customer_contact='@bia.martins' limit 1;
  if c_id is not null and not exists (select 1 from public.messages where conversation_id = c_id) then
    insert into public.messages (conversation_id, source, customer_contact, content, direction, classification, ai_generated, created_at) values
      (c_id,'ig','@bia.martins','Que ótimo, vou comprar pelo site então. Obrigada!','in','avaliacao',false, now() - interval '1 day');
  end if;
end $$;

-- ── Erros do site (monitor) ───────────────────────────────────────────────
insert into public.site_errors (type, path, description, severity, detected_at, resolved)
select * from (values
  ('checkout_falha',  '/checkout',                   'Falha ao criar preferência de pagamento — Mercado Pago retornou 502 em 3 tentativas.', 'alta',  now() - interval '13 hour', false),
  ('imagem_faltando', '/produto/mira-titanio-negro', 'Imagem secundária do produto Mira (ENK-007) retornou 404.',                             'media', now() - interval '16 hour', false),
  ('404',             '/colecao/verao',              'Página acessada 14 vezes hoje não existe. Possível link quebrado em campanha.',         'baixa', now() - interval '20 hour', true)
) as v(type, path, description, severity, detected_at, resolved)
where not exists (select 1 from public.site_errors s where s.path = v.path and s.type = v.type);

-- ── Logs de IA ────────────────────────────────────────────────────────────
insert into public.ai_logs (endpoint, module, input_tokens, output_tokens, cost_usd, created_at)
select * from (values
  ('/api/ai/reply',         'mensagens', 1240, 380, 0.0084, now() - interval '31 minute'),
  ('/api/ai/classify',      'mensagens',  320,  12, 0.0011, now() - interval '32 minute'),
  ('/api/ai/gerar-legenda', 'instagram',  540, 410, 0.0072, now() - interval '4 hour'),
  ('/api/ai/monitor',       'monitor',    880,  95, 0.0039, now() - interval '13 hour')
) as v(endpoint, module, input_tokens, output_tokens, cost_usd, created_at)
where not exists (select 1 from public.ai_logs);

-- ── Alertas de estoque ────────────────────────────────────────────────────
insert into public.stock_alerts (product_id, min_quantity, current_quantity, alerted_at)
select (select id from public.products where code = v.code limit 1), v.minq, v.curq, now() - interval '6 hour'
from (values ('ENK-007',5,3), ('ENK-005',5,4), ('ENK-002',6,5)) as v(code, minq, curq)
where not exists (select 1 from public.stock_alerts)
  and (select id from public.products where code = v.code limit 1) is not null;

-- ── Instagram: posts ──────────────────────────────────────────────────────
insert into public.instagram_posts (type, caption, hashtags, image_url, product_id, scheduled_at, published_at, status, ig_post_id)
select v.type, v.caption, v.hashtags, v.image_url,
       (select id from public.products where code = v.code limit 1), v.scheduled_at, v.published_at, v.status, v.ig_post_id
from (values
  ('foto_produto','Aurora. Acetato italiano em grafite, para quem aprecia o essencial bem feito. ✨',
    array['#otica','#oculosdegrau','#acetato','#enoke','#eyewear'],'/placeholders/aurora-acetato-grafite-1.svg','ENK-001',
    null::timestamptz, now() - interval '1 day', 'published', 'ig_post_001'),
  ('dica_saude','Luz azul cansa a vista? Conheça as lentes com filtro e proteja seus olhos no dia a dia. 👓',
    array['#saudevisual','#luzazul','#dica','#otica'],'/placeholders/lume-titanio-bronze-1.svg',null,
    now() + interval '1 day', null::timestamptz, 'scheduled', null),
  ('promocao','Semana do solar: 15% OFF em modelos selecionados. Corre que é por tempo limitado! ☀️',
    array['#promocao','#oculosdesol','#desconto','#enoke'],'/placeholders/volta-acetato-tartaruga-1.svg','ENK-003',
    now() + interval '2 day', null::timestamptz, 'scheduled', null)
) as v(type, caption, hashtags, image_url, code, scheduled_at, published_at, status, ig_post_id)
where not exists (select 1 from public.instagram_posts);

-- ── Instagram: métricas do post publicado ─────────────────────────────────
insert into public.instagram_metrics (post_id, likes, comments, saves, reach, direct_messages, followers_gained, collected_at)
select id, 342, 28, 64, 4820, 17, 23, now() - interval '6 hour'
from public.instagram_posts where ig_post_id = 'ig_post_001'
and not exists (select 1 from public.instagram_metrics);
