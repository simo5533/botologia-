/**
 * Point d’entrée unique pour le client Prisma (extensions soft-delete incluses).
 * Préférer `import { prisma } from "@/lib/prisma"` dans les routes API et la lib.
 */

export {
  prisma,
  testConnection,
  testDbConnection,
  getDbStats,
  cleanExpiredSessions,
} from "./db/prisma";
