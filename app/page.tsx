import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EasyFlow - Automação de comentários para DM no Instagram",
  description:
    "Transforme comentários com palavras-chave no Instagram em respostas privadas automáticas usando a API oficial da Meta.",
};

const GITHUB_URL = "https://github.com/ricartecinf-hue/easyflow";

function formatStars(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toLocaleString();
}

const githubIconPath =
  "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z";

const heroStats = [
  { value: "24/7", label: "Monitoramento de comentários" },
  { value: "1", label: "DM por comentário identificado" },
  { value: "0", label: "Necessidade de scraping" },
];

const flowSteps = [
  {
    eyebrow: "Conecte",
    title: "Vincule sua conta profissional do Instagram",
    description:
      "Entre por e-mail e conecte o Instagram uma única vez. Sem compartilhar senha e sem automação de navegador.",
  },
  {
    eyebrow: "Configure",
    title: "Escolha a publicação, as palavras-chave e a DM",
    description:
      "Crie uma campanha para um reel ou publicação: defina as palavras-chave, a resposta pública e a DM.",
  },
  {
    eyebrow: "Envie",
    title: "As respostas são enviadas pela API oficial",
    description:
      "Os webhooks recebem os comentários imediatamente e uma verificação complementar encontra o que o Instagram não enviou. Cada envio passa por fila, limite de volume e registro.",
  },
];

const features = [
  "Login por link mágico enviado por e-mail",
  "Várias contas do Instagram",
  "Tokens armazenados com criptografia",
  "Webhooks com verificação complementar",
  "Worker dedicado à fila de envios",
  "Limite de envio por conta",
  "Links rastreados com estatísticas de cliques",
  "Histórico completo das DMs",
  "Hospedagem própria e sem limites de plano",
];

/* Static, faithful copies of the real Overview and Dashboard screens, built in
   the app's own design tokens so what visitors see is what the app looks like. */

function AppWindow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background shadow-2xl shadow-black/50">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-2 text-xs text-muted">{label}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

const overviewStats = [
  ["Visualizações", "847,2 mil"],
  ["Alcance", "612,4 mil"],
  ["Curtidas", "38,1 mil"],
  ["Comentários", "4.204"],
  ["Salvamentos", "9.712"],
  ["Compartilhamentos", "2.340"],
];

const overviewPosts = [
  ["Reel da nova coleção", "214,8 mil", "9,1 mil", "3 abr"],
  ["Reposição de estoque", "88,4 mil", "5,2 mil", "28 mar"],
  ["Bastidores do estúdio", "51,3 mil", "3,4 mil", "21 mar"],
];

function OverviewPreview() {
  return (
    <AppWindow label="app / overview">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Visão geral</h3>
          <p className="mt-1 text-xs text-muted">
            Recentes — 24 publicações de @studio.store
          </p>
        </div>
        <span className="rounded border border-border px-2 py-1 text-xs text-muted">
          Últimas 50
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {overviewStats.map(([label, value]) => (
          <Stat key={label} label={label} value={value} />
        ))}
      </div>

      <div className="mt-4 rounded border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-foreground">Publicações</p>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-zinc-500">
              <th className="pb-2 pr-3 font-medium">Publicação</th>
              <th className="pb-2 px-3 text-right font-medium">Visualizações</th>
              <th className="pb-2 px-3 text-right font-medium">Curtidas</th>
              <th className="pb-2 pl-3 text-right font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {overviewPosts.map(([post, views, likes, date]) => (
              <tr key={post} className="border-b border-border last:border-0">
                <td className="py-2 pr-3 text-foreground">{post}</td>
                <td className="py-2 px-3 text-right text-muted">{views}</td>
                <td className="py-2 px-3 text-right text-muted">{likes}</td>
                <td className="py-2 pl-3 text-right text-zinc-500">{date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppWindow>
  );
}

function MatchedCommentCard() {
  return (
    <div className="w-64 rounded-lg border border-border bg-surface p-4 shadow-2xl shadow-black/50">
      <p className="text-xs text-muted">Novo comentário</p>
      <p className="mt-1 text-sm font-semibold text-foreground">@maya.co</p>
      <p className="mt-1 text-sm text-muted">LINK, por favor</p>
      <div className="mt-3 border-t border-border pt-3">
        <p className="text-xs text-muted">
          Palavra identificada: <span className="text-accent">GUIA</span>
        </p>
        <p className="mt-1 text-sm font-medium text-success">
          Resposta privada na fila
        </p>
      </div>
    </div>
  );
}

const dashboardStats = [
  ["Campanhas ativas", "8"],
  ["DMs enviadas", "1.284"],
  ["Ignoradas", "42"],
  ["Falhas", "3"],
  ["Cliques", "356"],
  ["CTR", "27.7%"],
];

const dashboardChart: [string, number][] = [
  ["Seg", 42],
  ["Ter", 68],
  ["Qua", 51],
  ["Qui", 94],
  ["Sex", 120],
  ["Sáb", 86],
  ["Dom", 73],
];

const dashboardActivity = [
  ["@maya.co", "Envio de guia do produto", "Enviada", "text-success"],
  ["@founder.ray", "Solicitação de preço", "Enviada", "text-success"],
  ["@shop.ava", "Material gratuito", "Na fila", "text-warning"],
];

function DashboardPreview() {
  const maxDM = Math.max(...dashboardChart.map(([, n]) => n));
  return (
    <AppWindow label="app / dashboard">
      <h3 className="text-base font-semibold text-foreground">Olá, Maya!</h3>
      <p className="mt-1 text-xs text-muted">2 contas conectadas · 340 contatos</p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {dashboardStats.map(([label, value]) => (
          <Stat key={label} label={label} value={value} />
        ))}
      </div>

      <div className="mt-4 rounded border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-foreground">DMs — Últimos 7 dias</p>
        <div className="mt-4 flex h-32 items-end gap-2">
          {dashboardChart.map(([day, n]) => (
            <div key={day} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[10px] text-muted">{n}</span>
              <div
                className="w-full rounded-sm bg-accent"
                style={{ height: `${Math.max((n / maxDM) * 100, 4)}%` }}
              />
              <span className="text-[10px] text-zinc-500">{day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-foreground">Atividade recente</p>
        <div className="mt-3 space-y-2">
          {dashboardActivity.map(([user, automation, status, color]) => (
            <div
              key={user}
              className="flex items-center justify-between gap-3 border-b border-border py-2 text-sm last:border-0"
            >
              <span className="truncate text-foreground">{user}</span>
              <span className="truncate text-muted">{automation}</span>
              <span className={`text-sm ${color}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </AppWindow>
  );
}

async function getGitHubStars(): Promise<number | null> {
  try {
    const res = await fetch("https://api.github.com/repos/ricartecinf-hue/easyflow", {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const stars = await getGitHubStars();
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Página inicial do EasyFlow">
            <span className="text-lg font-bold text-zinc-900">EasyFlow</span>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900"
              aria-label="Ver EasyFlow no GitHub"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d={githubIconPath} />
              </svg>
              {stars !== null && <span>{formatStars(stars)}</span>}
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Começar
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-12 sm:px-6 sm:pt-18 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-600">
            Código aberto · API oficial da Meta
          </div>

          <h1 className="mt-7 text-balance text-5xl font-black leading-[1.02] text-zinc-900 sm:text-6xl lg:text-7xl">
            Transforme cada comentário na DM certa
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            Quando alguém comenta sua palavra-chave em uma publicação ou reel,
            recebe sua DM segundos depois. Com hospedagem própria e integração
            pela API oficial do Instagram.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Começar
            </Link>
            <a
              href="#how"
              className="inline-flex items-center justify-center border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-100"
            >
              Veja como funciona
            </a>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="border border-zinc-200 bg-zinc-50 p-4">
                <dt className="text-2xl font-black text-zinc-900">{stat.value}</dt>
                <dd className="mt-1 text-xs leading-5 text-zinc-500">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <OverviewPreview />
          <div className="absolute -bottom-8 -left-6 hidden lg:block">
            <MatchedCommentCard />
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-orange-600">Como funciona</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-zinc-900 sm:text-5xl">
              Entrou um comentário, saiu uma DM
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-600">
              São três passos: conecte uma conta, crie uma campanha e deixe o
              EasyFlow trabalhar. O webhook cuida dos eventos em tempo real e a
              verificação complementar recupera o que não chegar por ele.
            </p>
          </div>

          <div className="grid gap-4">
            {flowSteps.map((step) => (
              <article
                key={step.title}
                className="grid gap-4 border border-zinc-200 bg-zinc-50 p-5 sm:grid-cols-[120px_1fr]"
              >
                <p className="text-sm font-bold text-orange-600">{step.eyebrow}</p>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:items-center">
          <DashboardPreview />

          <div>
            <p className="text-sm font-bold uppercase text-orange-600">O painel</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-zinc-900 sm:text-5xl">
              Saiba exatamente o que aconteceu
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-600">
              Cada comentário pode ser acompanhado: recebido, identificado,
              enviado, ignorado, com falha ou limitado. Tudo fica registrado.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase text-orange-600">O que está incluído</p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-zinc-900 sm:text-5xl">
            Tudo disponível, sem níveis
          </h2>
          <p className="mt-5 text-base leading-8 text-zinc-600">
            O sistema tem hospedagem própria e código aberto. Você administra a
            infraestrutura e mantém o controle dos seus dados.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-700"
            >
              {feature}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 border border-orange-200 bg-orange-50 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="max-w-3xl text-4xl font-black leading-tight text-zinc-900 sm:text-5xl">
              Transforme os comentários do próximo reel em DMs
            </h2>
            <p className="mt-4 text-base text-zinc-600">
              Código aberto e com hospedagem própria.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Começar
            </Link>
            <a
              href={GITHUB_URL}
              className="inline-flex items-center justify-center border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-100"
            >
              Ver no GitHub
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 py-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 text-sm text-zinc-500 sm:px-6 lg:px-8">
          <span className="font-semibold text-zinc-600">EasyFlow</span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-zinc-900"
          >
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="h-4 w-4 fill-current"
            >
              <path d={githubIconPath} />
            </svg>
            {stars !== null && <span>{formatStars(stars)}</span>}
          </a>
        </div>
      </footer>
    </main>
  );
}
