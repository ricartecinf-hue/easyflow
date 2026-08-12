import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { getSystemAdminSession } from "@/lib/admin-access";

const updateSchema = z.object({
  workspaceId: z.string().min(1),
  status: z.enum(["ACTIVE", "BLOCKED"]),
  mode: z.enum(["FREE", "PAID"]),
  reason: z.string().trim().max(500).optional(),
  accessExpiresAt: z.string().datetime().nullable().optional(),
});

export async function GET() {
  const session = await getSystemAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [workspaces, users, active7, active30, activeCampaigns, dmsSent] = await Promise.all([
    prisma.workspace.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { email: true, name: true, createdAt: true, lastAccessAt: true } },
        _count: {
          select: {
            members: true,
            instagramAccounts: true,
            automations: true,
            dmLogs: true,
          },
        },
      },
    }),
    prisma.user.count(),
    prisma.user.count({ where: { lastAccessAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { lastAccessAt: { gte: thirtyDaysAgo } } }),
    prisma.automation.count({ where: { isActive: true } }),
    prisma.dmLog.count({ where: { status: "SENT" } }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      metrics: {
        users,
        workspaces: workspaces.length,
        instagramConnected: workspaces.filter((item) => item._count.instagramAccounts > 0).length,
        active7,
        active30,
        activeCampaigns,
        dmsSent,
      },
      workspaces,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const session = await getSystemAdminSession();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const current = await prisma.workspace.findUnique({
    where: { id: parsed.data.workspaceId },
  });
  if (!current) {
    return NextResponse.json({ success: false, error: "Conta não encontrada" }, { status: 404 });
  }

  const accessExpiresAt = parsed.data.accessExpiresAt
    ? new Date(parsed.data.accessExpiresAt)
    : null;

  const updated = await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.update({
      where: { id: current.id },
      data: {
        accessStatus: parsed.data.status,
        accessMode: parsed.data.mode,
        accessReason: parsed.data.reason || null,
        accessExpiresAt,
        gracePeriodEndsAt: null,
        accessUpdatedAt: new Date(),
        accessUpdatedBy: session.user.id,
      },
    });

    await tx.workspaceAccessEvent.create({
      data: {
        workspaceId: current.id,
        source: "ADMIN",
        previousStatus: current.accessStatus,
        newStatus: parsed.data.status,
        previousMode: current.accessMode,
        newMode: parsed.data.mode,
        reason: parsed.data.reason || null,
        actorUserId: session.user.id,
      },
    });
    return workspace;
  });

  return NextResponse.json({ success: true, data: updated });
}
