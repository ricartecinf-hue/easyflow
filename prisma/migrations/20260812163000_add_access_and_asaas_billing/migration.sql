-- Add global access control and Asaas billing state.
-- Existing workspaces are preserved as active/free. New workspaces start
-- blocked/paid until an administrator or a confirmed payment activates them.

CREATE TYPE "WorkspaceAccessStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'BLOCKED');
CREATE TYPE "WorkspaceAccessMode" AS ENUM ('FREE', 'PAID');
CREATE TYPE "AccessChangeSource" AS ENUM ('SYSTEM', 'ADMIN', 'ASAAS');
CREATE TYPE "AsaasEventStatus" AS ENUM ('PROCESSING', 'PROCESSED', 'IGNORED', 'FAILED');

ALTER TABLE "User" ADD COLUMN "lastAccessAt" TIMESTAMP(3);
CREATE INDEX "User_lastAccessAt_idx" ON "User"("lastAccessAt");

ALTER TABLE "Workspace"
  ADD COLUMN "accessStatus" "WorkspaceAccessStatus" NOT NULL DEFAULT 'BLOCKED',
  ADD COLUMN "accessMode" "WorkspaceAccessMode" NOT NULL DEFAULT 'PAID',
  ADD COLUMN "accessReason" TEXT,
  ADD COLUMN "accessExpiresAt" TIMESTAMP(3),
  ADD COLUMN "gracePeriodEndsAt" TIMESTAMP(3),
  ADD COLUMN "lastAccessAt" TIMESTAMP(3),
  ADD COLUMN "accessUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "accessUpdatedBy" TEXT,
  ADD COLUMN "asaasCustomerId" TEXT,
  ADD COLUMN "asaasSubscriptionId" TEXT,
  ADD COLUMN "asaasPaymentStatus" TEXT,
  ADD COLUMN "asaasLastEventAt" TIMESTAMP(3);

UPDATE "Workspace"
SET
  "accessStatus" = 'ACTIVE',
  "accessMode" = 'FREE',
  "accessReason" = 'Conta existente preservada na implantação do controle de acesso',
  "accessUpdatedAt" = CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX "Workspace_asaasCustomerId_key" ON "Workspace"("asaasCustomerId");
CREATE INDEX "Workspace_lastAccessAt_idx" ON "Workspace"("lastAccessAt");
CREATE INDEX "Workspace_accessStatus_accessMode_idx" ON "Workspace"("accessStatus", "accessMode");

CREATE TABLE "WorkspaceAccessEvent" (
  "id" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "source" "AccessChangeSource" NOT NULL,
  "previousStatus" "WorkspaceAccessStatus",
  "newStatus" "WorkspaceAccessStatus" NOT NULL,
  "previousMode" "WorkspaceAccessMode",
  "newMode" "WorkspaceAccessMode" NOT NULL,
  "reason" TEXT,
  "actorUserId" TEXT,
  "externalEventId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WorkspaceAccessEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "WorkspaceAccessEvent_workspaceId_createdAt_idx"
  ON "WorkspaceAccessEvent"("workspaceId", "createdAt");
CREATE INDEX "WorkspaceAccessEvent_externalEventId_idx"
  ON "WorkspaceAccessEvent"("externalEventId");

CREATE TABLE "AsaasWebhookEvent" (
  "id" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "workspaceId" TEXT,
  "status" "AsaasEventStatus" NOT NULL DEFAULT 'PROCESSING',
  "payload" JSONB NOT NULL,
  "errorMessage" TEXT,
  "processedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AsaasWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AsaasWebhookEvent_workspaceId_idx" ON "AsaasWebhookEvent"("workspaceId");
CREATE INDEX "AsaasWebhookEvent_status_idx" ON "AsaasWebhookEvent"("status");
CREATE INDEX "AsaasWebhookEvent_createdAt_idx" ON "AsaasWebhookEvent"("createdAt");

ALTER TABLE "WorkspaceAccessEvent"
  ADD CONSTRAINT "WorkspaceAccessEvent_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AsaasWebhookEvent"
  ADD CONSTRAINT "AsaasWebhookEvent_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
