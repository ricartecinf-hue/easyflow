import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/db/client";

const ASAAS_URL = "https://api.asaas.com/v3";
const ACTIVATE_EVENTS = new Set(["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED", "PAYMENT_RESTORED"]);
const OVERDUE_EVENTS = new Set(["PAYMENT_OVERDUE"]);
const BLOCK_EVENTS = new Set([
  "PAYMENT_DELETED",
  "PAYMENT_REFUNDED",
  "PAYMENT_CHARGEBACK_REQUESTED",
  "PAYMENT_CHARGEBACK_DISPUTE",
]);

type AsaasPayload = {
  id?: string;
  event?: string;
  dateCreated?: string;
  payment?: {
    id?: string;
    customer?: string;
    subscription?: string;
    status?: string;
  };
};

function validWebhookToken(received: string): boolean {
  const configured = process.env.ASAAS_WEBHOOK_TOKEN ?? "";
  if (!configured || !received) return false;
  const actual = Buffer.from(received);
  const expected = Buffer.from(configured);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function getCustomerEmail(customerId: string): Promise<string | null> {
  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey) throw new Error("ASAAS_API_KEY is not configured");
  const response = await fetch(`${ASAAS_URL}/customers/${encodeURIComponent(customerId)}`, {
    headers: { access_token: apiKey },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Asaas customer lookup failed (${response.status})`);
  const customer = (await response.json()) as { email?: string };
  return customer.email?.trim().toLowerCase() ?? null;
}

export async function POST(request: NextRequest) {
  if (!validWebhookToken(request.headers.get("asaas-access-token") ?? "")) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as AsaasPayload | null;
  const eventId = payload?.id;
  const eventType = payload?.event;
  if (!payload || !eventId || !eventType) {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }

  const knownEvent = ACTIVATE_EVENTS.has(eventType) || OVERDUE_EVENTS.has(eventType) || BLOCK_EVENTS.has(eventType);
  const existing = await prisma.asaasWebhookEvent.findUnique({ where: { id: eventId } });
  if (existing?.status === "PROCESSED" || existing?.status === "IGNORED") {
    return NextResponse.json({ success: true, duplicate: true });
  }

  // A webhook may be delivered more than once or concurrently. Only retry a
  // failed event (or a PROCESSING event that has been stale for five minutes).
  // A unique event ID makes the create path safe under concurrent deliveries.
  if (existing) {
    const staleBefore = new Date(Date.now() - 5 * 60 * 1000);
    if (existing.status === "PROCESSING" && existing.updatedAt > staleBefore) {
      return NextResponse.json({ success: true, duplicate: true, processing: true });
    }
    await prisma.asaasWebhookEvent.update({
      where: { id: eventId },
      data: {
        eventType,
        status: knownEvent ? "PROCESSING" : "IGNORED",
        payload: payload as Prisma.InputJsonValue,
        errorMessage: null,
        processedAt: knownEvent ? null : new Date(),
      },
    });
  } else {
    try {
      await prisma.asaasWebhookEvent.create({
        data: {
          id: eventId,
          eventType,
          status: knownEvent ? "PROCESSING" : "IGNORED",
          payload: payload as Prisma.InputJsonValue,
          processedAt: knownEvent ? null : new Date(),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return NextResponse.json({ success: true, duplicate: true });
      }
      throw error;
    }
  }

  if (!knownEvent) return NextResponse.json({ success: true, ignored: true });

  try {
    const customerId = payload.payment?.customer;
    if (!customerId) throw new Error("Payment customer is missing");

    let workspace = await prisma.workspace.findUnique({ where: { asaasCustomerId: customerId } });
    if (!workspace) {
      const email = await getCustomerEmail(customerId);
      if (!email) throw new Error("Asaas customer has no email");
      workspace = await prisma.workspace.findFirst({
        where: { owner: { email: { equals: email, mode: "insensitive" } } },
        orderBy: { createdAt: "asc" },
      });
    }

    if (!workspace) throw new Error("No EasyFlow account matches the Asaas customer");

    const parsedEventDate = payload.dateCreated ? new Date(payload.dateCreated) : null;
    const eventOccurredAt =
      parsedEventDate && !Number.isNaN(parsedEventDate.getTime())
        ? parsedEventDate
        : new Date();

    if (workspace.asaasLastEventAt && workspace.asaasLastEventAt > eventOccurredAt) {
      await prisma.asaasWebhookEvent.update({
        where: { id: eventId },
        data: {
          workspaceId: workspace.id,
          status: "IGNORED",
          errorMessage: "Evento anterior ao último evento processado",
          processedAt: new Date(),
        },
      });
      return NextResponse.json({ success: true, ignored: "stale-event" });
    }

    if (workspace.accessMode === "FREE") {
      await prisma.asaasWebhookEvent.update({
        where: { id: eventId },
        data: { workspaceId: workspace.id, status: "IGNORED", processedAt: new Date() },
      });
      return NextResponse.json({ success: true, ignored: "free-account" });
    }

    const previousStatus = workspace.accessStatus;
    let newStatus: "ACTIVE" | "PAST_DUE" | "BLOCKED" = "BLOCKED";
    let gracePeriodEndsAt: Date | null = null;
    if (ACTIVATE_EVENTS.has(eventType)) newStatus = "ACTIVE";
    if (OVERDUE_EVENTS.has(eventType)) {
      newStatus = "PAST_DUE";
      const graceDays = Math.max(0, Number(process.env.ASAAS_GRACE_PERIOD_DAYS ?? "3") || 0);
      gracePeriodEndsAt = new Date(Date.now() + graceDays * 24 * 60 * 60 * 1000);
    }

    await prisma.$transaction([
      prisma.workspace.update({
        where: { id: workspace.id },
        data: {
          accessStatus: newStatus,
          accessReason: `Asaas: ${eventType}`,
          gracePeriodEndsAt,
          accessUpdatedAt: new Date(),
          accessUpdatedBy: null,
          asaasCustomerId: customerId,
          asaasSubscriptionId: payload.payment?.subscription ?? workspace.asaasSubscriptionId,
          asaasPaymentStatus: payload.payment?.status ?? eventType,
          asaasLastEventAt: eventOccurredAt,
        },
      }),
      prisma.workspaceAccessEvent.create({
        data: {
          workspaceId: workspace.id,
          source: "ASAAS",
          previousStatus,
          newStatus,
          previousMode: workspace.accessMode,
          newMode: workspace.accessMode,
          reason: eventType,
          externalEventId: eventId,
        },
      }),
      prisma.asaasWebhookEvent.update({
        where: { id: eventId },
        data: { workspaceId: workspace.id, status: "PROCESSED", processedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    await prisma.asaasWebhookEvent.update({
      where: { id: eventId },
      data: {
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    });
    console.error("[Asaas Webhook] Processing failed:", error);
    return NextResponse.json({ success: false, error: "Processing failed" }, { status: 500 });
  }
}
