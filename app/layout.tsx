import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EasyFlow - Automação de comentários para DM no Instagram",
  description:
    "Envie automaticamente uma DM no Instagram quando alguém comentar uma palavra-chave, usando a API oficial da Meta.",
  keywords: [
    "instagram automation",
    "comment to DM",
    "instagram private replies",
    "social commerce",
    "manychat alternative",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full dark">
      <body className="min-h-full bg-background text-foreground font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
