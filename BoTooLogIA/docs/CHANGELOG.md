# Changelog

Toutes les modifications notables du projet BoTooLogIA sont documentées ici.

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

---

## [0.1.0] — 2026-02-16

### Ajouté

- **Application Next.js 14** : pages d’accueil, login, dashboard admin (botoadmin), 5 pages publiques (botohub, botolab, botoworks, botolink, botoadvantage), page agentic.
- **Base de données (Prisma 7)** : schéma avec User, Session, AuditLog, Contact, Revenue, AppSettings ; index et contraintes ; prisma.config.ts (sans `url` dans schema.prisma).
- **Authentification** : login (email/mot de passe), session cookie, 2FA (TOTP, backup codes), rôles user/admin/boss ; seeds admin et boss, seed admins 2FA.
- **API** : health, auth (login, logout, session, verify-2fa), contact, bot/chat, users CRUD, admin (stats, audit-logs, contacts), boss (dashboard, statistics, revenue, users/analytics, reports, export).
- **Bot** : ChatbotWidget, ChatWindow, base de connaissances, API /api/bot/chat ; STT/TTS selon navigateur.
- **Documentation** : DEMARRAGE.md, API.md, PRISMA_SETUP.md, PROJECT_STRUCTURE.md, DATABASE_ANALYSIS, DATABASE_AUDIT_REPORT, DATABASE_SCORE_98, CRITICAL_ISSUES, BOT_GUIDE, FULLSTACK_SCORE.
- **DevOps** : scripts `db:*` (validate, format, push, migrate, seed, up, down), dev:full (démarrage complet), docker-compose et docker-compose.standalone.yml, DEPLOYMENT_CHECKLIST.md.
- **Tests** : Vitest ; tests unitaires pour `lib/auth/password` (hash/verify) et `lib/api/response` (apiSuccess, apiError, apiUnauthorized).

### Sécurité

- Script SQL `prisma/scripts/secure-public-schema.sql` pour durcir les droits sur le schéma `public` en production.

### Notes

- Connexion PostgreSQL requise pour exécution complète (Docker ou local). Build Next.js peut afficher des erreurs si la BDD est indisponible pendant la génération statique.
- Lint : `eslint.ignoreDuringBuilds: true` dans next.config.js pour contourner un bug connu (aria-query/rolesMap).

---

[0.1.0]: https://github.com/your-org/botoologia/releases/tag/v0.1.0
