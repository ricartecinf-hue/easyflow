"use client";

/**
 * Instagram Overview Page
 *
 * Aggregate reach/engagement across your recent posts, plus a per-post table.
 * Views / reach / saved / shares come from Instagram media insights (requires
 * the insights permission); likes and comments are always available.
 */

import { useEffect, useState } from "react";
import AccountSelect from "@/components/account-select";
import StatCard from "@/components/stat-card";
import type { OverviewResponse } from "@/app/api/instagram/overview/route";

function formatNumber(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { month: "short", day: "numeric" });
}

const INITIAL_POST_COUNT = 2;
const LOAD_MORE_COUNT = 10;

export default function OverviewPage() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState("all");
  const [count, setCount] = useState(INITIAL_POST_COUNT);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedAccountId !== "all") {
      params.set("instagramAccountId", selectedAccountId);
    }
    params.set("count", String(count));

    let cancelled = false;

    fetch(`/api/instagram/overview?${params}`)
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          setData(res.data);
          setError(null);
        } else {
          setError(res.error ?? "Não foi possível carregar a visão geral");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Não foi possível carregar a visão geral");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedAccountId, count]);

  function handleAccountChange(accountId: string) {
    setLoading(true);
    setCount(INITIAL_POST_COUNT);
    setSelectedAccountId(accountId);
  }

  function handleLoadMore() {
    setLoadingMore(true);
    setCount((current) => current + LOAD_MORE_COUNT);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="panel rounded p-4 h-24 sm:p-5">
            <div className="h-4 w-16 bg-zinc-200 rounded" />
            <div className="mt-3 h-6 w-20 bg-zinc-200/60 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel rounded p-8 text-center">
        <p className="text-sm text-error">{error}</p>
        {error.includes("connect") && (
          <a
            href="/api/instagram/connect"
            className="mt-4 inline-block text-sm text-accent hover:underline"
          >
            Conectar Instagram
          </a>
        )}
      </div>
    );
  }

  if (!data) return null;

  const { totals, posts, accounts, insightsAvailable } = data;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-foreground">Visão geral</h1>
          <p className="text-sm text-muted mt-1">
            {totals.posts} {totals.posts === 1 ? "publicação recente" : "publicações recentes"} de @
            {data.account.username}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
          {accounts.length > 1 && (
            <AccountSelect
              accounts={accounts.map((a) => ({
                id: a.id,
                username: a.username,
                instagramId: a.id,
              }))}
              value={selectedAccountId}
              onChange={handleAccountChange}
            />
          )}
        </div>
      </div>

      {!insightsAvailable && (
        <div className="panel rounded p-4 border border-border">
          <p className="text-sm text-foreground">
            Visualizações, alcance, salvamentos e compartilhamentos exigem a permissão de insights.
          </p>
          <p className="text-sm text-muted mt-1">
            Reconecte sua conta para concedê-la. Enquanto isso, curtidas e comentários continuam visíveis.
          </p>
          <a
            href="/api/instagram/connect"
            className="mt-3 inline-block text-sm text-accent hover:underline"
          >
            Reconectar Instagram
          </a>
        </div>
      )}

      {/* Aggregate totals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard label="Visualizações" value={formatNumber(totals.views)} />
        <StatCard label="Alcance" value={formatNumber(totals.reach)} />
        <StatCard label="Curtidas" value={formatNumber(totals.likes)} />
        <StatCard label="Comentários" value={formatNumber(totals.comments)} />
        <StatCard label="Salvos" value={formatNumber(totals.saved)} />
        <StatCard label="Compartilhamentos" value={formatNumber(totals.shares)} />
      </div>

      {/* Per-post table */}
      <div className="panel rounded p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Publicações</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-muted py-8 text-center">Nenhuma publicação encontrada</p>
        ) : (
          // Eight metric columns can't compress into a phone; let the table keep
          // its natural width and scroll inside the panel instead.
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-zinc-500 border-b border-border">
                  <th className="py-2 pr-4 font-medium">Publicação</th>
                  <th className="py-2 px-3 font-medium text-right">Visualizações</th>
                  <th className="py-2 px-3 font-medium text-right">Alcance</th>
                  <th className="py-2 px-3 font-medium text-right">Curtidas</th>
                  <th className="py-2 px-3 font-medium text-right">Comentários</th>
                  <th className="py-2 px-3 font-medium text-right">Salvos</th>
                  <th className="py-2 px-3 font-medium text-right">Compartilhamentos</th>
                  <th className="py-2 pl-3 font-medium text-right">Data</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-3 pr-4 max-w-xs">
                      {p.permalink ? (
                        <a
                          href={p.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground hover:text-accent truncate block"
                        >
                          {p.caption || `Publicação ${p.mediaType}`}
                        </a>
                      ) : (
                        <span className="text-foreground truncate block">
                          {p.caption || `Publicação ${p.mediaType}`}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-muted">
                      {formatNumber(p.views)}
                    </td>
                    <td className="py-3 px-3 text-right text-muted">
                      {formatNumber(p.reach)}
                    </td>
                    <td className="py-3 px-3 text-right text-muted">
                      {formatNumber(p.likes)}
                    </td>
                    <td className="py-3 px-3 text-right text-muted">
                      {formatNumber(p.comments)}
                    </td>
                    <td className="py-3 px-3 text-right text-muted">
                      {formatNumber(p.saved)}
                    </td>
                    <td className="py-3 px-3 text-right text-muted">
                      {formatNumber(p.shares)}
                    </td>
                    <td className="py-3 pl-3 text-right text-zinc-500">
                      {formatDate(p.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.hasMore && (
              <div className="flex justify-center border-t border-border pt-4">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent disabled:cursor-wait disabled:opacity-60"
                >
                  {loadingMore ? "Carregando…" : `Carregar mais ${LOAD_MORE_COUNT}`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
