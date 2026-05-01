# Guide de déploiement — BoTooLogIA

## Variables d'environnement (production)

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `NODE_ENV` | Oui | `production` |
| `DATABASE_URL` | Oui | URL PostgreSQL avec TLS (ex. `postgresql://user:pass@host:5432/db?sslmode=require`) |
| `JWT_SECRET` | Oui | Min. 32 caractères, généré aléatoirement |
| `ADMIN_PROTECTION_ENABLED` | Recommandé | `true` pour exiger la connexion sur /botoadmin et APIs admin/boss |
| `NEXT_PUBLIC_APP_URL` | Recommandé | URL publique du site (ex. `https://botoologia.fr`) |

## Étapes de déploiement

1. **Build**
   ```bash
   npm install
   npm run db:generate   # ou prisma generate
   npm run build
   ```

2. **Base de données**
   - Créer la base et l’utilisateur PostgreSQL (avec TLS en prod).
   - Appliquer le schéma : `npx prisma db push` (dev) ou `npx prisma migrate deploy` (prod avec migrations).
   - Optionnel : `npm run db:seed` pour créer l’admin et le BOSS par défaut.

3. **Démarrage**
   ```bash
   npm start
   ```
   Ou via un process manager (PM2, systemd) / conteneur (Docker).

4. **Health check**
   - Utiliser `GET /api/health` pour les sondes de disponibilité (retourne 200 si la base est connectée).

## Sécurité en production

- Mettre `ADMIN_PROTECTION_ENABLED=true`.
- Utiliser un `JWT_SECRET` fort et unique (jamais le défaut du .env.example).
- Ne pas exposer les fichiers `.env` ; configurer les variables côté hébergeur (Vercel, Railway, etc.).
- Voir `docs/SECURITY.md` pour les bonnes pratiques.

## Plateformes

- **Vercel** : Déployer le dossier du projet Next.js ; renseigner les variables dans le dashboard ; la base doit être accessible depuis Vercel (ex. Neon, Supabase).
- **Docker** : Ajouter un `Dockerfile` multi-stage (build Next.js puis `next start`) et lancer la DB via `docker-compose` ou un service externe.
