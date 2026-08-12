import type { Metadata } from "next";
import SeoPageShell from "@/components/seo-page-shell";
import { manychatAlternativePage } from "@/lib/seo-pages";

export const metadata: Metadata = {
  title: "Alternativa ao Manychat para comentários e DMs no Instagram",
  description:
    "Alternativa objetiva ao Manychat com palavras-chave, respostas privadas, links rastreados e relatórios.",
  alternates: { canonical: "/manychat-alternative" },
  openGraph: {
    title: "Alternativa ao Manychat para comentários e DMs no Instagram",
    description:
      "Use o EasyFlow para campanhas de comentários para DM sem criar fluxos complexos de chatbot.",
    url: "/manychat-alternative",
  },
};

export default function ManychatAlternativePage() {
  return <SeoPageShell config={manychatAlternativePage} />;
}
