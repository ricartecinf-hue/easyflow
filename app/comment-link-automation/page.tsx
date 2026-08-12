import type { Metadata } from "next";
import SeoPageShell from "@/components/seo-page-shell";
import { commentLinkSeoPage } from "@/lib/seo-pages";

export const metadata: Metadata = {
  title: "Automação do comentário LINK no Instagram",
  description:
    "Automatize respostas ao comentário LINK com palavras-chave, respostas privadas oficiais, links rastreados e análises.",
  alternates: { canonical: "/comment-link-automation" },
  openGraph: {
    title: "Automação do comentário LINK no Instagram",
    description:
      "Transforme comentários como LINK, COMPRAR, GUIA e PREÇO em respostas privadas rastreadas.",
    url: "/comment-link-automation",
  },
};

export default function CommentLinkAutomationPage() {
  return <SeoPageShell config={commentLinkSeoPage} />;
}
