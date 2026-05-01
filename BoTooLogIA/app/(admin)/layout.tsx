import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { getSessionUserId } from "@/lib/auth/session";
import { getSessionCookieName } from "@/lib/auth/cookie-name";
import { prisma } from "@/lib/prisma";
import { isAdminProtectionEnabled } from "@/lib/admin-protection";

/** Aligné sur SessionProvider, login et auth-guard API */
const ADMIN_ROLES = ["admin", "boss", "super_admin"] as const;

/**
 * Layout admin : réservé aux rôles admin et boss. Thème sombre, sidebar, pas de navbar/footer publics.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isAdminProtectionEnabled()) {
    const cookieStore = await cookies();
    const token = cookieStore.get(getSessionCookieName())?.value;
    const userId = await getSessionUserId(token ?? undefined);
    if (!userId) {
      redirect("/login?redirect=/botoadmin");
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user || !ADMIN_ROLES.includes(user.role as (typeof ADMIN_ROLES)[number])) {
      redirect("/login?redirect=/botoadmin&error=admin_required");
    }
  }

  return (
    <div className="admin-panel flex min-h-screen bg-[rgb(var(--admin-bg))]" data-theme="dark">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-[rgb(var(--admin-bg))]">
        {children}
      </main>
    </div>
  );
}
