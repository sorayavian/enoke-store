# Evolution API (WhatsApp) — guia local

Stack para rodar a Evolution no seu PC e conectar um número de WhatsApp,
ligando-a à IA do site Enoke.

## Pré-requisito

- **Docker Desktop** instalado e aberto (https://www.docker.com/products/docker-desktop).

## 1. Subir a Evolution

```powershell
cd enoke-store\evolution
docker compose up -d
```

Aguarde ~1 min na primeira vez (baixa as imagens). Depois acesse:

- Manager: **http://localhost:8080/manager**
- A chave de acesso (apikey) está em `evolution/.env` → `EVOLUTION_API_KEY`
  (padrão: `enoke-evolution-local-2026`).

## 2. Criar a instância e conectar o número (QR code)

No Manager (passo 1), ou via API:

1. **Create Instance** → dê um nome, ex.: `enoke`.
2. Vai aparecer um **QR code**.
3. No celular: WhatsApp → **Aparelhos conectados** → **Conectar aparelho** →
   aponte para o QR. Pronto, o número está conectado.

> Use de preferência um número **só para testes** no começo.

## 3. Preencher o `.env.local` do site

No `enoke-store/.env.local`:

```
WHATSAPP_API_URL=http://localhost:8080
WHATSAPP_API_TOKEN=enoke-evolution-local-2026   # = EVOLUTION_API_KEY
WHATSAPP_INSTANCE=enoke                          # nome dado no passo 2
```

Reinicie o `npm run dev` para carregar as variáveis.

## 4. Fazer a Evolution avisar o site (webhook)

A Evolution precisa chamar o webhook do site quando chegar uma mensagem:
`POST http://localhost:3000/api/webhooks/whatsapp`.

Como tudo roda local, configure o webhook **da instância** apontando para esse
endereço. No Manager: instância `enoke` → **Webhook** → URL acima → eventos
**MESSAGES_UPSERT**.

> Se a Evolution (container) não conseguir acessar `localhost:3000` do host,
> use `http://host.docker.internal:3000/api/webhooks/whatsapp` no campo do
> webhook (o host.docker.internal aponta do container para o seu PC).

## 5. Testar

1. Envie uma mensagem de **outro** WhatsApp para o número conectado.
2. O fluxo: Evolution recebe → chama o webhook do site → IA classifica e
   responde → resposta volta pelo WhatsApp → tudo aparece em `/admin/mensagens`.

> Sem `ANTHROPIC_API_KEY`, a IA responde em modo demonstração (texto fixo),
> mas o fluxo de ponta a ponta (receber + enviar + salvar) já funciona.

## Parar / limpar

```powershell
docker compose down       # para os serviços
docker compose down -v    # para e apaga os dados (sessão do WhatsApp inclusa)
```
