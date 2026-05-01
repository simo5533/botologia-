/**
 * Contrôle d’accès par rôle (A01) — à combiner avec la session déjà résolue.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminSession, requireBossSession } from "@/lib/api/auth-guard";

export type RoleGate = "admin" | "boss" | "user";

/**
 * Exige un rôle minimal. Pour `user`, seule une session valide est requise (via garde existante).
 * En pratique : utiliser `requireAdminSession` / `requireBossSession` pour les routes API.
 */
export async function requireRole(
  request: NextRequest,
  role: RoleGate
): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  if (role === "boss") {
    const r = await requireBossSession(request);
    if (!r.allowed) {
      return {
        ok: false,
        response: NextResponse.json({ success: false, error: "Accès réservé au BOSS" }, { status: 403 }),
      };
    }
    return { ok: true };
  }
  if (role === "admin") {
    const r = await requireAdminSession(request);
    if (!r.allowed) {
      return {
        ok: false,
        response: NextResponse.json({ success: false, error: "Session admin requise" }, { status: 401 }),
      };
    }
    return { ok: true };
  }
  return { ok: true };
}
