import type { Metadata } from "next";
import LegalShell from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Suporte para análise do app pela Meta - EasyFlow",
  description:
    "Informações sobre o fluxo oficial de respostas privadas do EasyFlow para análise da Meta.",
};

export default function MetaReviewPage() {
  return (
    <LegalShell
      title="Suporte para análise do app pela Meta"
      description="O EasyFlow foi criado para contas profissionais que enviam respostas privadas após comentários com palavras-chave nas próprias publicações ou reels."
      updatedAt="24 de maio de 2026"
    >
      <section>
        <h2 className="text-xl font-bold text-white">Fluxo do usuário</h2>
        <p className="mt-3">
          O responsável entra por e-mail, conecta uma conta profissional do
          Instagram pelo OAuth da Meta e cria uma campanha por palavra-chave.
          Quando alguém comenta, o EasyFlow recebe o webhook, coloca o evento na
          fila, evita duplicidades, verifica os limites e envia a resposta
          privada usando o identificador do comentário.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">Conformidade</h2>
        <p className="mt-3">
          O aplicativo usa as APIs oficiais da Meta, verifica assinaturas dos
          webhooks, criptografa os tokens, não usa scraping, não coleta senhas e
          envia no máximo uma resposta privada por combinação de campanha e
          comentário.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white">Instruções de teste</h2>
        <p className="mt-3">
          O avaliador pode usar uma empresa de teste da Meta, conectar uma conta
          profissional do Instagram, criar uma campanha com a palavra LINK,
          comentar LINK na mídia selecionada e confirmar que a resposta privada
          foi enviada e registrada uma única vez.
        </p>
      </section>
    </LegalShell>
  );
}
