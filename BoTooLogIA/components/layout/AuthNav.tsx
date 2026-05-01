"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LayoutDashboard, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type User = { id: string; email: string; name: string | null; role: string } | null;

const ADMIN_ROLES = ["admin", "boss", "super_admin"];
function isAdminRole(role: string | undefined): boolean {
  return !!(role && ADMIN_ROLES.includes(role.toLowerCase()));
}

const linkClass = cn(
  "inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200",
  "hover:text-[#00d4ff] hover:shadow-[0_0_8px_rgba(0,212,255,0.2)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]",
  "text-slate-300"
);

export function AuthNav({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [user, setUser] = useState<User>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setUser(data?.data ?? null);
      })
      .catch(() => setUser(null));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/botohub");
    router.refresh();
  }

  if (user) {
    return (
      <div className={variant === "mobile" ? "flex flex-col gap-1" : "flex items-center gap-3"}>
        <Link
          href="/profile"
          className={variant === "mobile" ? "rounded-lg px-4 py-3 " + linkClass : linkClass}
        >
          <User size={18} aria-hidden />
          Profil
        </Link>
        {isAdminRole(user.role) && (
          <Link
            href="/botoadmin"
            className={variant === "mobile" ? "rounded-lg px-4 py-3 " + linkClass : linkClass}
          >
            <LayoutDashboard size={18} aria-hidden />
            Admin
          </Link>
        )}
        <Button
          variant="ghost"
          size={variant === "mobile" ? "default" : "sm"}
          className={cn(
            "text-slate-300 hover:bg-[#00d4ff]/10 hover:text-[#00d4ff]",
            variant === "mobile" && "justify-start rounded-lg px-4 py-3"
          )}
          onClick={handleLogout}
        >
          <LogOut size={18} aria-hidden />
          Déconnexion
        </Button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      aria-label="Connexion"
      title="Connexion"
      className={
        variant === "mobile"
          ? "rounded-lg px-4 py-3 " + linkClass
          : cn(linkClass, "gap-0 justify-center")
      }
    >
      <LogIn size={18} aria-hidden className="shrink-0" />
    </Link>
  );
}
