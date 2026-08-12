import type {
  WorkspaceAccessMode,
  WorkspaceAccessStatus,
} from "@/app/generated/prisma/client";
import { prisma } from "@/lib/db/client";

export type WorkspaceAccessFields = {
  accessStatus: WorkspaceAccessStatus;
  accessMode: WorkspaceAccessMode;
  accessExpiresAt: Date | null;
  gracePeriodEndsAt: Date | null;
};

export function isWorkspaceOperational(
  workspace: WorkspaceAccessFields,
  now = new Date()
): boolean {
  if (
    workspace.accessExpiresAt &&
    workspace.accessExpiresAt.getTime() <= now.getTime()
  ) {
    return false;
  }

  if (workspace.accessStatus === "ACTIVE") return true;

  return Boolean(
    workspace.accessStatus === "PAST_DUE" &&
      workspace.gracePeriodEndsAt &&
      workspace.gracePeriodEndsAt.getTime() > now.getTime()
  );
}

export function getAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isSystemAdmin(email?: string | null): boolean {
  return Boolean(email && getAdminEmails().has(email.trim().toLowerCase()));
}

export async function recordWorkspaceAccess(
  workspaceId: string,
  userId: string
): Promise<void> {
  const threshold = new Date(Date.now() - 15 * 60 * 1000);
  const now = new Date();
  await Promise.all([
    prisma.workspace.updateMany({
      where: {
        id: workspaceId,
        OR: [{ lastAccessAt: null }, { lastAccessAt: { lt: threshold } }],
      },
      data: { lastAccessAt: now },
    }),
    prisma.user.updateMany({
      where: {
        id: userId,
        OR: [{ lastAccessAt: null }, { lastAccessAt: { lt: threshold } }],
      },
      data: { lastAccessAt: now },
    }),
  ]);
}
