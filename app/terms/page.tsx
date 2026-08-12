import type { Metadata } from "next";
import LegalShell from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Termos de Serviço - EasyFlow",
  description:
    "Termos de uso do EasyFlow para campanhas de comentários para DM no Instagram.",
};

export default function TermsPage() {
  return (
    <LegalShell
      title="Termos de Serviço"
      description="Estes termos definem o uso aceitável do EasyFlow para campanhas de comentários para DM no Instagram."
      updatedAt="24 de maio de 2026"
    >
      <section>
        <h2 className="text-xl font-bold text-white">Uso autorizado</h2>
        <p className="mt-3">
          Você pode usar o EasyFlow somente com contas profissionais do
          Instagram que sejam suas ou que você tenha autorização para
          administrar. Você é responsável pelas campanhas, palavras-chave,
          links e mensagens que configurar.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">Conformidade com a plataforma</h2>
        <p className="mt-3">
          Você concorda em seguir os Termos da Plataforma Meta, as políticas do
          Instagram e as regras aplicáveis de mensagens, privacidade,
          publicidade e combate a spam. O EasyFlow pode limitar, pausar ou
          desativar campanhas que representem risco de abuso, segurança,
          conformidade ou entrega.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">Disponibilidade</h2>
        <p className="mt-3">
          O EasyFlow depende de serviços de terceiros, incluindo a Meta e
          fornecedores de e-mail, hospedagem, banco de dados e filas. Trabalhamos
          para manter o serviço confiável, mas não garantimos disponibilidade
          ininterrupta.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">Núcleo de código aberto</h2>
        <p className="mt-3">
          O repositório público é licenciado sob a licença MIT. Infraestrutura
          SaaS hospedada, suporte gerenciado, fluxos para agências, análises,
          relatórios e outros recursos pagos podem ser oferecidos separadamente
          do núcleo de código aberto.
        </p>
      </section>
    </LegalShell>
  );
}
