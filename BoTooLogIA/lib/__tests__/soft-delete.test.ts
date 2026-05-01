import { describe, it, expect, vi, beforeEach } from "vitest";

const updateMock = vi.fn().mockResolvedValue({});

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { update: updateMock },
    contact: { update: updateMock },
    prospect: { update: updateMock },
    session: { update: updateMock },
    auditLog: { update: updateMock },
    revenue: { update: updateMock },
    appSettings: { update: updateMock },
    analytics: { update: updateMock },
    pageView: { update: updateMock },
    activity: { update: updateMock },
    notification: { update: updateMock },
    botConversation: { update: updateMock },
    scheduledTask: { update: updateMock },
  },
}));

describe("softDelete", () => {
  beforeEach(() => {
    updateMock.mockClear();
  });

  it("appelle update avec deletedAt pour contact", async () => {
    const { softDelete } = await import("@/lib/api/soft-delete");
    await softDelete("contact", "cuid123");
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: "cuid123" },
      data: { deletedAt: expect.any(Date) },
    });
  });

  it("appelle update pour user", async () => {
    const { softDelete } = await import("@/lib/api/soft-delete");
    await softDelete("user", "u1");
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { deletedAt: expect.any(Date) },
    });
  });
});
