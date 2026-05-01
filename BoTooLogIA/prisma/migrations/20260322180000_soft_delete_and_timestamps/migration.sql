-- Soft delete + timestamps manquants (aligné sur schema.prisma)

-- User
ALTER TABLE "User" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Session
ALTER TABLE "Session" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Session" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- AuditLog
ALTER TABLE "AuditLog" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "AuditLog" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Contact
ALTER TABLE "Contact" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Revenue
ALTER TABLE "Revenue" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- AppSettings
ALTER TABLE "AppSettings" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Analytics
ALTER TABLE "Analytics" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Analytics" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- PageView
ALTER TABLE "PageView" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "PageView" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Prospect
ALTER TABLE "Prospect" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Activity
ALTER TABLE "Activity" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Activity" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Notification
ALTER TABLE "Notification" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Notification" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- BotConversation
ALTER TABLE "BotConversation" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- ScheduledTask
ALTER TABLE "ScheduledTask" ADD COLUMN "deletedAt" TIMESTAMP(3);
