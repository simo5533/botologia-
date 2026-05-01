# Déploiement BoTooLogIA

## Prérequis

- Node.js >= 18
- PostgreSQL (local ou distant)
- Variables d'environnement (voir `.env.example`)

## Vérification avant déploiement

Exécuter la chaîne complète (deps, typecheck, tests, build) :

```bash
npm run check:deploy
```

Ou étape par étape :

```bash
node scripts/verify-deps.js   # Dépendances installées
npm run typecheck             # TypeScript
npm run test                  # Tests Vitest (lib + app)
npm run build                 # Build Next.js + Prisma generate
```

## Déploiement Vercel

1. **Lier le projet**  
   Sur [vercel.com](https://vercel.com), importer le dépôt Git. Si l’app est dans un sous-dossier (ex. `BoTooLogIA/`), définir **Root Directory** sur ce dossier.

2. **Variables d’environnement** (Settings → Environment Variables) — à renseigner pour Production (et Preview si besoin) :
   - `DATABASE_URL` : URL PostgreSQL (ex. [Neon](https://neon.tech), [Vercel Postgres](https://vercel.com/storage/postgres), [Supabase](https://supabase.com))
   - `NEXTAUTH_SECRET` : secret fort (min. 64 caractères)
   - `NEXTAUTH_URL` : URL de l’app déployée (ex. `https://votre-projet.vercel.app`)
   - Optionnel : `ANTHROPIC_API_KEY`, SMTP, etc. (voir `.env.example`)

3. **Build**  
   Vercel exécute `npm run build` (défini dans `package.json` : `prisma generate && next build`). Aucune config supplémentaire nécessaire.

4. **Migrations**  
   Après le premier déploiement, appliquer les migrations sur la base de prod :
   - En local avec `DATABASE_URL` pointant vers la BDD de prod :  
     `npx prisma migrate deploy`
   - Ou via un script CI / action GitHub qui exécute la même commande.

5. **Déploiement**  
   Chaque push sur la branche liée (souvent `main`) déclenche un build et un déploiement. Les previews sont créées pour les autres branches si activées.

---

## Déploiement Docker (production)

1. **Créer un fichier `.env`** à la racine du projet (copier depuis `.env.example`) avec au minimum :
   - `DATABASE_URL` : URL PostgreSQL (pour l'app et le conteneur db si utilisé)
   - `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` (pour le service db)
   - `NEXTAUTH_SECRET` (min. 64 caractères)
   - `NEXTAUTH_URL` : URL publique de l'app (ex. `https://votredomaine.com`)

2. **Lancer en production-like** (PostgreSQL + app buildée) :

   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

3. **Appliquer les migrations** (première fois ou après changement de schéma) :

   ```bash
   docker compose -f docker-compose.prod.yml run --rm app npx prisma migrate deploy
   ```

4. **Accès** : http://localhost:3000

## Déploiement manuel (VPS / PM)

1. Sur le serveur : cloner le repo, puis `npm ci`, `npm run build`.
2. Configurer `.env` (DATABASE_URL, NEXTAUTH_*, etc.).
3. Lancer la base si besoin (ex. `docker compose -f docker-compose.standalone.yml up -d` avec DATABASE_URL sur le port 5433).
4. Exécuter `npx prisma migrate deploy`.
5. Démarrer l'app : `npm run start` (ou via PM2/systemd) sur le port 3000.

## Tests couverts

- **lib** : auth (password), api (auth-guard, response), db (prisma, maintenance mocks), bot (knowledgeBase)
- **app** : route API analytics/track
- Lancer tous les tests : `npm run test`

## Fichiers de config déploiement

| Fichier | Rôle |
|--------|------|
| `Dockerfile` | Dev (next dev + BDD Docker) |
| `Dockerfile.production` | Build + run production (next start) |
| `docker-compose.yml` | Dev : db + app (profile app) + outils Prisma |
| `docker-compose.standalone.yml` | DB seule (port 5433, auth trust) |
| `docker-compose.prod.yml` | Production : db + app buildée |
