import { test, expect } from "@playwright/test";
import speakeasy from "speakeasy";

test.describe("Authentification", () => {
  test("login avec mauvais mot de passe affiche une erreur", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("admin@botoologia.local");
    await page.getByLabel("Mot de passe").fill("___wrong_password___");
    await page.locator(".login-card__panel:not(.login-card__panel--hidden)").getByRole("button", { name: /Continuer/i }).click();
    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("login valide sans 2FA puis accès dashboard", async ({ page }) => {
    test.skip(!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD, "Définir E2E_ADMIN_EMAIL et E2E_ADMIN_PASSWORD");
    const email = process.env.E2E_ADMIN_EMAIL as string;
    const password = process.env.E2E_ADMIN_PASSWORD as string;

    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mot de passe").fill(password);
    await page.locator(".login-card__panel:not(.login-card__panel--hidden)").getByRole("button", { name: /Continuer/i }).click();

    await expect(page).toHaveURL(/\/(botoadmin|botohub)/, { timeout: 20_000 });
    if (new URL(page.url()).pathname.startsWith("/botoadmin")) {
      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    }
  });

  test("flux 2FA avec TEST_TOTP_SECRET", async ({ page }) => {
    test.skip(
      !process.env.E2E_2FA_EMAIL || !process.env.E2E_2FA_PASSWORD || !process.env.TEST_TOTP_SECRET,
      "E2E_2FA_EMAIL, E2E_2FA_PASSWORD et TEST_TOTP_SECRET requis"
    );
    const email = process.env.E2E_2FA_EMAIL as string;
    const password = process.env.E2E_2FA_PASSWORD as string;
    const secret = process.env.TEST_TOTP_SECRET as string;

    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mot de passe").fill(password);
    await page.locator(".login-card__panel:not(.login-card__panel--hidden)").getByRole("button", { name: /Continuer/i }).click();

    await expect(page.getByRole("heading", { name: /Code à usage unique/i })).toBeVisible({ timeout: 15_000 });

    const token = speakeasy.totp({ secret, encoding: "base32" });
    await page.getByLabel(/6 chiffres/i).fill(token);
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page).toHaveURL(/\/(botoadmin|botohub)/, { timeout: 20_000 });
  });

  test("logout renvoie vers /login", async ({ page }) => {
    test.skip(!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD, "Définir E2E_ADMIN_EMAIL et E2E_ADMIN_PASSWORD");
    const email = process.env.E2E_ADMIN_EMAIL as string;
    const password = process.env.E2E_ADMIN_PASSWORD as string;

    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mot de passe").fill(password);
    await page.locator(".login-card__panel:not(.login-card__panel--hidden)").getByRole("button", { name: /Continuer/i }).click();
    await expect(page).toHaveURL(/\/botoadmin/, { timeout: 20_000 });

    await page.getByRole("button", { name: "Déconnexion" }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
  });
});
