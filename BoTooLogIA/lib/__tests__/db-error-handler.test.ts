import { describe, it, expect } from "vitest";
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
} from "@prisma/client-runtime-utils";
import {
  mapPrismaErrorToResponse,
  respondApiCatch,
  handleDbFailure,
} from "@/lib/db-error-handler";

describe("db-error-handler", () => {
  it("returns 503 for PrismaClientInitializationError", async () => {
    const err = new PrismaClientInitializationError("can't reach", "7.4.0", "P1001");
    const res = mapPrismaErrorToResponse("GET /test", err);
    expect(res).not.toBeNull();
    expect(res!.status).toBe(503);
    const body = await res!.json();
    expect(body.error).toBe("Service temporairement indisponible");
  });

  it("returns 503 for known unreachable Prisma code P1001", async () => {
    const err = new PrismaClientKnownRequestError("timeout", {
      code: "P1001",
      clientVersion: "7.4.0",
    });
    const res = mapPrismaErrorToResponse("POST /x", err);
    expect(res).not.toBeNull();
    expect(res!.status).toBe(503);
  });

  it("returns 409 for Prisma P2002 (unique constraint)", async () => {
    const err = new PrismaClientKnownRequestError("unique", {
      code: "P2002",
      clientVersion: "7.4.0",
    });
    const res = mapPrismaErrorToResponse("POST /x", err);
    expect(res).not.toBeNull();
    expect(res!.status).toBe(409);
    const body = await res!.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("existe déjà");
  });

  it("returns null for non-Prisma errors", () => {
    expect(mapPrismaErrorToResponse("GET /x", new Error("nope"))).toBeNull();
  });

  it("handleDbFailure delegates to mapPrismaErrorToResponse", async () => {
    const err = new PrismaClientKnownRequestError("x", { code: "P1001", clientVersion: "7" });
    const res = handleDbFailure("GET /x", err);
    expect(res?.status).toBe(503);
  });

  it("respondApiCatch returns 503 for DB error", async () => {
    const err = new PrismaClientKnownRequestError("x", { code: "P1001", clientVersion: "7" });
    const res = respondApiCatch(err, "POST /login");
    expect(res.status).toBe(503);
  });

  it("respondApiCatch returns 500 for generic Error", async () => {
    const res = respondApiCatch(new Error("boom"), "POST /login");
    expect(res.status).toBe(500);
  });

  it("returns 404 for P2025 (not found)", async () => {
    const err = new PrismaClientKnownRequestError("not found", {
      code: "P2025",
      clientVersion: "7.4.0",
    });
    const res = mapPrismaErrorToResponse("GET /user", err);
    expect(res).not.toBeNull();
    expect(res!.status).toBe(404);
  });

  it("respondApiCatch returns 404 for P2025", async () => {
    const err = new PrismaClientKnownRequestError("not found", {
      code: "P2025",
      clientVersion: "7.4.0",
    });
    const res = respondApiCatch(err, "DELETE /api/x");
    expect(res.status).toBe(404);
  });
});
