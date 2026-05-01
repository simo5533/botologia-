# Démarrage BoTooLogIA — Par rôle

Guide de prise en main selon votre rôle (nouveau dev, développeur, admin technique, déploiement).

---

## Emails pour se connecter (tous les rôles)

Après avoir exécuté `npm run db:seed` (et éventuellement `npm run db:seed:admins`), vous pouvez vous connecter avec les comptes suivants. **Liste complète : [docs/CREDENTIALS.md](CREDENTIALS.md).**

### Comptes créés par `npm run db:seed`

| Rôle | Email | Mot de passe |
|------|--------|--------------|
| **Admin** | `admin@botoologia.local` | `admin123` |
| **Boss** | `boss@botoologia.local` | `admin123` |

Ces comptes n’ont **pas** de 2FA : connexion en une seule étape (email + mot de passe).

### Comptes créés par `npm run db:seed:admins` (3 admins avec 2FA)

| Rôle | Email | Mot de passe |
|------|--------|--------------|
| **Admin (niveau 1)** | `aomar@botoologia.local` | `Aomar2fa!24` à l’exécution — voir **console** |
| **Admin (niveau 2)** | `elhassane@botoologia.local` | `Elhassane2fa!24` |
| **Admin (niveau 3)** | `basma@botoologia.local` | `Basma2fa!24` |
| **Admin (niveau 2)** | `elhassane@botoologia.local` | `Elhassane2fa!24` à l’exécution — voir **console** ou **ADMIN_CREDENTIALS.txt** |
| **Admin (niveau 3)** | `basma@botoologia.local` | `Basma2fa!24` à l’exécution — voir **console** ou **ADMIN_CREDENTIALS.txt** |

Les **codes 2FA** (QR + codes de secours) sont affichés à l'exécution de `npm run db:seed:admins` et écrits dans `ADMIN_CREDENTIALS.txt`. Scanner le QR dans Google Authenticator pour la première connexion.

### Où se connecter

- **Page de login** : http://localhost:3000/login (ou `/login?redirect=/botoadmin`)
- **Après connexion** : redirection vers `/botoadmin` (dashboard admin)

**Note :** Si `ADMIN_PROTECTION_ENABLED` n’est pas à `"true"` dans `.env`, l’accès à `/botoadmin` peut être possible sans connexion (mode dev). En production, mettez `ADMIN_PROTECTION_ENABLED="true"`.

---

## 1. Nouveau développeur (premier clone)

### Prérequis
- **Node.js** >= 18
- **npm** (ou pnpm/yarn)
- **PostgreSQL** (local ou Docker)
- **Git**

### Étapes
1. **Cloner le dépôt**
   ```bash
   git clone <url-repo>
   cd BoTooLogIA
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   - Copier `.env.example` vers `.env`
   - Renseigner au minimum :
     - **DATABASE_URL** : selon la base utilisée (voir ci-dessous)
     - **JWT_SECRET** : 32+ caractères, ex. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - **Choix DATABASE_URL (recommandé en dev)** :
     - **Standalone (recommandé)** — après `npm run db:up:standalone` :  
       `DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5433/botoologia?schema=public"`
     - **Docker standard** — après `npm run db:up` :  
       `DATABASE_URL="postgresql://botoologia:BotoLogIA2025@localhost:5432/botoologia?schema=public"`  
       (et garder `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` comme dans `.env.example`)

4. **Base de données**
   - **Recommandé (évite les erreurs d'auth)** : `npm run db:up:standalone` puis dans `.env` : `DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5433/botoologia?schema=public"`.
   - Démarrer PostgreSQL (Docker si utilisé) : `npm run db:up` (depuis le dossier **BoTooLogIA** ou racine). *Si Docker n’est pas démarré : lancer Docker Desktop puis réessayer.*
   - Appliquer le schéma : `npm run db:push` (sync direct) **ou** `npm run db:migrate` (migrations versionnées ; Prisma demandera un nom de migration si c’est la première fois).
   - Générer le client Prisma : `npm run db:generate`
   - (Optionnel) Données de base : `npm run db:seed` puis `npm run db:seed:admins` pour les admins 2FA

5. **Lancer l’application**
   ```bash
   npm run dev
   ```
   Ouvrir http://localhost:3000

   **Windows + Docker : si le login échoue (erreur « Authentication failed »)**  
   Lancer l’app dans Docker (même réseau que la BDD) : `npm run db:up` puis `npm run db:push:docker` puis `npm run dev:docker`. Puis http://localhost:3000.

   **Démarrage complet en une commande (Docker requis)**  
   Si Docker Desktop est démarré : `npm run dev:full` (PostgreSQL + schéma + seed + app).  
   Sans `.env` : `npm run db:up:standalone` puis dans `.env` mettre `DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5433/botoologia?schema=public"`, puis `npm run db:push` et `npm run db:seed`.

   **Dépannage `npm run dev`**
   - **« Port 3000 is in use »** : une autre instance tourne déjà. Fermez l’autre terminal (Ctrl+C) ou utilisez l’URL indiquée (ex. http://localhost:3002). Pour forcer un port libre : `npm run dev:alt` (lance sur le port 3003).
   - **GET /api/auth/session 401** : normal si vous n’êtes pas connecté. Le frontend vérifie la session ; 401 = « non connecté », pas une erreur applicative.

6. **IDE (Cursor / VS Code)**
   - Ouvrir le dossier racine du projet
   - Si une popup Prisma demande la version : choisir **Prisma 7**
   - Ou exécuter : `Ctrl+Shift+P` → *Prisma: Unpin the current workspace from Prisma 6*
   - Référence de validité du schéma : `npx prisma validate`

### Vérifications rapides
```bash
npx prisma validate    # Schéma Prisma OK
npm run typecheck      # TypeScript OK
npm run build          # Build OK (optionnel)
```

---

## 2. Développeur (au quotidien)

### Commandes utiles
| Besoin | Commande |
|--------|----------|
| Lancer le dev | `npm run dev` |
| Vérifier les types | `npm run typecheck` |
| Linter | `npm run lint` |
| Générer le client Prisma après changement de schéma | `npm run db:generate` |
| Appliquer le schéma sans migration | `npm run db:push` |
| Créer une migration | `npm run db:migrate` (nom demandé) |
| Ouvrir Prisma Studio | `npm run db:studio` |
| Introspection schéma (tables/colonnes) | `npm run db:introspect` (voir [docs/INTROSPECTION_SCHEMA_SQL.md](INTROSPECTION_SCHEMA_SQL.md)) |

### Accès visuel à la base de données (Prisma Studio)

Configuration **PostgreSQL standalone** : port **5433**, base **botoologia**, utilisateur **postgres**.

1. **Vérifier que PostgreSQL tourne**
   ```bash
   netstat -ano | findstr :5433
   ```
   Si rien → démarrer : `npm run db:up:standalone` (depuis la racine ou `cd BoTooLogIA` puis `npm run db:up:standalone`).

2. **Vérifier le `.env`** (dossier `BoTooLogIA`)  
   Pour le standalone, il doit contenir :
   ```env
   DATABASE_URL="postgresql://postgres:TONMOTDEPASSE@127.0.0.1:5433/botoologia?schema=public"
   ```
   Remplace `TONMOTDEPASSE` par le mot de passe de l’utilisateur `postgres` (ex. `postgres` si non modifié).

3. **Lancer Prisma Studio (interface visuelle, sans rien installer)**
   ```bash
   npm run db:studio
   ```
   → Ouvre **http://localhost:5555** : toutes les tables, lecture et modification des données.

4. **Vérifier la connexion**
   ```bash
   npm run db:check
   ```
   Si erreur d’auth → corriger le mot de passe dans `.env`.

5. **Lister les tables en terminal**
   ```bash
   npm run db:introspect:tsx -- --output=table
   ```
   Ou avec `psql` si installé : `psql -U postgres -p 5433 -d botoologia -c "\dt"`

6. **Alternative : pgAdmin**  
   Si tu préfères pgAdmin : [pgadmin.org/download](https://www.pgadmin.org/download/). Connexion : Host **127.0.0.1**, Port **5433**, Database **botoologia**, Username **postgres**, Password (ton mot de passe).

**URL pour voir la base (Prisma Studio) :** **http://localhost:5555**

### Structure à connaître
- **Pages / UI** : `app/` (groupes `(public)`, `(admin)`, `(auth)`), `components/`
- **API** : `app/api/**/route.ts`
- **Logique métier** : `lib/` (auth, db, validations, bot, api)
- **Schéma BDD** : `prisma/schema.prisma` ; URL dans `prisma.config.ts`
- **Documentation** : `docs/` (API.md, BOT_GUIDE.md, PRISMA_SETUP.md, PROJECT_STRUCTURE.md)

### Conventions
- Imports avec alias `@/` (ex. `@/lib/db/prisma`)
- Routes API : réponses via `lib/api/response.ts` (apiSuccess, apiError, apiUnauthorized…)
- Routes admin : protéger avec `requireAdminSession` ou `requireStrictAdminSession` depuis `lib/api/auth-guard.ts`

---

## 3. Admin technique / Ops

### Variables d’environnement (production)
- `DATABASE_URL` : URL PostgreSQL (TLS recommandé)
- `JWT_SECRET` ou `PENDING_2FA_SECRET` : 32+ caractères (2FA)
- `ADMIN_PROTECTION_ENABLED="true"` : activer la protection des zones admin
- `NODE_ENV=production`

### Base de données
- Appliquer les migrations : `npx prisma migrate deploy`
- Ou schéma seul : `npx prisma db push` (selon la stratégie du projet)
- Seed initial (si prévu) : `npm run db:seed` puis éventuellement `npm run db:seed:admins` pour les 3 admins 2FA

### Build et démarrage
```bash
npm run build
npm run start
```

### Santé
- Endpoint : `GET /api/health` (200 = OK, 503 = dégradé)

---

## 4. Utilisateur admin (connexion au back-office)

### Accès
- **URL** : selon déploiement (ex. `https://votresite.com/botoadmin` ou `/login` avec redirection)
- **Protection** : activée si `ADMIN_PROTECTION_ENABLED=true` (sinon accès sans login en dev)

### Premier accès (après seed)
- Comptes par défaut (seed classique) : voir `prisma/seed.ts` (ex. admin@botoologia.local)
- Comptes 2FA (seed admins) : `npm run db:seed:admins` → identifiants dans la console et dans `ADMIN_CREDENTIALS.txt` (à supprimer après sauvegarde sécurisée)

### Connexion avec 2FA
1. Saisir email + mot de passe
2. Si 2FA activé : saisir le code à 6 chiffres (app d’authentification ou code de secours)
3. Accès au dashboard admin

---

## 5. Dépannage courant

| Problème | Action |
|----------|--------|
| `DATABASE_URL` manquant | Vérifier `.env` et `prisma.config.ts` |
| Erreur Prisma "url is missing" dans l’IDE | Faux positif Prisma 7 ; vérifier avec `npx prisma validate` |
| `npm run lint` échoue (module jsx-a11y / aria-query / rolesMap) | Dépendance `aria-query` parfois incomplète. Essayer : `Remove-Item -Recurse -Force node_modules; npm install` puis `npm run lint`. Sinon ignorer le lint ou mettre à jour `eslint-config-next`. |
| Build échoue | `npm run typecheck` puis corriger les erreurs TypeScript ; vérifier que `prisma generate` a été exécuté |
| Page admin ne s’affiche pas | Vérifier `ADMIN_PROTECTION_ENABLED` et être connecté (cookie de session) |
| Migration échoue (P1000 Authentication failed) | 1) Lancer **Docker Desktop**, attendre qu’il soit prêt. 2) Dans **BoTooLogIA** : `npm run db:restart-standalone` (redémarre le conteneur port 5433 avec postgres/postgres puis exécute db:push). 3) Sinon `npm run db:up` (port 5432) puis dans `.env` mettre `DATABASE_URL=postgresql://botoologia:BotoLogIA2025@localhost:5432/botoologia?schema=public` et `npm run db:push`. |
| **db:seed:admins** échoue (P1000, credentials « not available ») | 1) **.env** dans le dossier **BoTooLogIA** (celui qui contient `prisma/`). 2) **Si BDD sur le port 5433** (standalone) : `DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5433/botoologia?schema=public"`. 3) **Si BDD sur le port 5432** : `DATABASE_URL="postgresql://botoologia:BotoLogIA2025@localhost:5432/botoologia?schema=public"`. 4) Relancer `npm run db:seed` puis `npm run db:seed:admins`. |
| Docker : « unable to get image » / « pipe dockerDesktopLinuxEngine: The system cannot find the file specified: The system cannot find the file specified » | **Docker Desktop n’est pas démarré.** Lancer **Docker Desktop** (Windows), attendre qu’il soit prêt (icône verte), puis dans **BoTooLogIA** : `npm run db:up`. Sinon installer PostgreSQL en local et utiliser `DATABASE_URL` sans Docker. |
| **Prisma Studio** : « authentification par mot de passe échouée » ou « introspect failed » (Windows + Docker) | La connexion depuis l’hôte vers le conteneur PostgreSQL échoue. Utiliser **Prisma Studio dans Docker** : `npm run db:studio:docker` (depuis **BoTooLogIA** ou la racine), puis ouvrir **http://localhost:5555** dans le navigateur. |
| **Login échoue** (POST /api/auth/login 500, « Authentication failed ») | Sous Windows : l’app sur l’hôte ne peut pas s’authentifier vers PostgreSQL dans Docker. **Solution :** `npm run db:up` puis `npm run db:push:docker` puis `npm run dev:docker`. Ouvrir http://localhost:3000. |

---

## 6. Référence des documentations

| Document | Contenu |
|----------|---------|
| `docs/API.md` | Routes API, auth, format des réponses |
| `docs/PRISMA_SETUP.md` (dans docs/ ou racine) | Config Prisma 7, validation, IDE |
| `docs/BOT_GUIDE.md` | Bot guide (texte/vocal), base de connaissances, API bot |
| `docs/PROJECT_STRUCTURE.md` | Arborescence, config, scripts, liaisons |
| `docs/ANALYSE_ADMIN_SECURISE.md` | Admin sécurisé, 2FA, rôles |
| `docs/DEMARRAGE.md` | Ce guide (démarrage par rôle) |

---

## Checklist premier démarrage

- [ ] Node >= 18 installé
- [ ] `npm install` exécuté
- [ ] `.env` créé à partir de `.env.example` (DATABASE_URL, JWT_SECRET)
- [ ] PostgreSQL démarré (`npm run db:up` si Docker)
- [ ] `npm run db:push` ou `npm run db:migrate`
- [ ] `npm run db:generate`
- [ ] `npm run dev` → site accessible sur http://localhost:3000
- [ ] `npx prisma validate` OK
- [ ] (Optionnel) Extension Prisma en mode Prisma 7 dans l’IDE
