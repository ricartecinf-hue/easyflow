import type { Metadata } from "next";
import SeoPageShell from "@/components/seo-page-shell";
import { agenciesSeoPage } from "@/lib/seo-pages";

export const metadata: Metadata = {
  title: "Automação de DMs do Instagram para agências",
  description:
    "Automação de DMs para agências com várias contas, links rastreados e relatórios compartilháveis.",
  alternates: { canonical: "/instagram-dm-automation-agencies" },
  openGraph: {
    title: "Automação de DMs do Instagram para agências",
    description:
      "Gerencie campanhas de comentários para DM dos seus clientes com o EasyFlow.",
    url: "/instagram-dm-automation-agencies",
  },
};

export default function InstagramDmAutomationAgenciesPage() {
  return <SeoPageShell config={agenciesSeoPage} />;
}
