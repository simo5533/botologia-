import { describe, it, expect } from "vitest";
import {
  apiSuccess,
  apiError,
  apiUnauthorized,
  apiServiceUnavailable,
  apiRateLimited,
  apiForbidden,
  apiNotFound,
} from "../response";

describe("api response helpers", () => {
  it("apiSuccess returns JSON with success true and data", async () => {
    const res = apiSuccess({ id: "1" }, 200);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual({ id: "1" });
  });

  it("apiError returns JSON with success false and error", async () => {
    const res = apiError("Bad request", 400);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("Bad request");
  });

  it("apiUnauthorized returns 401", async () => {
    const res = apiUnauthorized();
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("Non autorisé");
  });

  it("apiSuccess accepts custom status 201", async () => {
    const res = apiSuccess({ id: "1" }, 201);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual({ id: "1" });
  });

  it("apiError accepts custom status 401 and 500", async () => {
    const res401 = apiError("Non autorisé", 401);
    expect(res401.status).toBe(401);
    const res500 = apiError("Erreur serveur", 500);
    expect(res500.status).toBe(500);
  });

  it("apiServiceUnavailable returns 503", async () => {
    const res = apiServiceUnavailable();
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("Service temporairement indisponible");
  });

  it("apiRateLimited returns 429 with Retry-After", async () => {
    const res = apiRateLimited(120);
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("120");
  });

  it("apiForbidden and apiNotFound", async () => {
    const f = apiForbidden("no");
    expect(f.status).toBe(403);
    const n = apiNotFound();
    expect(n.status).toBe(404);
  });
});
