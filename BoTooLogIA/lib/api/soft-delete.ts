/**
 * Soft delete : pose deletedAt sans supprimer la ligne.
 * Utiliser findUnique / requêtes raw si vous devez inclure les entités supprimées.
 */

import { prisma } from "@/lib/prisma";

export type SoftDeletableDelegate =
  | "user"
  | "session"
  | "auditLog"
  | "contact"
  | "revenue"
  | "appSettings"
  | "analytics"
  | "pageView"
  | "prospect"
  | "activity"
  | "notification"
  | "botConversation"
  | "scheduledTask";

export async function softDelete(model: SoftDeletableDelegate, id: string): Promise<void> {
  const data = { deletedAt: new Date() };
  switch (model) {
    case "user":
      await prisma.user.update({ where: { id }, data });
      return;
    case "session":
      await prisma.session.update({ where: { id }, data });
      return;
    case "auditLog":
      await prisma.auditLog.update({ where: { id }, data });
      return;
    case "contact":
      await prisma.contact.update({ where: { id }, data });
      return;
    case "revenue":
      await prisma.revenue.update({ where: { id }, data });
      return;
    case "appSettings":
      await prisma.appSettings.update({ where: { id }, data });
      return;
    case "analytics":
      await prisma.analytics.update({ where: { id }, data });
      return;
    case "pageView":
      await prisma.pageView.update({ where: { id }, data });
      return;
    case "prospect":
      await prisma.prospect.update({ where: { id }, data });
      return;
    case "activity":
      await prisma.activity.update({ where: { id }, data });
      return;
    case "notification":
      await prisma.notification.update({ where: { id }, data });
      return;
    case "botConversation":
      await prisma.botConversation.update({ where: { id }, data });
      return;
    case "scheduledTask":
      await prisma.scheduledTask.update({ where: { id }, data });
      return;
    default: {
      const _exhaustive: never = model;
      throw new Error(`Modèle non géré: ${String(_exhaustive)}`);
    }
  }
}
