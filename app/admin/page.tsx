import Link from "next/link";
import { redirect } from "next/navigation";
import AdminWorkspaces from "@/components/admin-workspaces";
import { getSystemAdminSession } from "@/lib/admin-access";

export default async function AdminPage() {
  const session = await getSystemAdminSession();
  if (!session) redirect("/dashboard");

  return (
    <main className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-lg font-semibold">EasyFlow</p>
            <p className="text-xs text-muted">Administração de contas</p>
          </div>
          <Link href="/dashboard" className="rounded border border-border px-4 py-2 text-sm hover:bg-surface">
            Voltar ao painel
          </Link>
        </div>
      </header>
      <AdminWorkspaces />
    </main>
  );
}
