"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

type SessionState =
  | { status: "loading" }
  | { status: "authenticated"; user: SessionUser }
  | { status: "unauthenticated" };

type SessionContextValue = {
  session: SessionState;
  refetch: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

const ADMIN_ROLES = ["admin", "boss", "super_admin"];

function isAdminRole(role: string | undefined): boolean {
  return ADMIN_ROLES.includes((role ?? "").toLowerCase());
}

/** Redirection côté client si non connecté. */
export function useRequireAuth(redirectTo = "/login") {
  const { session, refetch } = useSession();
  const [ready, setReady] = useState(false);
  const status = session.status;

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      const callbackUrl = typeof window !== "undefined" ? window.location.pathname : "";
      const url = callbackUrl ? `${redirectTo}?redirect=${encodeURIComponent(callbackUrl)}` : redirectTo;
      window.location.href = url;
      return;
    }
    setReady(true);
  }, [status, redirectTo]);

  return { session, status, ready, refetch };
}

/** Redirection côté client si non admin. */
export function useRequireAdmin() {
  const { session, refetch } = useSession();
  const [ready, setReady] = useState(false);
  const status = session.status;
  const user = session.status === "authenticated" ? session.user : null;

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      window.location.href = `/login?redirect=${encodeURIComponent("/botoadmin")}`;
      return;
    }
    if (user && !isAdminRole(user.role)) {
      window.location.href = "/botohub?error=unauthorized";
      return;
    }
    setReady(true);
  }, [status, user]);

  return { session, status, ready, refetch };
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>({ status: "loading" });

  const refetch = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { credentials: "include", cache: "no-store" });
      const json = await res.json();
      if (res.ok && json?.success && json?.data) {
        setSession({ status: "authenticated", user: json.data });
      } else {
        setSession({ status: "unauthenticated" });
      }
    } catch {
      setSession({ status: "unauthenticated" });
    }
  }, []);

  useEffect(() => {
    refetch();
    const onFocus = () => refetch();
    window.addEventListener("focus", onFocus);
    const interval = setInterval(refetch, 5 * 60 * 1000);
    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, [refetch]);

  return (
    <SessionContext.Provider value={{ session, refetch }}>
      {children}
    </SessionContext.Provider>
  );
}
