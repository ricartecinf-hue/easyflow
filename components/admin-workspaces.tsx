"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type AccessStatus = "ACTIVE" | "PAST_DUE" | "BLOCKED";
type AccessMode = "FREE" | "PAID";

interface WorkspaceItem {
  id: string;
  name: string;
  accessStatus: AccessStatus;
  accessMode: AccessMode;
  accessReason: string | null;
  accessExpiresAt: string | null;
  lastAccessAt: string | null;
  asaasPaymentStatus: string | null;
  createdAt: string;
  owner: { email: string | null; name: string | null; createdAt: string; lastAccessAt: string | null };
  _count: {
    members: number;
    instagramAccounts: number;
    automations: number;
    dmLogs: number;
  };
}

interface AdminData {
  metrics: {
    users: number;
    workspaces: number;
    instagramConnected: number;
    active7: number;
    active30: number;
    activeCampaigns: number;
    dmsSent: number;
  };
  workspaces: WorkspaceItem[];
}

async function fetchAdminData(): Promise<AdminData> {
  const response = await fetch("/api/admin/workspaces", { cache: "no-store" });
  const payload = await response.json();
  if (!response.ok || !payload.success) {
    throw new Error(payload.error ?? "Não foi possível carregar as contas");
  }
  return payload.data as AdminData;
}

const statusLabel: Record<AccessStatus, string> = {
  ACTIVE: "Ativa",
  PAST_DUE: "Em atraso",
  BLOCKED: "Desativada",
};

function formatDate(value: string | null) {
  if (!value) return "Nunca";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminWorkspaces() {
  const [data, setData] = useState<AdminData | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await fetchAdminData());
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar as contas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchAdminData()
      .then((payload) => {
        if (!cancelled) setData(payload);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar as contas");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data?.workspaces ?? [];
    return (data?.workspaces ?? []).filter((workspace) =>
      [workspace.name, workspace.owner.email, workspace.owner.name]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  }, [data, search]);

  async function updateWorkspace(
    workspace: WorkspaceItem,
    update: { status?: "ACTIVE" | "BLOCKED"; mode?: AccessMode }
  ) {
    const status = update.status ?? (workspace.accessStatus === "PAST_DUE" ? "BLOCKED" : workspace.accessStatus);
    const mode = update.mode ?? workspace.accessMode;
    const action = status === "ACTIVE" ? "ativar" : "desativar";
    if (update.status && !window.confirm(`Deseja ${action} a conta de ${workspace.owner.email ?? workspace.name}?`)) {
      return;
    }

    setBusy(workspace.id);
    setError(null);
    const response = await fetch("/api/admin/workspaces", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId: workspace.id,
        status,
        mode,
        reason:
          status === "ACTIVE"
            ? mode === "FREE"
              ? "Acesso gratuito liberado manualmente"
              : "Acesso pago liberado manualmente"
            : "Acesso desativado manualmente",
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.success) {
      setError(payload.error ?? "Não foi possível atualizar a conta");
    } else {
      await load();
    }
    setBusy(null);
  }

  if (loading) {
    return <div className="mx-auto max-w-7xl p-6 text-sm text-muted">Carregando contas...</div>;
  }

  const metricCards = data
    ? [
        ["Usuários", data.metrics.users],
        ["Contas", data.metrics.workspaces],
        ["Instagram conectado", data.metrics.instagramConnected],
        ["Ativos em 7 dias", data.metrics.active7],
        ["Ativos em 30 dias", data.metrics.active30],
        ["Campanhas ativas", data.metrics.activeCampaigns],
        ["DMs enviadas", data.metrics.dmsSent],
      ]
    : [];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      {error && <div className="rounded border border-error/30 bg-error/5 p-3 text-sm text-error">{error}</div>}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {metricCards.map(([label, value]) => (
          <div key={label} className="rounded border border-border bg-surface p-4">
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Contas do EasyFlow</h1>
            <p className="text-sm text-muted">Ative testes gratuitos ou deixe o Asaas controlar contas pagas.</p>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome ou e-mail"
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm sm:w-80"
          />
        </div>

        <div className="space-y-3">
          {visible.map((workspace) => (
            <article key={workspace.id} className="rounded border border-border p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-semibold">{workspace.owner.name || workspace.owner.email || workspace.name}</h2>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      workspace.accessStatus === "ACTIVE"
                        ? "bg-success/10 text-success"
                        : workspace.accessStatus === "PAST_DUE"
                          ? "bg-warning/10 text-warning"
                          : "bg-error/10 text-error"
                    }`}>
                      {statusLabel[workspace.accessStatus]}
                    </span>
                    <span className="rounded-full bg-surface px-2 py-1 text-xs">
                      {workspace.accessMode === "FREE" ? "Gratuita" : "Paga"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">{workspace.owner.email}</p>
                  <p className="mt-2 text-xs text-muted">
                    Último acesso: {formatDate(workspace.owner.lastAccessAt ?? workspace.lastAccessAt)} · {workspace._count.instagramAccounts} Instagram · {workspace._count.automations} campanhas · {workspace._count.dmLogs} DMs
                  </p>
                  {workspace.accessReason && <p className="mt-1 text-xs text-muted">{workspace.accessReason}</p>}
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    aria-label="Tipo de acesso"
                    value={workspace.accessMode}
                    disabled={busy === workspace.id}
                    onChange={(event) => updateWorkspace(workspace, { mode: event.target.value as AccessMode })}
                    className="rounded border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="FREE">Gratuita</option>
                    <option value="PAID">Paga / Asaas</option>
                  </select>
                  <button
                    disabled={busy === workspace.id}
                    onClick={() =>
                      updateWorkspace(workspace, {
                        status: workspace.accessStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE",
                      })
                    }
                    className={`rounded px-4 py-2 text-sm font-medium disabled:opacity-50 ${
                      workspace.accessStatus === "ACTIVE"
                        ? "border border-error/40 text-error hover:bg-error/5"
                        : "bg-accent text-white hover:bg-accent-hover"
                    }`}
                  >
                    {busy === workspace.id
                      ? "Salvando..."
                      : workspace.accessStatus === "ACTIVE"
                        ? "Desativar"
                        : "Ativar"}
                  </button>
                </div>
              </div>
            </article>
          ))}
          {visible.length === 0 && <p className="rounded border border-border p-6 text-sm text-muted">Nenhuma conta encontrada.</p>}
        </div>
      </section>
    </div>
  );
}
