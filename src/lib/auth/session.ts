import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ClienteSessao = {
  id: string;
  email: string;
  fullName: string | null;
};

// Retorna o cliente logado (ou null). Usa getUser(), que valida o token
// junto ao Supabase — seguro para decisões de acesso em Server Components.
export async function getClienteAtual(): Promise<ClienteSessao | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // O nome pode vir do perfil em `customers` ou dos metadados do Auth.
  // O cast segue o padrão do projeto (tipos manuais do Supabase não inferem
  // bem o retorno do select — ver lib/admin e estoque/actions.ts).
  const { data: perfil } = await supabase
    .from("customers")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const perfilNome = (perfil as { full_name: string | null } | null)?.full_name;

  const fullName =
    perfilNome ??
    (user.user_metadata?.full_name as string | undefined) ??
    null;

  return { id: user.id, email: user.email ?? "", fullName };
}
