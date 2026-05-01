/**
 * Introspection du schéma PostgreSQL : liste tables/vues matérialisées et colonnes.
 * Usage : npm run db:introspect [-- --output=json|table] [-- --schemas=public,autre]
 * Connexion : DATABASE_URL dans .env (voir docs/DEMARRAGE.md).
 */
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const rootDir = process.cwd();
dotenv.config({ path: path.resolve(rootDir, ".env") });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL?.trim()) {
  console.error("Erreur: DATABASE_URL manquant dans .env");
  process.exit(1);
}

type IntrospectRow = { schema: string; name: string; columns: string };
type ParsedRow = { schema: string; name: string; columns: unknown };

function parseArgs(): { format: "json" | "table"; schemas: string[] } {
  const args = process.argv.slice(2);
  let format: "json" | "table" = "json";
  let schemas: string[] = [];
  for (const arg of args) {
    if (arg.startsWith("--output=")) {
      const v = arg.slice("--output=".length);
      if (v === "json" || v === "table") format = v;
    } else if (arg.startsWith("--schemas=")) {
      schemas = arg
        .slice("--schemas=".length)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return { format, schemas };
}

async function main(): Promise<void> {
  const { format, schemas } = parseArgs();

  const sqlPath = path.resolve(rootDir, "prisma/scripts/introspect-schema.sql");
  let sql: string;
  try {
    sql = fs.readFileSync(sqlPath, "utf-8");
  } catch (e) {
    console.error("Fichier SQL introuvable:", sqlPath, (e as Error).message);
    process.exit(1);
  }
  // Requête paramétrée : enlever les lignes de commentaire pour ne garder que le SELECT
  const sqlQuery = sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .trim();

  const adapter = new PrismaPg({ connectionString: DATABASE_URL });
  const prisma = new PrismaClient({
    adapter,
    log: [],
  });

  // Paramètres $1 à $12 pour l'introspection pg_catalog (voir docs/INTROSPECTION_SCHEMA_SQL.md)
  const params = [
    "", // $1 : attidentity != ''
    "nextval%", // $2 : LIKE default
    "", // $3 : attgenerated != ''
    "", // $4 : attnotnull != ''
    "p", // $5 : pk_con.contype
    "f", // $6 : fk_con.contype
    0, // $7 : attnum >= 0 (exclure colonnes système)
    false, // $8 : attisdropped != false
    "^pg_", // $9 : nspname !~ (exclure schémas pg_*)
    "information_schema", // $10 : nspname !=
    "r", // $11 : relkind (table)
    "m", // $12 : relkind (vue matérialisée)
  ];

  try {
    const raw = (await prisma.$queryRawUnsafe(
      sqlQuery,
      ...params
    )) as IntrospectRow[];
    let rows: ParsedRow[] = raw.map((r) => ({
      schema: r.schema,
      name: r.name,
      columns: (() => {
        try {
          return JSON.parse(r.columns as unknown as string) as unknown;
        } catch {
          return r.columns;
        }
      }),
    }));

    if (schemas.length > 0) {
      const set = new Set(schemas);
      rows = rows.filter((r) => set.has(r.schema));
    }

    if (format === "table") {
      console.log("schema\tname\tnb_columns");
      for (const r of rows) {
        const n = Array.isArray(r.columns) ? (r.columns as unknown[]).length : 0;
        console.log(`${r.schema}\t${r.name}\t${n}`);
      }
    } else {
      console.log(JSON.stringify(rows, null, 2));
    }
  } catch (e) {
    console.error("Erreur introspection:", (e as Error).message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
