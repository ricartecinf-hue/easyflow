import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    $transaction: vi.fn(),
    asaasWebhookEvent: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    workspace: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    workspaceAccessEvent: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/db/client", () => ({ prisma: mockPrisma }));

import { POST } from "../app/api/webhooks/asaas/route";

const paidWorkspace = {
  id: "workspace_1",
  accessStatus: "BLOCKED",
  accessMode: "PAID",
  asaasCustomerId: "cus_1",
  asaasSubscriptionId: null,
  asaasLastEventAt: null,
};

function request(payload: object, token = "webhook-secret") {
  return new NextRequest("http://localhost/api/webhooks/asaas", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "asaas-access-token": token,
    },
    body: JSON.stringify(payload),
  });
}

function confirmedPayload() {
  return {
    id: "evt_1",
    event: "PAYMENT_CONFIRMED",
    dateCreated: "2026-08-12T15:00:00.000Z",
    payment: {
      id: "pay_1",
      customer: "cus_1",
      subscription: "sub_1",
      status: "CONFIRMED",
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("ASAAS_WEBHOOK_TOKEN", "webhook-secret");
  vi.stubEnv("ASAAS_GRACE_PERIOD_DAYS", "3");
  mockPrisma.asaasWebhookEvent.findUnique.mockResolvedValue(null);
  mockPrisma.asaasWebhookEvent.create.mockResolvedValue({});
  mockPrisma.asaasWebhookEvent.update.mockResolvedValue({});
  mockPrisma.workspace.findUnique.mockResolvedValue(paidWorkspace);
  mockPrisma.workspace.update.mockResolvedValue({});
  mockPrisma.workspaceAccessEvent.create.mockResolvedValue({});
  mockPrisma.$transaction.mockResolvedValue([]);
});

describe("Asaas webhook", () => {
  it("rejects a request with the wrong webhook token", async () => {
    const response = await POST(request(confirmedPayload(), "wrong-token"));

    expect(response.status).toBe(401);
    expect(mockPrisma.asaasWebhookEvent.create).not.toHaveBeenCalled();
  });

  it("activates a paid workspace after a confirmed payment", async () => {
    const response = await POST(request(confirmedPayload()));

    expect(response.status).toBe(200);
    expect(mockPrisma.workspace.update).toHaveBeenCalledWith({
      where: { id: "workspace_1" },
      data: expect.objectContaining({
        accessStatus: "ACTIVE",
        asaasCustomerId: "cus_1",
        asaasSubscriptionId: "sub_1",
        asaasPaymentStatus: "CONFIRMED",
      }),
    });
    expect(mockPrisma.workspaceAccessEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        source: "ASAAS",
        previousStatus: "BLOCKED",
        newStatus: "ACTIVE",
        externalEventId: "evt_1",
      }),
    });
  });

  it("never changes a workspace manually marked as free", async () => {
    mockPrisma.workspace.findUnique.mockResolvedValue({
      ...paidWorkspace,
      accessStatus: "ACTIVE",
      accessMode: "FREE",
    });

    const response = await POST(request(confirmedPayload()));
    const body = await response.json();

    expect(body.ignored).toBe("free-account");
    expect(mockPrisma.workspace.update).not.toHaveBeenCalled();
    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
  });

  it("acknowledges an event that was already processed", async () => {
    mockPrisma.asaasWebhookEvent.findUnique.mockResolvedValue({
      id: "evt_1",
      status: "PROCESSED",
      updatedAt: new Date(),
    });

    const response = await POST(request(confirmedPayload()));
    const body = await response.json();

    expect(body.duplicate).toBe(true);
    expect(mockPrisma.workspace.findUnique).not.toHaveBeenCalled();
  });
});
