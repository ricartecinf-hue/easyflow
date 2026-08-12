import type { Metadata } from "next";
import LegalShell from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Política de Privacidade - EasyFlow",
  description:
    "Como o EasyFlow trata dados de contas do Instagram, webhooks e informações de campanhas.",
};

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Política de Privacidade"
      description="O EasyFlow ajuda empresas a enviar respostas privadas pela API oficial da Meta quando alguém comenta em publicações ou reels conectados."
      updatedAt="24 de maio de 2026"
    >
      <section>
        <h2 className="text-xl font-bold text-white">Dados que coletamos</h2>
        <p className="mt-3">
          Coletamos endereços de e-mail para autenticação, metadados do espaço
          de trabalho e de cobrança, identificadores das contas conectadas do
          Instagram, tokens de acesso criptografados, configurações de
          campanhas, eventos de webhook, comentários necessários para executar
          as campanhas, registros de entrega e diagnósticos operacionais.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">Como usamos os dados</h2>
        <p className="mt-3">
          Usamos esses dados para autenticar usuários, conectar contas do
          Instagram, identificar palavras-chave nos comentários, enviar
          respostas privadas pelas APIs oficiais da Meta, evitar envios
          duplicados, diagnosticar falhas e proteger o serviço.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">Dados do Instagram e da Meta</h2>
        <p className="mt-3">
          O EasyFlow não solicita senhas, não extrai dados do Instagram e não
          usa automação de navegador. Os tokens do Instagram são armazenados de
          forma criptografada e usados somente para executar ações autorizadas
          pela conta profissional conectada.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">Fornecedores de serviços</h2>
        <p className="mt-3">
          O serviço pode utilizar fornecedores de hospedagem, banco de dados,
          filas Redis, e-mail e observabilidade. Esses fornecedores processam
          dados somente na medida necessária para manter o EasyFlow em
          funcionamento.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">Retenção e exclusão</h2>
        <p className="mt-3">
          O cliente pode desconectar o Instagram nas configurações. Isso remove
          a conexão armazenada e interrompe as campanhas. Para excluir a conta
          ou outros dados, siga as instruções da página de Exclusão de Dados.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">Contato</h2>
        <p className="mt-3">
          Para dúvidas sobre privacidade, entre em contato pelo canal de suporte
          informado no serviço EasyFlow.
        </p>
      </section>
    </LegalShell>
  );
}
