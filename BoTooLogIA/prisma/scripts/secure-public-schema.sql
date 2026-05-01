-- BoTooLogIA — Sécurisation du schéma public (à exécuter par un superutilisateur)
-- Usage: psql -U postgres -d botoologia -f prisma/scripts/secure-public-schema.sql
-- Adapter <role_app> (ex: postgres ou botoologia) selon votre utilisateur de connexion.

-- 1. Révoquer les droits par défaut sur public
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

-- 2. Donner les droits au rôle de l'application (remplacer postgres si autre user)
GRANT USAGE ON SCHEMA public TO postgres;
GRANT CREATE ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- 3. Permissions par défaut pour les futurs objets
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO postgres;

-- 4. Vérification (optionnel)
-- SELECT nspname, nspowner::regrole, nspacl FROM pg_namespace WHERE nspname = 'public';
