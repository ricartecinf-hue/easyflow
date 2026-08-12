import { afterEach, describe, expect, it, vi } from "vitest";
import { isWorkspaceOperational } from "../lib/access-control";

const baseWorkspace = {
  accessStatus: "ACTIVE" as const,
  accessMode: "PAID" as const,
  accessExpiresAt: null,
  gracePeriodEndsAt: null,
};

afterEach(() => {
  vi.useRealTimers();
});

describe("isWorkspaceOperational", () => {
  it("allows an active account", () => {
    expect(isWorkspaceOperational(baseWorkspace)).toBe(true);
  });

  it("blocks a manually blocked account", () => {
    expect(
      isWorkspaceOperational({ ...baseWorkspace, accessStatus: "BLOCKED" })
    ).toBe(false);
  });

  it("allows an overdue paid account during its grace period", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-12T12:00:00.000Z"));
    expect(
      isWorkspaceOperational({
        ...baseWorkspace,
        accessStatus: "PAST_DUE",
        gracePeriodEndsAt: new Date("2026-08-13T12:00:00.000Z"),
      })
    ).toBe(true);
  });

  it("blocks an overdue account after its grace period", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-14T12:00:00.000Z"));
    expect(
      isWorkspaceOperational({
        ...baseWorkspace,
        accessStatus: "PAST_DUE",
        gracePeriodEndsAt: new Date("2026-08-13T12:00:00.000Z"),
      })
    ).toBe(false);
  });

  it("blocks an active free trial after its expiration", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-14T12:00:00.000Z"));
    expect(
      isWorkspaceOperational({
        ...baseWorkspace,
        accessMode: "FREE",
        accessExpiresAt: new Date("2026-08-13T12:00:00.000Z"),
      })
    ).toBe(false);
  });
});
