-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'boss', 'super_admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'verified', 'suspended', 'banned');

-- CreateEnum
CREATE TYPE "AuditSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('new', 'read', 'archived');

-- CreateEnum
CREATE TYPE "ProspectStatus" AS ENUM ('NOUVEAU', 'CONTACTE', 'QUALIFIE', 'DEVIS_ENVOYE', 'NEGOCIATION', 'CLIENT', 'PERDU');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "Role" NOT NULL DEFAULT 'user',
    "adminLevel" INTEGER,
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "twoFactorSecret" TEXT,
    "twoFactorBackupCodes" JSONB,
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "emailVerified" TIMESTAMP(3),
    "passwordChangedAt" TIMESTAMP(3),
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "ip" TEXT,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userId" TEXT,
    "resource" TEXT,
    "resourceId" TEXT,
    "severity" "AuditSeverity" NOT NULL DEFAULT 'MEDIUM',
    "details" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "societe" TEXT,
    "poste" TEXT,
    "message" TEXT NOT NULL,
    "services" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "budget" TEXT,
    "timeline" TEXT,
    "description" TEXT,
    "objectifs" TEXT,
    "experience" TEXT,
    "status" "ContactStatus" NOT NULL DEFAULT 'new',
    "source" TEXT,
    "notes" TEXT,
    "assignedTo" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "treatedAt" TIMESTAMP(3),

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Revenue" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "periodType" TEXT NOT NULL,
    "periodValue" TEXT,
    "label" TEXT,
    "clientName" TEXT,
    "clientEmail" TEXT,
    "serviceType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'CONFIRME',
    "invoiceUrl" TEXT,
    "invoiceNumber" TEXT,
    "notes" TEXT,
    "taxRate" DOUBLE PRECISION,
    "amountHT" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "Revenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "metadata" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "country" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "duration" INTEGER,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "sessionId" TEXT,
    "referrer" TEXT,
    "duration" INTEGER,
    "ip" TEXT,
    "userAgent" TEXT,
    "country" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "societe" TEXT,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "poste" TEXT,
    "services" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "budget" TEXT,
    "delai" TEXT,
    "description" TEXT,
    "status" "ProspectStatus" NOT NULL DEFAULT 'NOUVEAU',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "assignedTo" TEXT,
    "source" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastContact" TIMESTAMP(3),
    "nextFollowUp" TIMESTAMP(3),
    "dealValue" DOUBLE PRECISION,
    "probability" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "convertedAt" TIMESTAMP(3),

    CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "prospectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT,
    "authorName" TEXT,
    "outcome" TEXT,
    "nextAction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "metadata" JSONB,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotConversation" (
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

-- CreateTable
CREATE TABLE "ScheduledTask" (
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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");

-- CreateIndex
CREATE INDEX "User_lastLoginAt_idx" ON "User"("lastLoginAt");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_userId_idx" ON "Session"("expiresAt", "userId");

-- CreateIndex
CREATE INDEX "Session_isValid_idx" ON "Session"("isValid");

-- CreateIndex
CREATE INDEX "Session_userId_isValid_idx" ON "Session"("userId", "isValid");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_severity_idx" ON "AuditLog"("severity");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_resource_resourceId_idx" ON "AuditLog"("resource", "resourceId");

-- CreateIndex
CREATE INDEX "Contact_createdAt_idx" ON "Contact"("createdAt");

-- CreateIndex
CREATE INDEX "Contact_status_idx" ON "Contact"("status");

-- CreateIndex
CREATE INDEX "Contact_status_createdAt_idx" ON "Contact"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_source_idx" ON "Contact"("source");

-- CreateIndex
CREATE INDEX "Contact_assignedTo_idx" ON "Contact"("assignedTo");

-- CreateIndex
CREATE INDEX "Revenue_periodType_idx" ON "Revenue"("periodType");

-- CreateIndex
CREATE INDEX "Revenue_status_idx" ON "Revenue"("status");

-- CreateIndex
CREATE INDEX "Revenue_createdAt_idx" ON "Revenue"("createdAt");

-- CreateIndex
CREATE INDEX "Revenue_clientEmail_idx" ON "Revenue"("clientEmail");

-- CreateIndex
CREATE INDEX "Revenue_paidAt_idx" ON "Revenue"("paidAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "AppSettings_key_key" ON "AppSettings"("key");

-- CreateIndex
CREATE INDEX "AppSettings_key_idx" ON "AppSettings"("key");

-- CreateIndex
CREATE INDEX "AppSettings_isPublic_idx" ON "AppSettings"("isPublic");

-- CreateIndex
CREATE INDEX "Analytics_page_idx" ON "Analytics"("page");

-- CreateIndex
CREATE INDEX "Analytics_event_idx" ON "Analytics"("event");

-- CreateIndex
CREATE INDEX "Analytics_userId_idx" ON "Analytics"("userId");

-- CreateIndex
CREATE INDEX "Analytics_page_event_idx" ON "Analytics"("page", "event");

-- CreateIndex
CREATE INDEX "Analytics_createdAt_idx" ON "Analytics"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "PageView_page_idx" ON "PageView"("page");

-- CreateIndex
CREATE INDEX "PageView_sessionId_idx" ON "PageView"("sessionId");

-- CreateIndex
CREATE INDEX "PageView_device_idx" ON "PageView"("device");

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "PageView_page_createdAt_idx" ON "PageView"("page", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Prospect_email_key" ON "Prospect"("email");

-- CreateIndex
CREATE INDEX "Prospect_status_createdAt_idx" ON "Prospect"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Prospect_email_idx" ON "Prospect"("email");

-- CreateIndex
CREATE INDEX "Prospect_score_idx" ON "Prospect"("score");

-- CreateIndex
CREATE INDEX "Prospect_assignedTo_idx" ON "Prospect"("assignedTo");

-- CreateIndex
CREATE INDEX "Prospect_dealValue_idx" ON "Prospect"("dealValue" DESC);

-- CreateIndex
CREATE INDEX "Prospect_nextFollowUp_idx" ON "Prospect"("nextFollowUp");

-- CreateIndex
CREATE INDEX "Activity_prospectId_idx" ON "Activity"("prospectId");

-- CreateIndex
CREATE INDEX "Activity_type_idx" ON "Activity"("type");

-- CreateIndex
CREATE INDEX "Activity_authorId_idx" ON "Activity"("authorId");

-- CreateIndex
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_expiresAt_idx" ON "Notification"("expiresAt");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "BotConversation_sessionId_idx" ON "BotConversation"("sessionId");

-- CreateIndex
CREATE INDEX "BotConversation_userId_idx" ON "BotConversation"("userId");

-- CreateIndex
CREATE INDEX "BotConversation_converted_idx" ON "BotConversation"("converted");

-- CreateIndex
CREATE INDEX "BotConversation_createdAt_idx" ON "BotConversation"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledTask_name_key" ON "ScheduledTask"("name");

-- CreateIndex
CREATE INDEX "ScheduledTask_name_idx" ON "ScheduledTask"("name");

-- CreateIndex
CREATE INDEX "ScheduledTask_nextRunAt_idx" ON "ScheduledTask"("nextRunAt");

-- CreateIndex
CREATE INDEX "ScheduledTask_status_idx" ON "ScheduledTask"("status");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
