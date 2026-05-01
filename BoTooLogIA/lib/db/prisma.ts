import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createExtendedClient> | undefined;
};

function getConnectionString(): string {
  let url = process.env.DATABASE_URL;
  if (!url || url.trim() === "") {
    throw new Error(
      "DATABASE_URL manquant. Configurez-la dans .env (ex: postgresql://user:password@localhost:5432/botoologia)"
    );
  }
  url = url.trim().replace(/^["']+|["']+$/g, "").replace(/\s+/g, "");
  return url;
}

const poolMax = Math.min(
  Math.max(1, parseInt(process.env.DB_POOL_MAX ?? "10", 10) || 10),
  20
);

/** Filtre soft-delete : lectures findMany / findFirst excluent deletedAt != null. */
export function whereWithDeletedAtNull(where: object | undefined): object {
  const soft = { deletedAt: null };
  if (where === undefined || (typeof where === "object" && Object.keys(where).length === 0)) {
    return soft;
  }
  return { AND: [where, soft] };
}

function createBaseClient(): PrismaClient {
  const connectionString = getConnectionString();
  try {
    const adapter = new PrismaPg({
      connectionString,
      max: poolMax,
    });
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  } catch (e) {
    throw new Error("Prisma adapter initialization failed. Check DATABASE_URL and @prisma/adapter-pg.", { cause: e });
  }
}

function createExtendedClient() {
  const base = createBaseClient();
  return base.$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          const nextArgs = { ...args, where: whereWithDeletedAtNull(args.where as object | undefined) };
          return query(nextArgs);
        },
        async findFirst({ args, query }) {
          const nextArgs = { ...args, where: whereWithDeletedAtNull(args.where as object | undefined) };
          return query(nextArgs);
        },
        async findFirstOrThrow({ args, query }) {
          const nextArgs = { ...args, where: whereWithDeletedAtNull(args.where as object | undefined) };
          return query(nextArgs);
        },
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createExtendedClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function testConnection(): Promise<boolean> {
  const r = await testDbConnection();
  return r.ok;
}

export async function testDbConnection(): Promise<{
  ok: boolean;
  latencyMs: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, latencyMs: Date.now() - start };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error: message,
    };
  }
}

export async function getDbStats(): Promise<{
  tables: Array<{ name: string; rows: number }>;
  sizeKb: number;
}> {
  try {
    const tables = await prisma.$queryRaw<
      Array<{ tablename: string; n_live_tup: bigint }>
    >`
      SELECT tablename, n_live_tup
      FROM pg_stat_user_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    const sizeResult = await prisma.$queryRaw<Array<{ size_kb: number }>>`
      SELECT ROUND(pg_database_size(current_database()) / 1024.0)::int as size_kb
    `;
    return {
      tables: tables.map((t) => ({
        name: t.tablename,
        rows: Number(t.n_live_tup),
      })),
      sizeKb: sizeResult[0]?.size_kb ?? 0,
    };
  } catch {
    return { tables: [], sizeKb: 0 };
  }
}

export async function cleanExpiredSessions(): Promise<number> {
  try {
    const result = await prisma.session.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { isValid: false }],
      },
    });
    return result.count;
  } catch {
    return 0;
  }
}
