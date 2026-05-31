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
