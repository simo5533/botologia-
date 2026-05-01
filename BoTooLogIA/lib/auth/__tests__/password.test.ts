import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../password";

describe("password", () => {
  it("hashPassword returns a bcrypt hash (starts with $2)", () => {
    const result = hashPassword("secret123");
    expect(result).toMatch(/^\$2[aby]\$\d{2}\$/);
    expect(result.length).toBeGreaterThan(50);
  });

  it("hashPassword uses saltRounds 12", () => {
    const result = hashPassword("secret123");
    const rounds = parseInt(result.split("$")[2], 10);
    expect(rounds).toBe(12);
  });

  it("hashPassword throws for password too short", () => {
    expect(() => hashPassword("short")).toThrow(/6 caractères/);
  });

  it("hashPassword produces different hashes for same password (salt)", () => {
    const a = hashPassword("same12");
    const b = hashPassword("same12");
    expect(a).not.toBe(b);
  });

  it("verifyPassword returns true for correct password (bcrypt)", () => {
    const stored = hashPassword("correct");
    expect(verifyPassword("correct", stored)).toBe(true);
  });

  it("verifyPassword returns false for wrong password", () => {
    const stored = hashPassword("correct");
    expect(verifyPassword("wrong", stored)).toBe(false);
  });

  it("verifyPassword returns false for invalid stored format", () => {
    expect(verifyPassword("any", "invalid")).toBe(false);
    expect(verifyPassword("any", "one:two:three")).toBe(false);
  });

  it("verifyPassword returns false for empty or invalid input", () => {
    expect(verifyPassword("", "something")).toBe(false);
    expect(verifyPassword("p", "")).toBe(false);
  });
});
