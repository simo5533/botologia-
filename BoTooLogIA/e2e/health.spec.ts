import { test, expect } from "@playwright/test";

test.describe("API health", () => {
  test("GET /api/health retourne 200 + status ok", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    const body = (await res.json()) as { status?: string; db?: string };
    expect(body.status).toBe("ok");
    expect(body.db).toBe("connected");
  });
});
