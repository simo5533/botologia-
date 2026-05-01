"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BarChart3, Table2, Bell, Crown, LogOut, LineChart, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavLinks = [
  { href: "/botoadmin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/botoadmin/analytics", label: "Analytics CEO", icon: LineChart },
  { href: "/botoadmin/crm", label: "CRM Prospects", icon: Users },
  { href: "/botoadmin/notifications", label: "Notifications", icon: Bell },
  { href: "/botoadmin/stats", label: "Statistiques", icon: BarChart3 },
  { href: "/botoadmin/tables", label: "Tables", icon: Table2 },
  { href: "/botoadmin/boss", label: "Dashboard BOSS", icon: Crown },
] as const;

/**
 * Sidebar admin — navigation avec glow cyan, pas de CTA public
 */
export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className="sticky top-0 flex h-screen w-56 flex-col border-r border-white/10 bg-slate-900/95 backdrop-blur-xl"
      role="navigation"
      aria-label="Navigation admin"
    >
      <div className="p-4 border-b border-white/10">
        <Link
          href="/botoadmin"
          className="font-heading text-lg font-bold text-white"
        >
          BoToAdmin
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {adminNavLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-holographic-cyan/20 text-holographic-cyan shadow-[inset_0_0_20px_rgba(0,212,255,0.1)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3 space-y-1">
        <Link
          href="/botohub"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:text-white transition-colors"
        >
          ← Retour au site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-red-300 transition-colors"
          aria-label="Déconnexion"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
