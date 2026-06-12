import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a Enoke Eyewear Store coleta, usa e protege seus dados, incluindo mensagens de WhatsApp e Instagram.",
};

// Página de Política de Privacidade — também usada no App Review da Meta
// (Instagram/WhatsApp). Cobre o tratamento de mensagens e dados de atendimento.
export default function PrivacidadePage() {
  const atualizacao = "12 de junho de 2026";

  return (
    <section className="container-page py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="flex items-center gap-3 text-caption font-medium uppercase tracking-[0.2em] text-brand-text">
          <span className="inline-block h-px w-8 bg-brand-deep" />
          Privacidade
        </p>
        <h1 className="mt-5 font-display text-display-xl font-light text-fg">
          Política de <span className="italic text-brand-deep">Privacidade</span>
        </h1>
        <p className="mt-3 text-sm text-fg-muted">
          Última atualização: {atualizacao}
        </p>

        <div className="prose-enoke mt-10 space-y-8 text-fg-muted">
          <Bloco titulo="1. Quem somos">
            <p>
              A {SITE.fullName} é uma ótica on-line que comercializa óculos de
              grau e de sol, com atendimento ao cliente pelo site e por canais de
              mensagem (WhatsApp e Instagram). Contato:{" "}
              <a className="text-brand-deep underline" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
              .
            </p>
          </Bloco>

          <Bloco titulo="2. Dados que coletamos">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Dados de cadastro e pedido:</strong> nome, e-mail,
                telefone, endereço de entrega e histórico de compras.
              </li>
              <li>
                <strong>Mensagens de atendimento:</strong> o conteúdo das
                mensagens trocadas conosco pelo WhatsApp e pelo Instagram Direct,
                além do identificador da conversa (número ou perfil) e horário.
              </li>
              <li>
                <strong>Dados de navegação:</strong> informações técnicas
                necessárias ao funcionamento do site (cookies essenciais).
              </li>
            </ul>
          </Bloco>

          <Bloco titulo="3. Como usamos seus dados">
            <ul className="list-disc space-y-1 pl-5">
              <li>Responder dúvidas e prestar atendimento ao cliente.</li>
              <li>
                Processar e entregar pedidos, e dar suporte pós-venda
                (garantias, trocas).
              </li>
              <li>
                Melhorar nosso atendimento. Podemos usar um assistente de
                inteligência artificial para ajudar a redigir respostas às suas
                mensagens; conversas sensíveis são encaminhadas a um atendente
                humano.
              </li>
            </ul>
          </Bloco>

          <Bloco titulo="4. Mensagens de WhatsApp e Instagram">
            <p>
              Quando você nos envia uma mensagem pelo WhatsApp ou pelo Instagram,
              recebemos e armazenamos o conteúdo dessa mensagem para responder seu
              atendimento e manter o histórico da conversa. Usamos esses dados
              exclusivamente para a finalidade de atendimento — não vendemos nem
              compartilhamos suas mensagens com terceiros para fins de marketing.
            </p>
          </Bloco>

          <Bloco titulo="5. Compartilhamento e provedores">
            <p>
              Não vendemos seus dados pessoais. Utilizamos provedores de serviço
              estritamente necessários para operar (por exemplo, hospedagem,
              banco de dados e plataformas de mensagem como Meta/Instagram e
              WhatsApp), que tratam os dados conforme suas próprias políticas e
              apenas para viabilizar o serviço.
            </p>
          </Bloco>

          <Bloco titulo="6. Retenção e segurança">
            <p>
              Mantemos seus dados pelo tempo necessário às finalidades acima e às
              obrigações legais. Adotamos medidas técnicas e organizacionais
              razoáveis para proteger suas informações contra acesso não
              autorizado.
            </p>
          </Bloco>

          <Bloco titulo="7. Seus direitos">
            <p>
              Você pode solicitar acesso, correção ou exclusão dos seus dados, bem
              como a exclusão do histórico das suas conversas, entrando em contato
              pelo e-mail{" "}
              <a className="text-brand-deep underline" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
              .
            </p>
          </Bloco>

          <Bloco titulo="8. Alterações">
            <p>
              Podemos atualizar esta política periodicamente. A data de “última
              atualização” no topo indica a versão vigente.
            </p>
          </Bloco>
        </div>
      </div>
    </section>
  );
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-display-sm text-fg">{titulo}</h2>
      <div className="mt-3 space-y-2 leading-relaxed">{children}</div>
    </div>
  );
}
