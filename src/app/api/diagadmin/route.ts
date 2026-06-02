import { NextResponse } from "next/server";

// DIAGNÓSTICO TEMPORÁRIO — remover depois.
// GET: serve uma página simples para testar a senha (campo + botão).
// POST { senha }: compara com ADMIN_PASSWORD sem revelar valores.

export async function GET() {
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Diagnóstico de senha</title>
<style>
  body{font-family:system-ui,sans-serif;background:#111;color:#eee;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}
  .box{width:320px;text-align:center}
  input{width:100%;padding:10px;border-radius:8px;border:1px solid #444;background:#222;color:#eee;font-size:16px;box-sizing:border-box}
  button{margin-top:12px;width:100%;padding:10px;border:0;border-radius:8px;background:#C9A66B;color:#111;font-size:16px;font-weight:600;cursor:pointer}
  #r{margin-top:16px;font-size:15px;min-height:24px}
  .ok{color:#5ad15a}.no{color:#ff6b6b}
</style></head><body><div class="box">
  <h3>Teste de senha do admin</h3>
  <input id="s" type="password" placeholder="Digite a senha" autofocus>
  <button onclick="t()">Testar</button>
  <div id="r"></div>
</div>
<script>
async function t(){
  const senha=document.getElementById('s').value;
  const res=await fetch('/api/diagadmin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({senha})});
  const d=await res.json();
  const el=document.getElementById('r');
  if(d.bate_exato){el.className='ok';el.textContent='\\u2713 SENHA CORRETA! Use esta para entrar no painel.';}
  else{el.className='no';el.innerHTML='\\u2717 Nao bate.<br>Voce digitou '+d.tamanho_enviada+' caracteres; o esperado tem '+d.tamanho_esperada+'.'+(d.bate_trim?'<br>(So diferenca de espacos no comeco/fim!)':'');}
}
document.getElementById('s').addEventListener('keydown',e=>{if(e.key==='Enter')t()});
</script></body></html>`;
  return new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}

export async function POST(req: Request) {
  const { senha } = (await req.json().catch(() => ({}))) as { senha?: string };
  const esperada = process.env.ADMIN_PASSWORD ?? "";
  const enviada = senha ?? "";
  return NextResponse.json({
    admin_password_definida: Boolean(process.env.ADMIN_PASSWORD),
    tamanho_esperada: esperada.length,
    tamanho_enviada: enviada.length,
    bate_exato: enviada === esperada,
    bate_trim: enviada.trim() === esperada.trim(),
  });
}
