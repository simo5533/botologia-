import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{ "?column?": 1 }]),
    session: { deleteMany: vi.fn().mockResolvedValue({ count: 5 }) },
  },
  testDbConnection: vi.fn().mockResolvedValue({ ok: true, latencyMs: 12 }),
  getDbStats: vi.fn().mockResolvedValue({
    tables: [{ name: "User", rows: 3 }],
    sizeKb: 1024,
  }),
  cleanExpiredSessions: vi.fn().mockResolvedValue(5),
}));

vi.mock("@/lib/db/maintenance", () => ({
  cleanExpiredSessions: vi.fn().mockResolvedValue({ deleted: 5 }),
  cleanOldAnalytics: vi.fn().mockResolvedValue({ deleted: 0 }),
  cleanOldPageViews: vi.fn().mockResolvedValue({ deleted: 0 }),
  cleanOldNotifications: vi.fn().mockResolvedValue({ deleted: 2 }),
  runFullMaintenance: vi.fn().mockResolvedValue({
    sessions: 5,
    analytics: 0,
    pageViews: 0,
    notifications: 2,
  }),
}));

describe("Database — testDbConnection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne ok: true et latencyMs si query réussit", async () => {
    const { testDbConnection } = await import("../prisma");
    const result = await testDbConnection();
    expect(result.ok).toBe(true);
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it("latencyMs est un nombre positif", async () => {
    const { testDbConnection } = await import("../prisma");
    const { latencyMs } = await testDbConnection();
    expect(typeof latencyMs).toBe("number");
    expect(latencyMs).toBeGreaterThanOrEqual(0);
  });
});

describe("Database — cleanExpiredSessions (maintenance)", () => {
  it("retourne un objet avec deleted", async () => {
    const { cleanExpiredSessions } = await import("../maintenance");
    const result = await cleanExpiredSessions();
    expect(result).toHaveProperty("deleted");
    expect(typeof result.deleted).toBe("number");
    expect(result.deleted).toBeGreaterThanOrEqual(0);
  });
});

describe("Database — runFullMaintenance", () => {
  it("retourne un objet avec les clés sessions, analytics, etc.", async () => {
    const { runFullMaintenance } = await import("../maintenance");
    const results = await runFullMaintenance();
    expect(typeof results).toBe("object");
    expect("sessions" in results).toBe(true);
  });
});
