# Ce qui a été créé (après force-reset + seed)

Récapitulatif après `prisma db push --force-reset` puis `npm run db:seed`.

---

## Connexion utilisée

- **DATABASE_URL** : `postgresql://postgres:botoologia@127.0.0.1:5433/botoologia?schema=public`
- Base : **botoologia**, schéma **public**, port **5433** (standalone).

---

## Base de données (schéma 100 %)

- **User** : id (cuid), email, passwordHash, name, firstName, lastName, **role** (user | admin | boss), adminLevel, **status** (active | verified | suspended | banned), 2FA, lastLoginAt, passwordChangedAt, failedLoginAttempts, lockedUntil, createdAt, updatedAt
- **Session** : id, userId, tokenHash, expiresAt, createdAt
- **AuditLog** : id, action, userId, resource, **severity** (LOW | MEDIUM | HIGH | CRITICAL), details, ip, userAgent, createdAt
- **Contact** : id, name, email, message, **status** (new | read | archived), source, createdAt, updatedAt
- **Revenue** : id, amount, currency, periodType, periodValue, label, createdAt, updatedAt
- **AppSettings** : id, key, value, createdAt, updatedAt

Enums : **Role**, **UserStatus**, **AuditSeverity**, **ContactStatus**.

---

## Données créées par le seed

| Type        | Détail |
|------------|--------|
| **Admin**  | `admin@botoologia.local` — mot de passe : `admin123` |
| **Boss**   | `boss@botoologia.local` — mot de passe : `admin123` |
| **Audit**  | 2 entrées d’audit créées |

### Après `npm run db:seed:admins` — 3 admins avec 2FA

| Admin     | Niveau | Email                        | Mot de passe      |
|-----------|--------|------------------------------|-------------------|
| Aomar     | 1      | `aomarlaasri@gmail.com`     | `Aomar2fa!24`     |
| Elhassane | 2      | `elhassane@botoologia.local` | `Elhassane2fa!24` |
| Basma     | 3      | `basma@botoologia.local`     | `Basma2fa!24`     |

Connexion : email + mot de passe, puis code TOTP (Google Authenticator) ou code de secours.  
Identifiants détaillés (QR, codes de secours) : **ADMIN_CREDENTIALS.txt** à la racine — à supprimer après sauvegarde sécurisée.

---

## Connexion à l’app

- **Login** : http://localhost:3000/login (ou `/login?redirect=/botoadmin`)
- Identifiants complets : [docs/CREDENTIALS.md](CREDENTIALS.md)

**Seed terminé.**
