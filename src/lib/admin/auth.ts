// Sessão do painel administrativo por senha única (do dono).
//
// Estratégia: ao acertar a senha, gravamos um cookie assinado (HMAC-SHA256)
// contendo apenas a data de expiração. O middleware (Edge) e as Server Actions
// validam a assinatura — sem o segredo, o cookie não pode ser forjado.
//
// Usa Web Crypto (crypto.subtle), disponível tanto no Edge quanto no Node 20+,
// para funcionar dentro do middleware.

export const ADMIN_COOKIE = "enoke_admin";
const DURACAO_MS = 1000 * 60 * 60 * 12; // 12 horas

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET não configurado");
  return s;
}

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(mensagem: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(mensagem));
  return b64url(sig);
}

// Comparação de tempo constante para não vazar informação por timing.
function tempoConstante(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/** Cria o valor do cookie de sessão (payload.assinatura). */
export async function criarTokenSessao(): Promise<string> {
  const exp = String(Date.now() + DURACAO_MS);
  const payload = b64url(new TextEncoder().encode(exp));
  const assinatura = await hmac(payload);
  return `${payload}.${assinatura}`;
}

/** Valida o valor do cookie: assinatura correta e não expirado. */
export async function validarTokenSessao(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const [payload, assinatura] = token.split(".");
  if (!payload || !assinatura) return false;

  const esperada = await hmac(payload);
  if (!tempoConstante(assinatura, esperada)) return false;

  try {
    const expStr = new TextDecoder().decode(
      Uint8Array.from(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
        (c) => c.charCodeAt(0)
      )
    );
    const exp = Number(expStr);
    return Number.isFinite(exp) && Date.now() < exp;
  } catch {
    return false;
  }
}

/** Confere a senha informada contra a configurada no ambiente. */
export function senhaCorreta(senha: string): boolean {
  const esperada = process.env.ADMIN_PASSWORD ?? "";
  if (!esperada) return false;
  return tempoConstante(senha, esperada);
}

/** Opções padrão do cookie de sessão do admin. */
export function opcoesCookie(maxAgeSegundos: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSegundos,
  };
}

export const COOKIE_MAX_AGE = DURACAO_MS / 1000;
