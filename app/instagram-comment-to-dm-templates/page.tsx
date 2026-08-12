import type { Metadata } from "next";
import SeoPageShell from "@/components/seo-page-shell";
import { templatesSeoPage } from "@/lib/seo-pages";

export const metadata: Metadata = {
  title: "Modelos de campanhas de comentários para DM no Instagram",
  description:
    "Veja modelos de comentários para DM destinados a materiais gratuitos, produtos, preços, lançamentos, criadores e agências.",
  alternates: { canonical: "/instagram-comment-to-dm-templates" },
  openGraph: {
    title: "Modelos de campanhas de comentários para DM no Instagram",
    description:
      "Comece com modelos do EasyFlow para comentários interessados e respostas privadas no Instagram.",
    url: "/instagram-comment-to-dm-templates",
  },
};

export default function InstagramCommentToDmTemplatesPage() {
  return <SeoPageShell config={templatesSeoPage} />;
}
