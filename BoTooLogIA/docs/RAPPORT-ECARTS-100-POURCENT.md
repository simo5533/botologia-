# Rapport — Ce qu’il manque pour atteindre 100/100

**Date :** 2025-03-02  
**Objectif :** Liste concrète des écarts par bloc pour viser un résultat de 100 % sur chaque domaine.

---

## Vue d’ensemble

| Bloc | Score actuel | Écart | Priorité |
|------|--------------|--------|----------|
| Frontend | 92 % | 8 pts | Moyenne |
| Backend / API | 95 % | 5 pts | Faible |
| Base de données | 95 % | 5 pts | Faible |
| Authentification | 90 % | 10 pts | Moyenne |
| Bot / widget | 90 % | 10 pts | Moyenne |
| Analytics | 85 % | 15 pts | Haute |
| Tests | 70 % | 30 pts | Haute |
| DevOps / doc | 95 % | 5 pts | Faible |

---

## 1. Frontend (92 % → 100 %)

### Manques identifiés

| # | Action | Détail |
|---|--------|--------|
| 1 | Activer le lint en build | `next.config.js` : `eslint: { ignoreDuringBuilds: true }` → passer à `false` une fois le lint vert. |
| 2 | Corriger les erreurs ESLint | Lancer `npm run lint` (ou `next lint`) et traiter toutes les erreurs (et si possible les warnings). |
| 3 | Accessibilité (a11y) | Boucler les avertissements a11y (labels, rôles ARIA, contraste) signalés par le linter. |
| 4 | Vérifier le responsive | Valider les pages clés (accueil, botolink, botolab, botoadvantage, admin) sur mobile/tablette. |
| 5 | Performance perçue | Optionnel : lazy-load des sections lourdes, optimiser les images (sizes, format). |

### Commandes utiles

```bash
npm run lint
# ou
npx next lint
```

---

## 2. Backend / API (95 % → 100 %)

### Manques identifiés

| # | Action | Détail |
|---|--------|--------|
| 1 | Validation des entrées | S’assurer que toutes les routes POST/PUT utilisent un schéma (Zod ou autre) et renvoient 400 en cas d’invalide. |
| 2 | Gestion d’erreurs homogène | Toutes les routes API doivent utiliser les helpers (`apiSuccess`, `apiValidationError`, `apiServerError`) et ne pas exposer de stack en prod. |
| 3 | Rate limiting | Optionnel : limiter les appels sur `/api/auth/login`, `/api/contact`, `/api/analytics/track` pour limiter les abus. |
| 4 | Documentation API à jour | Vérifier que `docs/API*.md` (ou équivalent) décrit les routes publiques et les codes de réponse. |

### Vérifications

- Parcourir les routes dans `app/api/` et confirmer validation + réponses d’erreur.
- Tester manuellement ou via des tests les cas limites (body vide, champs manquants).

---

## 3. Base de données (95 % → 100 %)

### Manques identifiés

| # | Action | Détail |
|---|--------|--------|
| 1 | Déploiement prod | Avoir une instance PostgreSQL en production et `DATABASE_URL` configurée. |
| 2 | Migrations en prod | Exécuter `npx prisma migrate deploy` (ou stratégie choisie) et confirmer que le schéma est à jour. |
| 3 | Sécurité BDD | Appliquer le script optionnel `prisma/scripts/secure-public-schema.sql` si documenté. |
| 4 | Sauvegardes | Mettre en place des sauvegardes régulières (pg_dump ou outil hébergeur). |
| 5 | Health check | S’assurer que `GET /api/health` vérifie la connexion Prisma et renvoie `database: "connected"` ou équivalent. |

### Commandes utiles

```bash
npx prisma migrate deploy
# puis vérifier
curl -s http://localhost:3000/api/health
```

---

## 4. Authentification (90 % → 100 %)

### Manques identifiés

| # | Action | Détail |
|---|--------|--------|
| 1 | Tests auth en CI | Exécuter les tests (password, auth-guard) en environnement stable (CI Linux) pour valider à 100 %. |
| 2 | Révocation de session | Vérifier que la déconnexion invalide bien la session côté serveur (suppression ou invalidation du token/session). |
| 3 | Politique mot de passe | Documenter (ou renforcer) les règles (longueur, complexité) et les appliquer à l’inscription et au changement de mot de passe. |
| 4 | Audit des logins | Les logs d’audit (createAuditLog) pour login/login_failed sont en place ; s’assurer qu’ils sont consultables (ex. admin/audit-logs). |
| 5 | 2FA | Vérifier le flux complet (activation, codes de secours, désactivation) et le documenter. |

### Commandes utiles

```bash
npm run test -- --run lib/auth lib/api/__tests__
```

---

## 5. Bot / widget (90 % → 100 %)

### Manques identifiés

| # | Action | Détail |
|---|--------|--------|
| 1 | Tests du bot | Ajouter des tests unitaires pour `lib/bot/knowledgeBase.ts` (findBestMatch, getReply) et éventuellement un test d’intégration pour `POST /api/bot/chat`. |
| 2 | Gestion des erreurs | S’assurer que le front du widget affiche un message clair si l’API bot échoue (timeout, 500). |
| 3 | Accessibilité widget | Vérifier focus clavier, aria-label sur le bouton d’ouverture et la fenêtre de chat. |
| 4 | Documentation | Mettre à jour la doc (BOT_GUIDE ou équivalent) si le comportement ou les endpoints ont changé. |

### Fichiers concernés

- `lib/bot/knowledgeBase.ts`
- `app/api/bot/chat/route.ts`
- `components/bot/BotWidget.tsx`, `ChatWindow.tsx`

---

## 6. Analytics (85 % → 100 %)

### Manques identifiés

| # | Action | Détail |
|---|--------|--------|
| 1 | Événements métier | Définir une liste d’événements (page_view, page_exit, service_click, cta_click, etc.) et s’assurer qu’ils sont envoyés depuis le front (useTrack / AnalyticsTracker). |
| 2 | Dashboard admin | Vérifier que le tableau de bord boss/admin affiche bien les métriques (revenus, stats, analytics) et que les appels API ne renvoient pas d’erreur. |
| 3 | Données réelles | Les métriques seront à 0 tant qu’il n’y a pas de trafic ; valider en prod après mise en ligne. |
| 4 | RGPD / consentement | Si applicable : bannière ou mécanisme de consentement avant envoi d’analytics, et doc dans la politique de confidentialité. |
| 5 | Tests | Optionnel : test unitaire ou mock pour la route `POST /api/analytics/track` (body valide, 400 si invalide). |

### Fichiers concernés

- `app/api/analytics/track/route.ts`
- Hooks / composants qui appellent `useTrack` ou équivalent
- Pages dashboard boss/admin

---

## 7. Tests (70 % → 100 %)

### Manques identifiés

| # | Action | Détail |
|---|--------|--------|
| 1 | Environnement Windows | Si `npm run test` échoue sur Windows (Rollup, modules optionnels), exécuter les tests en CI (GitHub Actions, GitLab CI) sur Linux pour un résultat fiable. |
| 2 | Couverture des modules critiques | Ajouter des tests pour : `lib/bot/knowledgeBase`, `lib/db/audit`, services boss (getDashboardData, etc.), validation des payloads API. |
| 3 | Tests d’API | Tests d’intégration pour au moins : `POST /api/bot/chat`, `POST /api/analytics/track`, `POST /api/contact`, et une route auth (login avec mocks). |
| 4 | Tests E2E | Optionnel : Playwright ou Cypress pour les parcours critiques (accueil → contact, login → dashboard). |
| 5 | Seuil de couverture | Définir un objectif (ex. 80 % lignes sur `lib/` et `app/api/`) et l’atteindre progressivement. |

### Commandes utiles

```bash
npm run test -- --run
npm run test:coverage
```

### Fichiers de tests existants

- `lib/auth/__tests__/password.test.ts`
- `lib/api/__tests__/auth-guard.test.ts`
- `lib/api/__tests__/response.test.ts`

---

## 8. DevOps / documentation (95 % → 100 %)

### Manques identifiés

| # | Action | Détail |
|---|--------|--------|
| 1 | CI/CD | Mettre en place un pipeline (GitHub Actions, GitLab CI, etc.) : install, typecheck, lint, test, build. |
| 2 | Déploiement | Suivre `docs/DEPLOYMENT_CHECKLIST.md` et valider une mise en production réelle (ou staging). |
| 3 | Variables d’environnement | Documenter dans `.env.example` ou dans la doc toutes les variables requises (DATABASE_URL, NEXTAUTH_SECRET, etc.). |
| 4 | Monitoring | Optionnel : logs centralisés, alertes sur erreurs 5xx ou indisponibilité de la BDD. |
| 5 | Doc à jour | Vérifier que DEMARRAGE, API, PRISMA_SETUP, BOT_GUIDE, DEPLOYMENT_CHECKLIST sont alignés avec le code actuel. |

### Commandes utiles

```bash
npm run typecheck
npm run lint
npm run test -- --run
npm run build
npm run audit:full:ts
```

---

## Plan d’action recommandé (ordre de priorité)

1. **Court terme (pour monter rapidement le score)**  
   - Activer et corriger le lint (Frontend + build).  
   - S’assurer que les tests passent en CI (Tests).  
   - Valider déploiement prod + migrations + health check (BDD, DevOps).

2. **Moyen terme**  
   - Ajouter tests sur bot, analytics, audit (Tests, Bot, Analytics).  
   - Renforcer validation et gestion d’erreurs des routes API (Backend).  
   - Vérifier auth (sessions, 2FA, audit) et doc (Auth, DevOps).

3. **Long terme**  
   - E2E sur parcours critiques.  
   - Rate limiting, RGPD analytics, sauvegardes BDD, monitoring.

---

## Résumé « checklist 100 % »

- [ ] **Frontend** : Lint activé en build, 0 erreur ESLint/a11y, responsive validé.  
- [ ] **Backend** : Validation + gestion d’erreurs homogène sur toutes les routes.  
- [ ] **BDD** : PostgreSQL en prod, migrations déployées, health check OK, sauvegardes.  
- [ ] **Auth** : Tests auth en CI OK, sessions et 2FA vérifiés, audit des logins consultable.  
- [ ] **Bot** : Tests knowledgeBase + API chat, erreurs widget gérées, a11y du widget.  
- [ ] **Analytics** : Événements définis et envoyés, dashboard OK, consentement si requis.  
- [ ] **Tests** : CI vert (typecheck, lint, test, build), couverture sur lib + API, optionnel E2E.  
- [ ] **DevOps** : CI/CD en place, déploiement selon checklist, doc et .env.example à jour.

Une fois ces points traités, le projet peut être considéré à **100 %** sur chaque bloc par rapport aux critères définis ici.
