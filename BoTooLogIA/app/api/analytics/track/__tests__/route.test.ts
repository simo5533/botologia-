import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockCreate = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    analytics: {
      create: (...args: unknown[]) => mockCreate(...args),
    },
  },
}));

describe("POST /api/analytics/track", () => {
  beforeEach(() => {
    mockCreate.mockReset();
    mockCreate.mockResolvedValue({ id: "a-1" });
  });

  it("retourne 200 avec page et event valides", async () => {
    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost:3000/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({
        page: "/botohub",
        event: "page_view",
        metadata: { device: "desktop" },
      }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toEqual({ ok: true });
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it("retourne 422 si body JSON invalide (corps traité comme {})", async () => {
    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost:3000/api/analytics/track", {
      method: "POST",
      body: "invalid json",
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Validation échouée");
    expect(body.details).toBeDefined();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("retourne 422 si page manquante", async () => {
    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost:3000/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ event: "page_view" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("retourne 422 si event manquant", async () => {
    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost:3000/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ page: "/" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
