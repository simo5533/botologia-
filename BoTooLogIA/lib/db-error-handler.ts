/**
 * Mappe les erreurs Prisma / connexion vers des réponses HTTP cohérentes (503 si BDD injoignable).
 */

import { NextResponse } from "next/server";
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
} from "@prisma/client-runtime-utils";
import { apiServerError, apiNotFound } from "@/lib/api/response";
import { logger } from "@/lib/logger";

/** Codes Prisma indiquant une indisponibilité temporaire du serveur SQL. */
const DB_UNAVAILABLE_CODES = new Set([
  "P1001",
  "P1000",
  "P1002",
  "P1003",
  "P1017",
  "P2024",
]);

export function mapPrismaErrorToResponse(route: string, error: unknown): Response | null {
  if (error instanceof PrismaClientInitializationError) {
    logger.error("DB indisponible (initialisation)", error, {
      route,
      code: error.errorCode ?? "init",
      message: error.message,
    });
    return NextResponse.json(
      { error: "Service temporairement indisponible" },
      { status: 503 }
    );
  }

  if (error instanceof PrismaClientKnownRequestError) {
    if (DB_UNAVAILABLE_CODES.has(error.code)) {
      logger.error("DB indisponible (requête)", error, {
        route,
        code: error.code,
        message: error.message,
      });
      return NextResponse.json(
        { error: "Service temporairement indisponible" },
        { status: 503 }
      );
    }
    if (error.code === "P2025") {
      logger.warn("Prisma P2025 (enregistrement introuvable)", { route, code: error.code });
      return apiNotFound("Ressource introuvable");
    }
    if (error.code === "P2002") {
      logger.warn("Prisma P2002 (unicité)", { route, meta: error.meta });
      return NextResponse.json(
        { success: false, error: "Un compte existe déjà avec cet email." },
        { status: 409 }
      );
    }
    logger.error("Erreur Prisma (métier / contrainte)", error, {
      route,
      code: error.code,
      message: error.message,
    });
    return null;
  }

  return null;
}

/**
 * À utiliser dans un catch : retourne une Response 503 si erreur DB, sinon null.
 */
export function handleDbFailure(route: string, error: unknown): Response | null {
  return mapPrismaErrorToResponse(route, error);
}

/**
 * Utiliser dans un catch de route API : 503 si Prisma/DB, sinon 500 + log.
 * Ordre des arguments : (error, routeLabel) pour coller au pattern `catch (error) { return respondApiCatch(error, "POST /api/...") }`.
 */
export function respondApiCatch(error: unknown, routeLabel: string): Response {
  const db = mapPrismaErrorToResponse(routeLabel, error);
  if (db) return db;
  logger.error(routeLabel, error, { route: routeLabel });
  return apiServerError();
}
