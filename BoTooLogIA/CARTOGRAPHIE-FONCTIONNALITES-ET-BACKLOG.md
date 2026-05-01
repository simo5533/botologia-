# BoTooLogIA — Cartographie, checklist et backlog fonctionnel

**Document unique de référence** : synthèse de ce qui a été demandé (infra, Prisma, qualité, E2E, OWASP, santé BDD), **état d’implémentation**, et **liste des fonctionnalités à ajouter ou renforcer**.  
À mettre à jour à chaque sprint (cocher les cases, ajuster les priorités).

---

## 1. Niveau actuel du projet (synthèse)

| Axe | Niveau indicatif | Commentaire court |
|-----|------------------|---------------------|
| **Données** | Pré-prod solide | PostgreSQL 16, migrations Prisma, soft delete, audit applicatif |
| **API** | ~85–90 % | Routes nombreuses, patterns d’erreur, garde-fous auth/rôles |
| **Sécurité** | Intermédiaire → bon | Rate limit, headers, Zod sur beaucoup de routes ; audit npm / Next 15+ à planifier |
| **Qualité** | Bon | Typecheck, lint, Vitest + couverture ciblée, Playwright partiel |
| **Exploitation** | Moyen | Health check, logs structurés ; pas d’APM / backup automatisé dans le repo |

**Objectif document** : tout tracer ici pour ne rien oublier ; **l’implémentation se fait par priorités** (P0 → P2), pas en une seule fois.

---

## 2. Checklist technique (ordre d’exécution recommandé)

Cocher au fur et à mesure sur votre machine / CI.

| # | Commande / action | Statut | Notes |
|---|---------------------|--------|--------|
| 1 | `docker compose up -d` | ☐ | Postgres `5433:5432`, volume `botoologia_pgdata`, healthcheck |
| 2 | Aligner `.env` : `DATABASE_URL` = même user/mdp/DB que `POSTGRES_*` | ☐ | Port hôte **5433** |
| 3 | `npx prisma migrate deploy` | ☐ | |
| 4 | `npm run typecheck` | ☐ | 0 erreur |
| 5 | `npm run lint` | ☐ | 0 problème |
| 6 | `npm run test:coverage` | ☐ | Seuils Vitest OK |
| 7 | `npm run build` | ☐ | |
| 8 | `npx playwright install chromium` | ☐ | |
| 9 | `npm run db:seed:e2e` puis E2E avec `CI`, `E2E_*`, `ADMIN_PROTECTION_ENABLED` | ☐ | Démarrer `npm run start` si `CI=true` sans `webServer` |
| 10 | `npm run audit` | ☐ | Transitives dev (Prisma CLI, etc.) ; prod : suivre advisories Next |

**Scripts utiles** : `db:check`, `db:seed`, `db:seed:e2e`, `test:e2e`, `audit`.

---

## 3. Blocs A → G (rappel) — état cible vs à finaliser

### A — Docker & base
- [x] `postgres:16-alpine`, port **5433**, healthcheck, volume nommé, `depends_on` healthy  
- [x] `scripts/check-db.js` (retries + SQL + `migrate status`)  
- [ ] **À renforcer** : procédure backup/restaure documentée en prod ; secrets hors Git

### B — TypeScript & ESLint
- [x] `strict`, paths `@/*`, includes projet  
- [x] Règles ESLint strictes (any, unused-vars) ; `explicit-function-return-type` désactivé pour éviter milliers de warnings (réactiver progressivement sur `lib/api` si souhaité)

### C — Tests Vitest
- [x] Fichiers de tests clés (db-error-handler, env, soft-delete, rate-limit-policies, 2FA, with-api-error-handler, etc.)  
- [ ] **À ajouter** : tests pour nouveaux modules `lib/validators/*`, `require-role`, `sanitize` si logique non couverte

### D — Build Next & headers
- [x] Headers sécurité dans `next.config.js`  
- [ ] Vérifier systématiquement `export const dynamic = 'force-dynamic'` sur **toutes** les routes DB/cookies/headers  
- [ ] `next/image` : `remotePatterns` si nouveaux domaines externes

### E — Playwright
- [x] Config `e2e/`, health, auth, admin + `/api/users`  
- [ ] Fixture `storageState` partagée, specs CRUD admin plus larges si UI stabilisée  
- [ ] CI : démarrer `next start` avant tests si `webServer` absent en `CI=true`

### F — OWASP (couverture cible)

| ID | Thème | Déjà en place (résumé) | À compléter |
|----|--------|-------------------------|-------------|
| F1 | Injection | Zod sur beaucoup d’API | **100 %** des POST/PUT/PATCH ; `lib/validators/` par domaine exhaustif |
| F2 | Données exposées | `sanitizeUserForApi`, selects ciblés | Appliquer partout ; jamais `passwordHash` / secrets en JSON |
| F3 | XSS | CSP headers | DOMPurify si `dangerouslySetInnerHTML` ; audit composants |
| F4 | Contrôle d’accès | `requireAdminSession` / boss | `requireRole` homogène ; tests 403 |
| F5 | Mauvaise config | `NODE_ENV`, pas de routes debug en prod | Vérifier routes `/api/debug*` |
| F6 | Composants vulnérables | Dépendances | Plan montée Next 15+ / audit |
| F7 | Auth défaillante | Sessions serveur, cookies | Durée session / refresh documentés en prod |
| F8 | Intégrité logicielle | `npm audit` | Pipeline CI + politique de mise à jour |
| F9 | Journalisation | `lib/logger` | Ne jamais logger secrets ; corrélation `requestId` optionnelle |
| F10 | SSRF | — | Valider URLs sortantes (webhooks, fetch admin) |

**CSRF / origine** : middleware `verify-api-origin` sur mutations si `NEXT_PUBLIC_APP_URL` défini — à garder cohérent en prod.

### G — Santé & audit DB
- [x] `GET /api/health` (db, uptime, version)  
- [x] `AuditLog` + `createAuditLog` sur flux sensibles  
- [ ] **Option** : triggers PostgreSQL « append-only » sur `AuditLog` (niveau enterprise)

---

## 4. Base de données — évolutions recommandées

| Priorité | Évolution | Risque migration | Intérêt |
|----------|-----------|------------------|---------|
| P1 | FK optionnelles : `Contact.assignedTo`, `Prospect.assignedTo`, `AppSettings.updatedBy`, `Activity.authorId` → `User.id` | Moyen (données existantes non-CUID) | Intégrité référentielle |
| P1 | `BotConversation` : relation optionnelle vers `User` | Faible | Cohérence modèle |
| P2 | Enums : `Revenue.status`, `Notification.type` (au lieu de `String` libre) | Moyen | Données propres |
| P2 | Index / partitionnement ou table d’archivage pour `Analytics` / `PageView` | Variable | Perf volumétrie |
| P3 | RLS PostgreSQL par `tenant` (si multi-tenant un jour) | Élevé | Isolation forte |

**Ne pas** ajouter les FK sans script de migration des données (nettoyer `assignedTo` invalide).

---

## 5. Backlog fonctionnel produit (à ajouter ou approfondir)

Légende : **P0** critique MVP, **P1** important, **P2** amélioration, **P3** nice-to-have.

### 5.1 Authentification & compte
| ID | Fonctionnalité | Priorité | Détail / critères d’acceptation |
|----|----------------|----------|----------------------------------|
| AUTH-01 | Réinitialisation mot de passe bout-en-bout | P1 | Email SMTP + token TTL + page dédiée testée E2E |
| AUTH-02 | Vérification email (lien signé) | P2 | Champ `emailVerified` déjà présent |
| AUTH-03 | Gestion sessions actives (liste + révocation) | P2 | UI admin ou profil + API |
| AUTH-04 | OAuth (Google / Microsoft) | P3 | Si besoin B2B |

### 5.2 Admin & BOSS
| ID | Fonctionnalité | Priorité | Détail |
|----|----------------|----------|--------|
| ADM-01 | CRUD utilisateurs complet (filtres, pagination, export) | P1 | API `/api/users` déjà partielle |
| ADM-02 | Tableau de bord indicateurs temps réel (cache / revalidate) | P2 | |
| ADM-03 | Paramètres application (feature flags dans `AppSettings`) | P1 | UI + validation |
| ADM-04 | Export RGPD (export données utilisateur) | P2 | ZIP JSON + logs |

### 5.3 CRM & commercial
| ID | Fonctionnalité | Priorité | Détail |
|----|----------------|----------|--------|
| CRM-01 | Pipeline Kanban prospects | P1 | Drag & drop + persistance `status` |
| CRM-02 | Tâches / rappels (`nextFollowUp`) + notifications | P1 | Job `ScheduledTask` ou cron |
| CRM-03 | Duplication contact → prospect | P2 | |
| CRM-04 | Scoring automatique (règles ou IA) | P3 | |

### 5.4 Contact & formulaires
| ID | Fonctionnalité | Priorité | Détail |
|----|----------------|----------|--------|
| CNT-01 | Accusé réception email au demandeur | P1 | SMTP |
| CNT-02 | Anti-spam renforcé (honeypot + score) | P2 | En complément du rate limit |
| CNT-03 | Pièces jointes (taille max, scan virus côté serveur) | P3 | |

### 5.5 Agent IA & bot
| ID | Fonctionnalité | Priorité | Détail |
|----|----------------|----------|--------|
| AI-01 | Quotas par utilisateur / jour | P1 | Table ou `AppSettings` |
| AI-02 | Historique conversations exportable | P2 | |
| AI-03 | RAG sur contenu CMS externe | P3 | |

### 5.6 Analytics & conformité
| ID | Fonctionnalité | Priorité | Détail |
|----|----------------|----------|--------|
| ANA-01 | Opt-out cookies + bannière alignée CNIL | P1 | Lier au tracking |
| ANA-02 | Rétention configurable + purge batch | P1 | `Analytics` / `PageView` |
| ANA-03 | Tableaux de funnel | P3 | |

### 5.7 Facturation / revenue
| ID | Fonctionnalité | Priorité | Détail |
|----|----------------|----------|--------|
| REV-01 | Enum statuts + workflow (brouillon → payé) | P1 | Modèle + UI |
| REV-02 | Génération PDF facture | P2 | |
| REV-03 | Export comptable (CSV/FEC) | P3 | |

### 5.8 Exploitation & DX
| ID | Fonctionnalité | Priorité | Détail |
|----|----------------|----------|--------|
| OPS-01 | Script backup DB + rotation | P1 | Cron ou GitHub Actions |
| OPS-02 | Métriques Prometheus / OpenTelemetry | P2 | |
| OPS-03 | Page `/status` publique (réutilise health) | P2 | |

---

## 6. Ordre de réalisation suggéré (3 vagues)

**Vague 1 (sécurité & stabilité)**  
P0 checklist technique, alignement env, FKs ou nettoyage données avant FKs, Zod sur toutes les mutations, audit dépendances planifié.

**Vague 2 (valeur métier)**  
SMTP mot de passe oublié + accusé contact, CRM Kanban + rappels, enums `Revenue`/`Notification`, rétention analytics.

**Vague 3 (scale & confort)**  
OAuth, RAG, APM, partitionnement, RGPD export avancé.

---

## 7. Références dans le dépôt

| Sujet | Fichiers / dossiers |
|-------|---------------------|
| Schéma BDD | `prisma/schema.prisma`, `prisma/migrations/` |
| Config Prisma 7 | `prisma.config.ts` |
| Docker | `docker-compose.yml`, `docker-compose.override.yml` |
| Auth / session | `lib/auth/`, `middleware.ts`, `app/api/auth/*` |
| Admin / boss | `app/api/admin/*`, `app/api/boss/*` |
| Audit | `lib/db/audit.ts`, `lib/validations/audit.ts` |
| Santé | `app/api/health/route.ts` |
| E2E | `e2e/`, `playwright.config.ts`, `scripts/seed-e2e.ts` |
| Rapport interfaces | `RAPPORT-ANALYSE-FULLSTACK-INTERFACES.md` |

---

*Fin du document — à versionner et à faire évoluer avec l’équipe.*
