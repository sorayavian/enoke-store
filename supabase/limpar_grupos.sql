-- ============================================================================
-- limpar_grupos.sql — Remove conversas/mensagens de GRUPOS do WhatsApp
--
-- Grupos entraram no banco antes do bloqueio (groupsIgnore + filtro @g.us).
-- Critério: o customer_contact de grupo é um ID longo (>= 15 dígitos), só
-- números, sem '+', '@' ou espaços. Números de telefone reais têm ~12-13
-- dígitos — então não são afetados.
--
-- Rode no SQL Editor do Supabase. Confira a 1ª query (SELECT) antes de apagar.
-- ============================================================================

-- 1) CONFERÊNCIA — veja o que será removido ANTES de apagar.
--    Devem aparecer só grupos (nomes tipo "ATENDIMENTO...", IDs longos).
select source, customer_contact, customer_name, status, updated_at
from public.conversations
where source = 'wa'
  and customer_contact ~ '^[0-9]{15,}$'
order by updated_at desc;

-- 2) APAGAR — descomente e rode depois de conferir o SELECT acima.
--    As mensagens somem junto (ON DELETE CASCADE em messages.conversation_id).
--
-- delete from public.messages
--  where source = 'wa'
--    and customer_contact ~ '^[0-9]{15,}$';
--
-- delete from public.conversations
--  where source = 'wa'
--    and customer_contact ~ '^[0-9]{15,}$';
