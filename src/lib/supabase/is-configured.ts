/**
 * Detecta se o Supabase está configurado (variáveis de ambiente presentes).
 *
 * Enquanto as chaves não estão definidas, a camada de dados usa os mocks —
 * assim o site funciona normalmente. Quando as variáveis entram (local/Vercel),
 * as queries reais passam a valer automaticamente, sem mudar código.
 */
export const SUPABASE_CONFIGURED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/**
 * Escrita no banco pelo admin (criar/editar/excluir produtos, upload) exige a
 * chave secreta service_role além da URL. Sem ela, o client de escrita quebra
 * com "supabaseKey is required" — por isso checamos antes de usá-lo.
 */
export const SUPABASE_WRITE_CONFIGURED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
