import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { isSystemAdmin, isWorkspaceOperational } from "@/lib/access-control";
import { ensureWorkspaceForUser } from "@/lib/workspace";

const statusLabels = {
  BLOCKED: "Acesso desativado",
  PAST_DUE: "Pagamento pendente",
  ACTIVE: "Acesso ativo",
} as const;

export default async function AccessBlockedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const workspace = await ensureWorkspaceForUser(session.user.id, session.user.email);
  if (isSystemAdmin(session.user.email) || isWorkspaceOperational(workspace)) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-dvh bg-surface px-4 py-12">
      <div className="mx-auto max-w-lg rounded border border-border bg-background p-6 sm:p-8">
        <Link href="/" className="text-lg font-semibold">EasyFlow</Link>
        <h1 className="mt-8 text-2xl font-semibold">
          {statusLabels[workspace.accessStatus]}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Esta conta ainda não está liberada para usar o EasyFlow. Se você recebeu
          um acesso de teste ou já realizou o pagamento, fale com o responsável
          para a ativação.
        </p>
        {workspace.accessReason && (
          <div className="mt-5 rounded border border-border bg-surface p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Motivo</p>
            <p className="mt-1 text-sm">{workspace.accessReason}</p>
          </div>
        )}
        <p className="mt-5 text-xs text-muted">Conta: {session.user.email}</p>
        <form
          className="mt-6"
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button className="rounded border border-border px-4 py-2 text-sm hover:bg-surface">
            Sair da conta
          </button>
        </form>
      </div>
    </main>
  );
}
