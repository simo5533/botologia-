-- BoTooLogIA — Securisation schema PostgreSQL (prod)
-- Usage: psql -U postgres -d botoologia -f prisma/scripts/secure-schema.sql

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'botoologia_app') THEN
    CREATE ROLE botoologia_app LOGIN PASSWORD 'CHANGE_ME_IN_PROD';
    COMMENT ON ROLE botoologia_app IS 'Role applicatif BoTooLogIA';
  END IF;
END $$;

GRANT USAGE ON SCHEMA public TO botoologia_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO botoologia_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO botoologia_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO botoologia_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO botoologia_app;

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

SELECT schemaname, tablename,
  pg_size_pretty(pg_total_relation_size(quote_ident(schemaname)||'.'||quote_ident(tablename))) AS total_size,
  n_live_tup AS live_rows
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(quote_ident(schemaname)||'.'||quote_ident(tablename)) DESC;
