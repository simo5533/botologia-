/**
 * Gestion d'erreurs centralisée pour les routes API.
 * Enveloppe un handler async et renvoie 500 + log en cas d'exception non gérée.
 */

import { NextRequest } from "next/server";
import { respondApiCatch } from "@/lib/db-error-handler";

export type ApiRouteHandler<T = unknown> = (
  request: NextRequest,
  context?: { params?: Promise<T> }
) => Promise<Response>;

/**
 * Enveloppe un handler de route API : en cas de rejet ou d'exception, log et renvoie 500.
 * À utiliser pour les routes qui ne font pas déjà un try/catch complet.
 */
export function withApiErrorHandler(
  handler: ApiRouteHandler,
  routeName: string
): ApiRouteHandler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (e: unknown) {
      return respondApiCatch(e, routeName);
    }
  };
}
