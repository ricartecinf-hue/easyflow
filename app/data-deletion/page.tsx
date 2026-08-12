import type { Metadata } from "next";
import LegalShell from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Exclusão de Dados - EasyFlow",
  description:
    "Como clientes do EasyFlow podem desconectar o Instagram e solicitar a exclusão de dados.",
};

export default function DataDeletionPage() {
  return (
    <LegalShell
      title="Exclusão de Dados"
      description="Use esta página para solicitar a remoção de dados da conta, do espaço de trabalho, do Instagram e das campanhas no EasyFlow."
      updatedAt="24 de maio de 2026"
    >
      <section>
        <h2 className="text-xl font-bold text-white">Desconectar Instagram</h2>
        <p className="mt-3">
          Entre na sua conta, abra Configurações e selecione Desconectar. Isso
          remove o token armazenado da conexão com o Instagram e impede que as
          campanhas do espaço de trabalho enviem novas respostas privadas.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">Excluir dados do espaço de trabalho</h2>
        <p className="mt-3">
          Para excluir dados do espaço de trabalho, campanhas, registros,
          webhooks, referências de cobrança e diagnósticos operacionais, fale
          com o suporte usando o mesmo endereço de e-mail da sua conta. Informe
          o nome do espaço de trabalho e o usuário do Instagram conectado.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">Verificação</h2>
        <p className="mt-3">
          Podemos solicitar a confirmação do endereço de e-mail ou da conta
          profissional conectada antes de excluir os dados. As solicitações são
          processadas o mais rápido possível, salvo quando a retenção for
          necessária por motivos legais, de cobrança, prevenção a fraudes ou
          segurança.
        </p>
      </section>
    </LegalShell>
  );
}
