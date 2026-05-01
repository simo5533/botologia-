import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/auth/session", () => ({
  getSessionCookieName: vi.fn(() => "botoologia_session"),
  getSessionUserId: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

async function getRequireAdminSession() {
  const { requireAdminSession } = await import("../auth-guard");
  return requireAdminSession;
}

function createRequest(cookieValue: string | null): NextRequest {
  const url = "http://localhost:3000/api/admin/test";
  const headers = new Headers();
  if (cookieValue) {
    headers.set("cookie", `botoologia_session=${cookieValue}`);
  }
  return new NextRequest(url, { headers });
}

describe("auth-guard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_PROTECTION_ENABLED = "true";
  });

  it("retourne allowed: false si pas de cookie", async () => {
    const session = await import("@/lib/auth/session");
    vi.mocked(session.getSessionUserId).mockResolvedValue(null);

    const requireAdminSession = await getRequireAdminSession();
    const result = await requireAdminSession(createRequest(null));

    expect(result.allowed).toBe(false);
    if (!result.allowed) expect(result.status).toBe(401);
  });

  it("retourne allowed: false si getSessionUserId retourne null", async () => {
    const session = await import("@/lib/auth/session");
    vi.mocked(session.getSessionUserId).mockResolvedValue(null);

    const requireAdminSession = await getRequireAdminSession();
    const result = await requireAdminSession(createRequest("some-token"));

    expect(result.allowed).toBe(false);
  });

  it("retourne allowed: false si rôle user", async () => {
    const session = await import("@/lib/auth/session");
    const prisma = await import("@/lib/prisma");
    vi.mocked(session.getSessionUserId).mockResolvedValue("user-1");
    vi.mocked(prisma.prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      role: "user",
    } as never);

    const requireAdminSession = await getRequireAdminSession();
    const result = await requireAdminSession(createRequest("token"));

    expect(result.allowed).toBe(false);
  });

  it("retourne allowed: true si rôle admin", async () => {
    const session = await import("@/lib/auth/session");
    const prisma = await import("@/lib/prisma");
    vi.mocked(session.getSessionUserId).mockResolvedValue("admin-1");
    vi.mocked(prisma.prisma.user.findUnique).mockResolvedValue({
      id: "admin-1",
      role: "admin",
    } as never);

    const requireAdminSession = await getRequireAdminSession();
    const result = await requireAdminSession(createRequest("token"));

    expect(result.allowed).toBe(true);
    if (result.allowed) {
      expect(result.userId).toBe("admin-1");
      expect(result.role).toBe("admin");
    }
  });

  it("retourne allowed: true si rôle boss", async () => {
    const session = await import("@/lib/auth/session");
    const prisma = await import("@/lib/prisma");
    vi.mocked(session.getSessionUserId).mockResolvedValue("boss-1");
    vi.mocked(prisma.prisma.user.findUnique).mockResolvedValue({
      id: "boss-1",
      role: "boss",
    } as never);

    const requireAdminSession = await getRequireAdminSession();
    const result = await requireAdminSession(createRequest("token"));

    expect(result.allowed).toBe(true);
    if (result.allowed) expect(result.role).toBe("boss");
  });
});
