# Structure du projet BoTooLogIA

Document généré pour l'audit complet. Projet monorepo **Next.js 14** (App Router) + **Prisma 7** + **PostgreSQL**.

---

## Arborescence (fichiers sources, hors node_modules / .next / generated)

```
BoTooLogIA/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Layout racine (fonts, ClientProviders)
│   ├── page.tsx                  # Page d'accueil
│   ├── globals.css               # Styles globaux, design system
│   ├── (admin)/                  # Groupe : zone admin
│   │   ├── layout.tsx            # Layout admin (sidebar)
│   │   └── botoadmin/
│   │       ├── page.tsx          # Dashboard admin
│   │       ├── stats/page.tsx
│   │       ├── tables/page.tsx
│   │       └── boss/page.tsx     # Dashboard BOSS
│   ├── (auth)/                   # Groupe : authentification
│   │   ├── layout.tsx
│   │   └── login/page.tsx        # Page login (2FA possible)
│   ├── (public)/                 # Groupe : pages publiques
│   │   ├── layout.tsx            # Header, Footer, fond étoilé
│   │   ├── botohub/page.tsx
│   │   ├── botolab/page.tsx
│   │   ├── botoworks/page.tsx
│   │   ├── botolink/page.tsx
│   │   └── botoadvantage/page.tsx
│   ├── agentic/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── api/                      # Routes API
│       ├── health/route.ts
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   ├── session/route.ts
│       │   └── verify-2fa/route.ts
│       ├── contact/route.ts
│       ├── bot/chat/route.ts     # Bot guide (base de connaissances)
│       ├── users/route.ts, users/[id]/route.ts
│       ├── admin/
│       │   ├── stats/route.ts
│       │   ├── audit-logs/route.ts
│       │   └── contacts/route.ts
│       └── boss/
│           ├── dashboard/route.ts
│           ├── statistics/route.ts
│           ├── revenue/route.ts
│           ├── users/analytics/route.ts
│           ├── reports/[period]/route.ts
│           └── export/[type]/route.ts
│
├── components/
│   ├── ChatbotWidget.tsx         # Point d'entrée widget bot (réexport)
│   ├── ClientProviders.tsx      # Providers globaux + chargement bot
│   ├── CtaLink.tsx
│   ├── bot/                      # Bot guide vocal/texte
│   │   ├── BotWidget.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── MessageList.tsx, MessageBubble.tsx
│   │   ├── InputArea.tsx, QuickReplies.tsx
│   │   ├── VoiceBar.tsx
│   │   ├── useSpeech.ts
│   │   ├── constants.ts
│   │   └── index.ts
│   ├── layout/
│   │   ├── Header.tsx, Footer.tsx, Navbar.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── SectionWrapper.tsx
│   │   ├── SkipLink.tsx
│   │   └── AuthNav.tsx
│   ├── ui/                       # Composants UI (Radix, CVA)
│   │   └── button.tsx
│   ├── sections/, cards/, backgrounds/
│   ├── effects/, motion/, portal/, reveal/
│   ├── agentic/
│   ├── botohub/
│   └── providers/
│
├── lib/
│   ├── api/
│   │   ├── auth-guard.ts         # requireAdminSession, requireBossSession, requireStrictAdminSession
│   │   ├── response.ts           # apiSuccess, apiError, apiUnauthorized...
│   │   └── with-api-error-handler.ts
│   ├── auth/
│   │   ├── password.ts           # scrypt hash/verify
│   │   ├── session.ts            # cookie session, create/get/delete
│   │   ├── pending-2fa.ts        # Token signé étape 2 login
│   │   ├── two-factor.ts         # TOTP, backup codes
│   │   └── config.ts
│   ├── bot/
│   │   ├── knowledgeBase.ts      # Réponses instantanées (FAQ BOTOOLOGIA)
│   │   └── storage.ts           # localStorage messages + prefs
│   ├── db/
│   │   ├── prisma.ts             # Instance PrismaClient (adapter pg)
│   │   ├── audit.ts              # createAuditLog
│   │   ├── contact.ts
│   │   └── session-cleanup.ts
│   ├── validations/
│   │   ├── auth.ts, user.ts, contact.ts, audit.ts, common.ts
│   ├── data/                     # Données statiques (navigation, services, social)
│   ├── services/                 # boss-service
│   ├── middleware/               # rate-limit
│   ├── chatbot/persona.ts
│   ├── logger.ts
│   ├── utils.ts
│   ├── useReducedMotion.ts
│   └── useClickSound.ts
│
├── prisma/
│   ├── schema.prisma             # Modèles User, Session, AuditLog, Contact, Revenue
│   ├── seed.ts                   # Seed admin + boss + audit
│   ├── seed-admins-2fa.ts        # 3 admins (Aomar, Elhassane, Basma) + 2FA
│   └── migrations/               # (si migrations appliquées)
│
├── scripts/
│   ├── check-db.js
│   ├── verify-deps.js
│   ├── db-up-safe.ps1
│   ├── dev-clean-start.ps1
│   ├── install-deps.ps1
│   ├── forcer-environnement.ps1
│   ├── fix-path-current-session.ps1
│   └── diagnose-node.ps1
│
├── types/
│   └── speech.d.ts               # Web Speech API (STT)
│
├── docs/
│   ├── API.md
│   ├── PRISMA_SETUP.md
│   ├── BOT_GUIDE.md
│   ├── ANALYSE_ADMIN_SECURISE.md
│   ├── PROJECT_STRUCTURE.md      # Ce fichier
│   ├── DEMARRAGE.md              # Documentation démarrage par rôle
│   └── ... (autres analyses)
│
├── .vscode/
│   └── settings.json             # Prisma 7, lint CSS/SCSS
│
├── package.json
├── tsconfig.json
├── next.config.ts (ou .js)
├── postcss.config.mjs
├── tailwind.config.ts
├── prisma.config.ts              # Prisma 7 : URL BDD (env DATABASE_URL)
├── .env.example
├── .gitignore
├── PRISMA_SETUP.md               # Config Prisma 7 (racine)
└── README.md (si présent)
```

---

## Fichiers de configuration

| Fichier | Rôle |
|---------|------|
| `package.json` | Dépendances, scripts (dev, build, db:*, lint, typecheck) |
| `tsconfig.json` | TypeScript, paths `@/*` |
| `prisma.config.ts` | Prisma 7 : schema, migrations, datasource.url |
| `prisma/schema.prisma` | Modèles, enums (pas d'url en Prisma 7) |
| `.env` | DATABASE_URL, JWT_SECRET, ADMIN_PROTECTION_ENABLED, etc. |
| `.env.example` | Modèle des variables |
| `.vscode/settings.json` | prisma.pinToPrisma6: false, lint |

---

## Scripts npm principaux

| Script | Commande | Description |
|--------|----------|-------------|
| `dev` | next dev | Serveur de développement |
| `build` | prisma generate && next build | Build production |
| `start` | next start | Démarrer en production |
| `lint` | next lint | ESLint |
| `typecheck` | tsc --noEmit | Vérification TypeScript |
| `db:generate` | prisma generate | Générer le client Prisma |
| `db:push` | prisma db push | Appliquer le schéma à la BDD |
| `db:migrate` | prisma migrate dev | Migrations |
| `db:seed` | npx tsx prisma/seed.ts | Seed admin/boss |
| `db:seed:admins` | npx tsx prisma/seed-admins-2fa.ts | Seed 3 admins 2FA |
| `db:up` | docker compose up -d | Démarrer PostgreSQL (Docker) |
| `db:down` | docker compose down | Arrêter Docker |
| `verify-deps` | node scripts/verify-deps.js | Vérifier dépendances |

---

## Liaisons clés

- **Auth** : `lib/auth/*` → `app/api/auth/*` → `(auth)/login` ; garde `lib/api/auth-guard.ts` utilisée par les routes admin/boss.
- **Prisma** : `lib/db/prisma.ts` utilise `@/generated/prisma` (généré par `prisma generate`).
- **Bot** : `components/bot/*` + `lib/bot/*` → `app/api/bot/chat` ; widget chargé dans `ClientProviders`.
- **Admin** : layout `(admin)/layout.tsx` + `AdminSidebar` ; routes API sous `/api/admin/*` et `/api/users/*` protégées par `requireAdminSession`.

---

## Dépendances principales (package.json)

- **Next.js** 14.2.18, **React** 18.3.1
- **Prisma** 7.4.0, **@prisma/client** 7.4.0, **@prisma/adapter-pg** 7.4.0
- **Zod** (validations), **framer-motion**, **lucide-react**
- **speakeasy**, **qrcode** (2FA), **recharts** (dashboard)
- **three**, **@react-three/fiber**, **@react-three/drei** (scènes 3D)

Voir `npm list` et `npm audit` pour versions détaillées et vulnérabilités.

---

## État des vérifications (audit)

| Vérification | Résultat |
|--------------|----------|
| `npm run typecheck` | OK |
| `npx prisma validate` | OK (référence Prisma 7) |
| `npm run lint` | Peut échouer si `aria-query` (rolesMap) manquant dans node_modules ; réinstall complète ou mise à jour eslint-config-next peut corriger. |
| `npm run build` | À lancer après `prisma generate` ; dépend de la BDD pour les routes qui l’utilisent. |

Pour un audit des vulnérabilités : `npm audit` (à exécuter manuellement).
