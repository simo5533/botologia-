import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client-runtime-utils";
import { withApiErrorHandler } from "@/lib/api/with-api-error-handler";

describe("withApiErrorHandler", () => {
  it("returns 503 when handler throws Prisma P1001", async () => {
    const handler = async () => {
      throw new PrismaClientKnownRequestError("unreachable", {
        code: "P1001",
        clientVersion: "7.4.0",
      });
    };
    const wrapped = withApiErrorHandler(handler, "GET /probe");
    const res = await wrapped(new NextRequest("http://localhost/probe"), undefined);
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe("Service temporairement indisponible");
  });

  it("returns 500 for generic errors", async () => {
    const handler = async () => {
      throw new Error("unexpected");
    };
    const wrapped = withApiErrorHandler(handler, "GET /probe");
    const res = await wrapped(new NextRequest("http://localhost/probe"), undefined);
    expect(res.status).toBe(500);
  });
});
