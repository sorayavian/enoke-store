-- Remove registros de debug temporário do webhook do Instagram, se houver.
-- Rode no SQL Editor do Supabase (opcional — só limpa lixo de diagnóstico).
delete from public.site_errors where type = 'ig_webhook_debug';
