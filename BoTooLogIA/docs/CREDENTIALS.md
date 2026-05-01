# BoTooLogIA — Identifiants par rôle

**À garder confidentiel.** Ne pas commiter ce fichier en production.

---

## Comptes créés par `npm run db:seed`

| Rôle  | Email                     | Mot de passe |
|-------|---------------------------|--------------|
| Admin | `admin@botoologia.local`  | `admin123`   |
| Boss  | `boss@botoologia.local`  | `admin123`   |

Pas de 2FA : connexion en une étape (email + mot de passe).

---

## Comptes créés par `npm run db:seed:admins` (2FA)

| Rôle (niveau) | Email                         | Mot de passe      |
|----------------|-------------------------------|-------------------|
| Admin 1        | `aomarlaasri@gmail.com`       | `Aomar2fa!24`     |
| Admin 2        | `elhassane@botoologia.local`  | `Elhassane2fa!24` |
| Admin 3        | `basma@botoologia.local`      | `Basma2fa!24`     |

Connexion : 1) Email + mot de passe  2) Code TOTP (Google Authenticator) ou code de secours (affichés à l’exécution du seed et dans `ADMIN_CREDENTIALS.txt`).

---

## Récapitulatif

- **Admin / Boss** : `admin123`
- **Aomar** : `Aomar2fa!24`
- **Elhassane** : `Elhassane2fa!24`
- **Basma** : `Basma2fa!24`
