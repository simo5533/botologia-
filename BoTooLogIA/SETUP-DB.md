# Configuration de la base de données BoTooLogIA

## Erreur P1000 — Authentication failed / credentials (not available) are not valid

PostgreSQL refuse la connexion avec le user/mot de passe du `.env`. Verifiez que :
1. PostgreSQL tourne (Docker : `npm run db:up` apres avoir demarre Docker Desktop ; ou PostgreSQL local sur le port 5432).
2. Les identifiants correspondent : avec Docker, `.env` doit avoir `POSTGRES_USER=botoologia`, `POSTGRES_PASSWORD=BotoLogIA2025`, `POSTGRES_DB=botoologia`. Si le conteneur a ete cree avant avec un autre mot de passe, faites `npm run db:reset` puis `npm run db:push` et `npm run db:seed`. En local, creez l'utilisateur et la base ou adaptez `DATABASE_URL`.
3. Les commandes sont lancees depuis la racine du projet (ou se trouve le `.env`).

---

## Erreur « unable to get image postgres:16-alpine » / « pipe dockerDesktopLinuxEngine »

Cela signifie que **Docker n’est pas démarré** (ou pas installé). Le projet peut quand même utiliser une base PostgreSQL sans Docker.

---

## Option 1 — Avec Docker Desktop

1. **Installer** [Docker Desktop pour Windows](https://www.docker.com/products/docker-desktop/) si besoin.
2. **Démarrer** Docker Desktop et attendre qu’il soit prêt (icône dans la barre des tâches).
3. Dans le dossier du projet :
   ```powershell
   npm run db:up
   npm run db:push
   npm run db:seed
   ```

---

## Option 2 — PostgreSQL installé localement (sans Docker)

1. **Installer** [PostgreSQL](https://www.postgresql.org/download/windows/) (ex. port 5432).
2. **Créer** une base et un utilisateur, par exemple dans `psql` :
   ```sql
   CREATE USER botoologia WITH PASSWORD 'BotoLogIA2025';
   CREATE DATABASE botoologia OWNER botoologia;
   ```
3. Le fichier **.env** doit contenir (déjà le cas par défaut) :
   ```env
   DATABASE_URL="postgresql://botoologia:BotoLogIA2025@localhost:5432/botoologia?schema=public"
   ```
4. **Appliquer** le schéma et les données de test :
   ```powershell
   npm run db:push
   npm run db:seed
   ```

Vous pouvez ensuite lancer `npm run dev` sans jamais utiliser `npm run db:up` (Docker).

---

## Vérifier la connexion

```powershell
npm run db:check
```

Si la base répond, vous verrez « Base prête, connexion liée au .env ».
