# Checklist de déploiement — BoTooLogIA

Checklist pour déployer l’application en staging ou production.

---

## Avant le déploiement

- [ ] **Environnement**
  - [ ] Node.js >= 18 installé sur le serveur ou dans l’image Docker.
  - [ ] Variables d’environnement définies (voir `.env.example`) : `DATABASE_URL`, `NEXTAUTH_SECRET` (ou équivalent), etc.

- [ ] **Base de données**
  - [ ] PostgreSQL accessible (réseau, firewall, credentials).
  - [ ] `DATABASE_URL` valide (format `postgresql://user:pass@host:port/dbname`).
  - [ ] Migrations appliquées : `npx prisma migrate deploy` (ou `db:push` en dev).
  - [ ] Optionnel : exécuter `prisma/scripts/secure-public-schema.sql` pour durcir les droits du schéma `public`.

- [ ] **Build**
  - [ ] `npm ci` (ou `npm install` sans dev si besoin).
  - [ ] `npm run db:validate` et `npm run typecheck` OK.
  - [ ] `npm run build` réussi (BDD accessible pendant le build si des routes sont pré-rendues avec données).

- [ ] **Tests**
  - [ ] `npm run test` (Vitest) OK.

---

## Déploiement

- [ ] **Artifacts**
  - [ ] Dossier `.next` (ou image Docker) déployé avec `node_modules` de production.
  - [ ] Binaire Prisma Client généré (`prisma generate` exécuté pendant le build).

- [ ] **Démarrage**
  - [ ] `npm run start` (ou équivalent PM2/systemd) sur le port configuré (ex. 3000).

- [ ] **Santé**
  - [ ] `GET /api/health` retourne 200 avec `database: "connected"` si la BDD est requise.

---

## Après le déploiement

- [ ] **Fonctionnel**
  - [ ] Page d’accueil accessible.
  - [ ] Login possible (email/mot de passe).
  - [ ] Dashboard admin accessible pour un compte admin.

- [ ] **Sécurité**
  - [ ] HTTPS activé.
  - [ ] Secrets non exposés (pas de `.env` en clair dans le repo public).

- [ ] **Monitoring**
  - [ ] Logs applicatifs et erreurs surveillés.
  - [ ] Health check configuré dans l’orchestrateur (K8s, ECS, etc.) si applicable.

---

## Références

- Démarrage local : `docs/DEMARRAGE.md`
- API : `docs/API.md`
- Base de données : `docs/PRISMA_SETUP.md`, `docs/DATABASE_AUDIT_REPORT.md`
