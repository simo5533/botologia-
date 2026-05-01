# Déploiement (Vercel + PostgreSQL)

## Dossier racine du projet

Le dépôt peut contenir plusieurs niveaux de dossiers : dans **Vercel → Project → Settings → General → Root Directory**, indique le dossier qui contient **`package.json`** et **`prisma/`** (ex. `BoTooLogIA/BoTooLogIA/BoTooLogIA` selon ton clone).

## Variables d’environnement (Production et Preview)

**Avant le premier build réussi** : ajoute `DATABASE_URL`, `NEXTAUTH_SECRET` et `JWT_SECRET` via **`npx vercel env add …`** ou **Dashboard → Environment Variables** (Production + Preview si besoin). Utilise une base PostgreSQL **distante** (Neon, etc.), pas `localhost`.

| Variable | Obligatoire | Détail |
|----------|-------------|--------|
| `DATABASE_URL` | Oui | URL PostgreSQL (ex. Neon / Supabase / Vercel Postgres). Pour les hébergeurs cloud, ajouter souvent `?sslmode=require`. Utiliser l’URL **poolée** si le fournisseur la propose (serverless). |
| `NEXTAUTH_SECRET` | Oui | ≥ 32 caractères (ex. `openssl rand -hex 32`). |
| `JWT_SECRET` | Oui | ≥ 32 caractères (distinct de NEXTAUTH_SECRET). |
| `NEXT_PUBLIC_APP_URL` | Fortement recommandé | URL publique du site, ex. `https://ton-projet.vercel.app`. |
| `NODE_ENV` | Non | Laissé à `production` par Vercel. |
| `ADMIN_PROTECTION_ENABLED` | Non | Par défaut la protection admin est active ; mettre `false` uniquement pour tests. |
| `SKIP_ENV_VALIDATION` | Non | Ne pas utiliser en prod (réservé CI/tests). |
| `OPENAI_API_KEY` | Si agents IA | Sinon fonctionnalités IA désactivées ou fallback. |

Le démarrage serveur valide `DATABASE_URL`, `NEXTAUTH_SECRET` et `JWT_SECRET` (`lib/env-validation.ts`).

## Build Vercel (`vercel.json`)

- `npm ci` puis **`prisma migrate deploy`** puis **`npm run build`** (`prisma generate && next build`).
- La base doit être joignable depuis les machines de build Vercel (Neon/Supabase autorisent généralement ces IP).

## Après le premier déploiement

1. Vérifier que les migrations sont passées (logs de build).
2. Optionnel : données initiales — exécuter le seed **depuis ta machine** ou un job CI pointant vers la même `DATABASE_URL` :  
   `npx tsx prisma/seed.ts`  
   (Ne pas committer de secrets ; le seed est interactif via `.env` local ou variables injectées.)

## Node

`package.json` impose **Node ≥ 20**. Dans Vercel → Settings → General → Node.js Version, choisir **20.x**.

## Dépannage

- **Erreur Prisma au build** : `DATABASE_URL` manquant ou incorrect dans l’environnement Vercel (onglet Variables pour le bon environnement).
- **Erreur au runtime** : secrets trop courts ou oubliés ; consulter les logs Functions / Runtime Logs.
- **`npm ci` échoue** : committer `package-lock.json` à jour après `npm install` en local.
