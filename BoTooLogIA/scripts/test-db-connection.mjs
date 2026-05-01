// Test connexion DB depuis l'hôte (Node charge .env)
import "dotenv/config";
import pg from "pg";
const url = process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5433/botoologia";
const client = new pg.Client({ connectionString: url });
try {
  await client.connect();
  const r = await client.query("SELECT 1 as ok");
  console.log("Connexion OK:", r.rows[0]);
} catch (e) {
  console.error("Erreur:", e.message);
  process.exit(1);
} finally {
  await client.end();
}
