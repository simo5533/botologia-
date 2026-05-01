-- AlterTable Session: revokedAt, revokedBy, index
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "revokedAt" TIMESTAMP(3);
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "revokedBy" TEXT;
CREATE INDEX IF NOT EXISTS "Session_userId_isValid_idx" ON "Session"("userId", "isValid");

-- AlterTable AuditLog: resourceId, success, duration, index
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "resourceId" TEXT;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "success" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "duration" INTEGER;
CREATE INDEX IF NOT EXISTS "AuditLog_resource_resourceId_idx" ON "AuditLog"("resource", "resourceId");

-- AlterTable Contact: assignedTo, treatedAt, index
ALTER TABLE "Contact" ADD COLUMN IF NOT EXISTS "assignedTo" TEXT;
ALTER TABLE "Contact" ADD COLUMN IF NOT EXISTS "treatedAt" TIMESTAMP(3);
CREATE INDEX IF NOT EXISTS "Contact_assignedTo_idx" ON "Contact"("assignedTo");

-- AlterTable Revenue: invoiceNumber, taxRate, amountHT, paidAt, index
ALTER TABLE "Revenue" ADD COLUMN IF NOT EXISTS "invoiceNumber" TEXT;
ALTER TABLE "Revenue" ADD COLUMN IF NOT EXISTS "taxRate" DOUBLE PRECISION;
ALTER TABLE "Revenue" ADD COLUMN IF NOT EXISTS "amountHT" DECIMAL(12,2);
ALTER TABLE "Revenue" ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMP(3);
CREATE INDEX IF NOT EXISTS "Revenue_clientEmail_idx" ON "Revenue"("clientEmail");
CREATE INDEX IF NOT EXISTS "Revenue_paidAt_idx" ON "Revenue"("paidAt" DESC);

-- AlterTable AppSettings: isPublic, index
ALTER TABLE "AppSettings" ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "AppSettings_key_idx" ON "AppSettings"("key");
CREATE INDEX IF NOT EXISTS "AppSettings_isPublic_idx" ON "AppSettings"("isPublic");

-- AlterTable Analytics: referrer, FK User, index
ALTER TABLE "Analytics" ADD COLUMN IF NOT EXISTS "referrer" TEXT;
CREATE INDEX IF NOT EXISTS "Analytics_page_event_idx" ON "Analytics"("page", "event");
CREATE INDEX IF NOT EXISTS "Analytics_createdAt_idx" ON "Analytics"("createdAt" DESC);
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Analytics_userId_fkey') THEN
    ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- AlterTable PageView: country, browser, index
ALTER TABLE "PageView" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "PageView" ADD COLUMN IF NOT EXISTS "browser" TEXT;
CREATE INDEX IF NOT EXISTS "PageView_device_idx" ON "PageView"("device");
CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "PageView_page_createdAt_idx" ON "PageView"("page", "createdAt" DESC);

-- AlterTable Prospect: tags, dealValue, probability, convertedAt, index
ALTER TABLE "Prospect" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Prospect" ADD COLUMN IF NOT EXISTS "dealValue" DOUBLE PRECISION;
ALTER TABLE "Prospect" ADD COLUMN IF NOT EXISTS "probability" INTEGER;
ALTER TABLE "Prospect" ADD COLUMN IF NOT EXISTS "convertedAt" TIMESTAMP(3);
CREATE INDEX IF NOT EXISTS "Prospect_dealValue_idx" ON "Prospect"("dealValue" DESC);
CREATE INDEX IF NOT EXISTS "Prospect_nextFollowUp_idx" ON "Prospect"("nextFollowUp");

-- AlterTable Activity: outcome, nextAction, index
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "outcome" TEXT;
ALTER TABLE "Activity" ADD COLUMN IF NOT EXISTS "nextAction" TEXT;
CREATE INDEX IF NOT EXISTS "Activity_authorId_idx" ON "Activity"("authorId");
CREATE INDEX IF NOT EXISTS "Activity_createdAt_idx" ON "Activity"("createdAt" DESC);

-- AlterTable Notification: metadata, expiresAt, readAt, FK User, index
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "metadata" JSONB;
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "readAt" TIMESTAMP(3);
CREATE INDEX IF NOT EXISTS "Notification_type_idx" ON "Notification"("type");
CREATE INDEX IF NOT EXISTS "Notification_expiresAt_idx" ON "Notification"("expiresAt");
CREATE INDEX IF NOT EXISTS "Notification_createdAt_idx" ON "Notification"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Notification_userId_fkey') THEN
    ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- CreateTable BotConversation
CREATE TABLE IF NOT EXISTS "BotConversation" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "messages" JSONB NOT NULL,
    "context" JSONB,
    "source" TEXT,
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotConversation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "BotConversation_sessionId_idx" ON "BotConversation"("sessionId");
CREATE INDEX IF NOT EXISTS "BotConversation_userId_idx" ON "BotConversation"("userId");
CREATE INDEX IF NOT EXISTS "BotConversation_converted_idx" ON "BotConversation"("converted");
CREATE INDEX IF NOT EXISTS "BotConversation_createdAt_idx" ON "BotConversation"("createdAt" DESC);

-- CreateTable ScheduledTask
CREATE TABLE IF NOT EXISTS "ScheduledTask" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "result" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledTask_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ScheduledTask_name_key" ON "ScheduledTask"("name");
CREATE INDEX IF NOT EXISTS "ScheduledTask_name_idx" ON "ScheduledTask"("name");
CREATE INDEX IF NOT EXISTS "ScheduledTask_nextRunAt_idx" ON "ScheduledTask"("nextRunAt");
CREATE INDEX IF NOT EXISTS "ScheduledTask_status_idx" ON "ScheduledTask"("status");
