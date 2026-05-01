/**
 * Garde d'authentification pour les routes API admin et BOSS.
 * Valide le cookie de session en base et exige un rôle admin (`admin`, `boss`, `super_admin` selon la route).
 */

import { NextRequest } from "next/server";
import * as session from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { isAdminProtectionEnabled } from "@/lib/admin-protection";

export type AdminAuthResult =
  | { allowed: true; userId: string; role: string }
  | { allowed: false; status: 401 };

export function hasAdminSession(request: NextRequest): boolean {
  return Boolean(request.cookies.get(session.getSessionCookieName())?.value);
}

/** Rôles autorisés sur les routes admin (BOSS et super_admin ont accès à tout l'admin) */
const ADMIN_ROLES = ["admin", "boss", "super_admin"] as const;

/**
 * Exige une session valide avec le rôle ADMIN uniquement (pas BOSS).
 * Pour les actions sensibles : gestion utilisateurs, config, suppression, etc.
 */
export async function requireStrictAdminSession(request: NextRequest): Promise<AdminAuthResult> {
  if (!isAdminProtectionEnabled()) {
    return { allowed: true, userId: "bypass", role: "bypass" };
  }

  const token = request.cookies.get(session.getSessionCookieName())?.value;
  const userId = await session.getSessionUserId(token ?? undefined);
  if (!userId) return { allowed: false, status: 401 };

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!user || user.role !== "admin") return { allowed: false, status: 401 };
    return { allowed: true, userId: user.id, role: user.role };
  } catch {
    return { allowed: false, status: 401 };
  }
}

/**
 * Session valide avec rôle admin, boss ou super_admin.
 */
export async function requireAdminSession(request: NextRequest): Promise<AdminAuthResult> {
  if (!isAdminProtectionEnabled()) {
    return { allowed: true, userId: "bypass", role: "bypass" };
  }

  const token = request.cookies.get(session.getSessionCookieName())?.value;
  const userId = await session.getSessionUserId(token ?? undefined);
  if (!userId) return { allowed: false, status: 401 };

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!user || !ADMIN_ROLES.includes(user.role as (typeof ADMIN_ROLES)[number])) return { allowed: false, status: 401 };
    return { allowed: true, userId: user.id, role: user.role };
  } catch {
    return { allowed: false, status: 401 };
  }
}

/**
 * Vérifie que la requête a une session valide et que l'utilisateur a le rôle BOSS uniquement.
 * Pour les routes exclusives BOSS (dashboard analytics, rapports, export).
 */
export async function requireBossSession(request: NextRequest): Promise<AdminAuthResult> {
  if (!isAdminProtectionEnabled()) {
    return { allowed: true, userId: "bypass", role: "bypass" };
  }

  const token = request.cookies.get(session.getSessionCookieName())?.value;
  const userId = await session.getSessionUserId(token ?? undefined);
  if (!userId) return { allowed: false, status: 401 };

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!user || user.role !== "boss") return { allowed: false, status: 401 };
    return { allowed: true, userId: user.id, role: user.role };
  } catch {
    return { allowed: false, status: 401 };
  }
}
