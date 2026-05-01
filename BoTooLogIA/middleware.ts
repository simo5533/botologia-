import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookieName } from "@/lib/auth/cookie-name";
import {
  checkGlobalApiRateLimited,
  checkLoginRateLimited,
  checkVerify2faRateLimited,
  checkContactPostRateLimited,
  checkAuthMiscRateLimited,
} from "@/lib/middleware/rate-limit-policies";
import { isUnsafeCrossOriginApiRequest } from "@/lib/middleware/verify-api-origin";
import { isAdminProtectionEnabled } from "@/lib/admin-protection";

const ADMIN_PREFIXES = ["/botoadmin", "/admin"] as const;
const API_PREFIX = "/api";

/** Fichiers statiques et assets — jamais bloqués. */
const STATIC_PATTERN = /\.(ico|png|jpg|jpeg|svg|gif|webp|avif|mp4|woff2?)$/;

function isAdminPagePath(pathname: string): boolean {
  return ADMIN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function rate429(message: string, retryAfterSec: number): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/videos/") ||
    pathname.startsWith("/images/") ||
    STATIC_PATTERN.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith(API_PREFIX)) {
    if (isUnsafeCrossOriginApiRequest(request)) {
      return NextResponse.json({ success: false, error: "Origine non autorisée" }, { status: 403 });
    }

    if (await checkGlobalApiRateLimited(request)) {
      return rate429("Trop de requêtes. Réessayez plus tard.", 60);
    }

    const method = request.method.toUpperCase();

    if (pathname === "/api/contact" && method === "POST") {
      if (await checkContactPostRateLimited(request)) {
        return rate429("Trop de demandes de contact depuis cette adresse. Réessayez plus tard.", 3600);
      }
    }

    if (pathname === "/api/auth/login" && method === "POST") {
      if (await checkLoginRateLimited(request)) {
        return rate429("Trop de tentatives de connexion. Réessayez dans 15 minutes.", 900);
      }
    } else if (pathname === "/api/auth/verify-2fa" && method === "POST") {
      if (await checkVerify2faRateLimited(request)) {
        return rate429("Trop de tentatives 2FA. Réessayez dans 15 minutes.", 900);
      }
    } else if (pathname.startsWith("/api/auth")) {
      if (await checkAuthMiscRateLimited(request)) {
        return rate429("Trop de requêtes sur l’authentification. Réessayez plus tard.", 60);
      }
    }
  }

  if (isAdminProtectionEnabled() && isAdminPagePath(pathname)) {
    const session = request.cookies.get(getSessionCookieName());
    if (!session?.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/botoadmin/:path*", "/admin/:path*"],
};
