import { test, expect } from "@playwright/test";

test.describe("Admin BoToAdmin", () => {
  test("GET /api/users sans session → 401", async ({ request }) => {
    const res = await request.get("/api/users");
    expect(res.status()).toBe(401);
  });

  test("GET /api/users avec session admin → 200", async ({ page }) => {
    test.skip(!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD, "Définir E2E_ADMIN_EMAIL et E2E_ADMIN_PASSWORD");
    const email = process.env.E2E_ADMIN_EMAIL as string;
    const password = process.env.E2E_ADMIN_PASSWORD as string;

    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mot de passe").fill(password);
    await page.locator(".login-card__panel:not(.login-card__panel--hidden)").getByRole("button", { name: /Continuer/i }).click();
    await expect(page).toHaveURL(/\/botoadmin/, { timeout: 20_000 });

    const res = await page.request.get("/api/users");
    expect(res.status()).toBe(200);
    const body = (await res.json()) as { success?: boolean; data?: { items?: unknown[] } };
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data?.items)).toBe(true);
  });

  test("sans session : redirection vers /login quand la protection est active", async ({ page }) => {
    test.skip(process.env.ADMIN_PROTECTION_ENABLED === "false", "Protection admin désactivée");
    await page.context().clearCookies();
    await page.goto("/botoadmin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("avec session admin : dashboard visible", async ({ page }) => {
    test.skip(!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD, "Définir E2E_ADMIN_EMAIL et E2E_ADMIN_PASSWORD");
    const email = process.env.E2E_ADMIN_EMAIL as string;
    const password = process.env.E2E_ADMIN_PASSWORD as string;

    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mot de passe").fill(password);
    await page.locator(".login-card__panel:not(.login-card__panel--hidden)").getByRole("button", { name: /Continuer/i }).click();
    await expect(page).toHaveURL(/\/botoadmin/, { timeout: 20_000 });

    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Navigation admin" })).toBeVisible();
  });
});
