#!/bin/bash
# ════════════════════════════════════
# Script backup PostgreSQL BoTooLogIA
# Usage: bash scripts/backup-db.sh (ou depuis Git Bash / WSL sur Windows)
# Variables: POSTGRES_* ou depuis DATABASE_URL dans .env
# ════════════════════════════════════

set -euo pipefail

# Config (depuis env ou défauts)
DB_NAME="${POSTGRES_DB:-botoologia}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/botoologia_${DATE}.sql.gz"
KEEP_DAYS=7

mkdir -p "$BACKUP_DIR"

echo "Backup BDD: $DB_NAME"
echo "Destination: $BACKUP_FILE"

PGPASSWORD="${POSTGRES_PASSWORD:-}" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --no-password \
  --format=plain \
  --no-owner \
  --no-acl \
  2>/dev/null | gzip > "$BACKUP_FILE" || {
  echo "Erreur: pg_dump ou gzip a échoué. Vérifiez POSTGRES_* ou DATABASE_URL."
  exit 1
}

SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
echo "Backup créé: $SIZE"

find "$BACKUP_DIR" -name "*.sql.gz" -mtime +"$KEEP_DAYS" -delete 2>/dev/null || true
echo "Nettoyage backups > ${KEEP_DAYS}j effectué"

if zcat "$BACKUP_FILE" | head -5 > /dev/null 2>&1; then
  echo "Intégrité backup OK"
else
  echo "Attention: backup potentiellement corrompu"
fi

echo ""
echo "Backups disponibles:"
ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null | tail -5 || echo "Aucun fichier .sql.gz"
