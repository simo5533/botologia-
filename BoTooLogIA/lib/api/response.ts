import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

/** Erreur de validation (Zod) — 400 avec détails optionnels */
export function apiValidationError(message: string, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, ...(details != null && { details }) },
    { status: 400 }
  );
}

/** Erreur de validation Zod — 422 + détails flatten (OWASP / API cohérente) */
export function apiValidationFailed422(flattened: {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
}) {
  return NextResponse.json(
    { success: false, error: "Validation échouée", details: flattened },
    { status: 422 }
  );
}

/** Rate limit dépassé — 429 */
export function apiRateLimited(retryAfter = 60) {
  return NextResponse.json(
    { success: false, error: "Trop de requêtes. Réessayez plus tard." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}

export function apiUnauthorized(message = "Non autorisé") {
  return apiError(message, 401);
}

export function apiForbidden(message = "Accès refusé") {
  return apiError(message, 403);
}

export function apiNotFound(message = "Ressource introuvable") {
  return apiError(message, 404);
}

export function apiServerError(message = "Erreur serveur interne") {
  return apiError(message, 500);
}

/** Base de données ou service de persistance temporairement indisponible */
export function apiServiceUnavailable(message = "Service temporairement indisponible") {
  return NextResponse.json({ success: false, error: message }, { status: 503 });
}
