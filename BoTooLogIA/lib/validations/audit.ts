import { z } from "zod";

export const auditSeveritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

/** Schéma création journal d'audit */
export const auditLogCreateSchema = z.object({
  action: z.string().min(1, "Action requise").max(255),
  resource: z.string().max(255).optional().nullable(),
  resourceId: z.string().max(255).optional().nullable(),
  userId: z.string().cuid().optional().nullable(),
  severity: auditSeveritySchema.optional(),
  details: z.record(z.unknown()).optional().nullable(),
  ip: z.string().max(45).optional().nullable(),
  userAgent: z.string().max(512).optional().nullable(),
  success: z.boolean().optional(),
  duration: z.number().int().optional().nullable(),
});

export type AuditLogCreateInput = z.infer<typeof auditLogCreateSchema>;
