# PHASE 0 — CARTOGRAPHIE ULTRA-COMPLÈTE BoTooLogIA

> Inventaire complet du projet pour analyse qualité 90/100.  
> Généré dans le cadre de l’audit fullstack (Next.js 15, React, TypeScript strict, Prisma 7, PostgreSQL).

---

## 1. STRUCTURE GÉNÉRALE

- **Framework:** Next.js 14.2.18 (App Router)
- **React:** 18.3.1
- **TypeScript:** 5.6.3 (strict: true)
- **Prisma:** 7.4.0, client généré dans `generated/prisma`
- **Base:** PostgreSQL (Prisma + @prisma/adapter-pg)

---

## 2. PAGES (app/**/page.tsx)

| Route | Fichier |
|-------|---------|
| `/` | app/page.tsx |
| `/login` | app/(auth)/login/page.tsx |
| `/login/forgot-password` | app/(auth)/login/forgot-password/page.tsx |
| `/botohub` | app/(public)/botohub/page.tsx |
| `/botolink` | app/(public)/botolink/page.tsx |
| `/botolab` | app/(public)/botolab/page.tsx |
| `/botoadvantage` | app/(public)/botoadvantage/page.tsx |
| `/botoworks` | app/(public)/botoworks/page.tsx |
| `/agentic` | app/agentic/page.tsx |
| **Admin (BoToAdmin)** | |
| `/botoadmin` | app/(admin)/botoadmin/page.tsx |
| `/botoadmin/analytics` | app/(admin)/botoadmin/analytics/page.tsx |
| `/botoadmin/crm` | app/(admin)/botoadmin/crm/page.tsx |
| `/botoadmin/notifications` | app/(admin)/botoadmin/notifications/page.tsx |
| `/botoadmin/stats` | app/(admin)/botoadmin/stats/page.tsx |
| `/botoadmin/tables` | app/(admin)/botoadmin/tables/page.tsx |
| `/botoadmin/boss` | app/(admin)/botoadmin/boss/page.tsx |

**Total: 16 pages.**

---

## 3. LAYOUTS (app/**/layout.tsx)

| Contexte | Fichier |
|----------|---------|
| Racine | app/layout.tsx |
| Public | app/(public)/layout.tsx |
| Auth (login) | app/(auth)/layout.tsx |
| Admin (BoToAdmin) | app/(admin)/layout.tsx |
| Agentic | app/agentic/layout.tsx |
| BoToLink | app/(public)/botolink/layout.tsx |
| BoToAdvantage | app/(public)/botoadvantage/layout.tsx |
| BoToWorks | app/(public)/botoworks/layout.tsx |
| BoToLab | app/(public)/botolab/layout.tsx |

**Total: 9 layouts.**

---

## 4. ROUTES API (app/api/**/route.ts) — hors .next

| Méthode(s) | Route | Fichier |
|------------|-------|---------|
| Auth | /api/auth/login | app/api/auth/login/route.ts |
| Auth | /api/auth/logout | app/api/auth/logout/route.ts |
| Auth | /api/auth/register | app/api/auth/register/route.ts |
| Auth | /api/auth/session | app/api/auth/session/route.ts |
| Auth | /api/auth/verify-2fa | app/api/auth/verify-2fa/route.ts |
| Admin | /api/admin/audit-logs | app/api/admin/audit-logs/route.ts |
| Admin | /api/admin/contacts | app/api/admin/contacts/route.ts |
| Admin | /api/admin/contacts/[id] | app/api/admin/contacts/[id]/route.ts |
| Admin | /api/admin/stats | app/api/admin/stats/route.ts |
| Admin | /api/admin/revenue | app/api/admin/revenue/route.ts |
| Admin | /api/admin/analytics | app/api/admin/analytics/route.ts |
| Admin | /api/admin/page-views | app/api/admin/page-views/route.ts |
| Admin | /api/admin/app-settings | app/api/admin/app-settings/route.ts |
| Boss | /api/boss/dashboard | app/api/boss/dashboard/route.ts |
| Boss | /api/boss/revenue | app/api/boss/revenue/route.ts |
| Boss | /api/boss/statistics | app/api/boss/statistics/route.ts |
| Boss | /api/boss/reports/[period] | app/api/boss/reports/[period]/route.ts |
| Boss | /api/boss/export/[type] | app/api/boss/export/[type]/route.ts |
| Boss | /api/boss/users/analytics | app/api/boss/users/analytics/route.ts |
| Users | /api/users | app/api/users/route.ts |
| Users | /api/users/[id] | app/api/users/[id]/route.ts |
| Prospects | /api/prospects | app/api/prospects/route.ts |
| Prospects | /api/prospects/[id] | app/api/prospects/[id]/route.ts |
| Contact | /api/contact | app/api/contact/route.ts |
| Analytics | /api/analytics/stats | app/api/analytics/stats/route.ts |
| Analytics | /api/analytics/track | app/api/analytics/track/route.ts |
| Bot | /api/bot/chat | app/api/bot/chat/route.ts |
| Agent IA | /api/agent-ia | app/api/agent-ia/route.ts |
| Health | /api/health | app/api/health/route.ts |

**Total: 29 routes API.**

---

## 5. COMPOSANTS (components/**/*.tsx)

### 5.1 Layout & navigation
- components/layout/AdminSidebar.tsx
- components/layout/Footer.tsx
- components/layout/Header.tsx
- components/layout/Navbar.tsx
- components/layout/SectionWrapper.tsx
- components/layout/SkipLink.tsx
- components/layout/AuthNav.tsx

### 5.2 UI & cartes
- components/ui/button.tsx
- components/ui/HeroBanner.tsx
- components/ui/ServiceCard.tsx
- components/ui/CardVideoBackground.tsx
- components/cards/TabletServiceCard.tsx
- components/cards/HolographicServiceCard.tsx
- components/devis/DevisForm.tsx, FormBottomButtons.tsx, StepSummary.tsx, StepIndicator.tsx, BudgetSlider.tsx
- components/devis/ServiceCard.tsx (devis)

### 5.3 Botohub & sections
- components/botohub/WhyBoToHubSection.tsx
- components/botohub/RobotSection.tsx
- components/botohub/SectionHeader.tsx
- components/sections/ServiceTabletsSection.tsx
- components/sections/GuidingLightSection.tsx
- components/sections/BoToLinkWhyGrid.tsx
- components/sections/HeroSection.tsx
- components/sections/HeroHolographic.tsx
- components/sections/PublicCtaBlock.tsx
- components/sections/UfoCtaButton.tsx
- components/sections/Hero3DBackground.tsx

### 5.4 Effects & motion
- components/effects/AILoader.tsx, AuroraBackground.tsx, CustomCursor.tsx
- components/effects/DimensionPortalBackground.tsx, GlobalEffects.tsx
- components/effects/GlitchText.tsx, HoloCard.tsx, LightDecor.tsx
- components/effects/ParticlesBackground.tsx, PortalBackground.tsx
- components/effects/ScanLine.tsx, SplashScreen.tsx, PageTransition.tsx
- components/effects/FuturisticToast.tsx, AnimatedCounter.tsx, CtaVortex.tsx
- components/effects/useTilt.ts
- components/motion/GlitchTitle.tsx, ShimmerSpan.tsx, PortalEntrance.tsx

### 5.5 Bot & IA
- components/ai/AgentIA.tsx
- components/bot/BotWidget.tsx, ChatWindow.tsx, MessageList.tsx, MessageBubble.tsx
- components/bot/InputArea.tsx, QuickReplies.tsx, VoiceBar.tsx
- components/bot/useSpeech.ts
- components/ChatbotWidget.tsx

### 5.6 Agentic, scene, holographic
- components/agentic/* (Hero, sections, canvas, cursor, etc.)
- components/scene/SceneCanvas.tsx, HolographicSceneContent.tsx, DynamicSceneCanvas.tsx
- components/holographic/NeonGridFloor.tsx, FloatingCard3D.tsx, ScanlineBackground.tsx, HologramOrb.tsx
- components/backgrounds/LuxuryStarBackground.tsx

### 5.7 Providers & utilitaires
- components/ClientProviders.tsx
- components/providers/SessionProvider.tsx, ThemeProvider.tsx, LenisProvider.tsx
- components/ClickSoundProvider.tsx, TeleportProvider.tsx
- components/rgpd/CookieBanner.tsx
- components/portal/PublicLayoutTransition.tsx, PageTransitionWrapper.tsx
- components/reveal/RevealLoader.tsx
- components/CtaLink.tsx

**Total: ~89 fichiers TSX dans components (hors node_modules).**

---

## 6. LIB & UTILITAIRES (lib/**/*.ts) — hors node_modules

### 6.1 Auth
- lib/auth/config.ts
- lib/auth/cookie-name.ts
- lib/auth/password.ts
- lib/auth/pending-2fa.ts
- lib/auth/safe-log.ts
- lib/auth/session.ts
- lib/auth/two-factor.ts
- lib/auth/validate-secret.ts
- lib/auth/__tests__/password.test.ts

### 6.2 API & DB
- lib/api/auth-guard.ts
- lib/api/response.ts
- lib/api/with-api-error-handler.ts
- lib/api/__tests__/response.test.ts
- lib/db/audit.ts
- lib/db/contact.ts
- lib/db/prisma.ts
- lib/db/app-settings.ts
- lib/db/session-cleanup.ts

### 6.3 Validations
- lib/validations/audit.ts
- lib/validations/auth.ts
- lib/validations/common.ts
- lib/validations/contact.ts
- lib/validations/devis.ts
- lib/validations/user.ts

### 6.4 Services & data
- lib/email.ts
- lib/logger.ts
- lib/services/boss-service.ts
- lib/data/navigation.ts
- lib/data/services.ts
- lib/data/social.ts
- lib/bot/knowledgeBase.ts
- lib/bot/storage.ts
- lib/chatbot/persona.ts

### 6.5 Middleware & hooks (lib)
- lib/middleware/rate-limit.ts
- lib/useReducedMotion.ts
- lib/useClickSound.ts
- lib/utils.ts

**Total: 37 fichiers dans lib/ (hors node_modules).**

---

## 7. HOOKS PROJET (hors node_modules)

- lib/useReducedMotion.ts
- lib/useClickSound.ts
- components/bot/useSpeech.ts
- components/effects/useTilt.ts

**Pas de dossier `hooks/` dédié — hooks dispersés dans lib et components.**

---

## 8. CONFIGS

### 8.1 package.json (résumé)
- **name:** botoologia, **version:** 0.1.0
- **engines:** node >= 18.0.0
- **scripts principaux:** dev, build, start, db:push, db:seed, typecheck, lint, test
- **deps:** next 14.2.18, react 18.3.1, prisma 7.4.0, framer-motion, recharts, three, zod, bcrypt, nodemailer, etc.
- **prisma.seed:** npx tsx prisma/seed.ts

### 8.2 tsconfig.json
- strict: true, noEmit: true, module: esnext, moduleResolution: bundler
- paths: "@/*" → "./*"
- include: next-env.d.ts, **/*.ts(x), .next/types/**/*.ts

### 8.3 next.config.js
- reactStrictMode, compress, securityHeaders (CSP, HSTS, X-Frame-Options, etc.)
- typescript.ignoreBuildErrors: false, eslint.ignoreDuringBuilds: true
- images: avif/webp, experimental.optimizePackageImports (framer-motion, recharts, lucide-react)
- transpilePackages: three, postprocessing, three-stdlib, @react-three/drei, @monogrid/gainmap-js
- headers: /api/* no-store, /videos/* cache + Content-Type video/mp4
- webpack: alias drei, gainmap-stub, three-stdlib .cjs → .js

### 8.4 tailwind.config.ts
- darkMode: "class"
- content: app, components, lib
- thème: fonts (inter, space-grotesk, manrope), colors (neon, cyber, holographic, reveal, agentic, etc.)

### 8.5 prisma.config.ts
- schema: prisma/schema.prisma
- datasource.url: process.env.DATABASE_URL (chargé via dotenv)

### 8.6 middleware.ts
- Matcher: /api/:path*, /botoadmin/:path*
- /api/auth/* jamais bloqué
- Fichiers statiques + _next, /static, /videos, /images, .ico|.png|… non bloqués
- Rate limiting sur API et admin
- Protection admin: si ADMIN_PROTECTION_ENABLED ou NODE_ENV=production, redirection /login si pas de session sur /botoadmin

---

## 9. PRISMA SCHEMA (résumé)

- **User:** id, email, passwordHash, name, firstName, lastName, role (user|admin|boss), adminLevel, status, 2FA, sessions, auditLogs
- **Session:** userId, tokenHash, expiresAt
- **AuditLog:** action, resource, severity, details, userId
- **Contact:** name, email, message, status, source
- **Revenue:** amount, currency, periodType, periodValue, label
- **AppSettings:** key, value
- **Analytics:** page, event, userId, metadata
- **PageView:** page, sessionId, duration
- **Prospect:** nom, societe, email, services[], budget, status (ProspectStatus), activities
- **Activity:** prospectId, type, content (lié Prospect)

**Enums:** Role, UserStatus, AuditSeverity, ContactStatus, ProspectStatus.

---

## 10. VARIABLES D’ENVIRONNEMENT UTILISÉES

| Variable | Utilisation |
|----------|-------------|
| NODE_ENV | middleware, layout admin, prisma, session, auth-guard, logger, next.config |
| DATABASE_URL | prisma, seed, health, prisma.config, introspect |
| ADMIN_PROTECTION_ENABLED | middleware, layout (admin), auth-guard |
| NEXT_PUBLIC_APP_URL | layout, sitemap, robots, email |
| NEXTAUTH_SECRET | validate-secret |
| NEXTAUTH_URL | email (fallback) |
| JWT_SECRET | auth config, pending-2fa |
| PENDING_2FA_SECRET | pending-2fa (fallback JWT_SECRET) |
| DB_POOL_MAX | lib/db/prisma.ts |
| OPENAI_API_KEY | agent-ia |
| ANTHROPIC_API_KEY | agent-ia |
| GROQ_API_KEY | agent-ia |
| MISTRAL_API_KEY | agent-ia |
| SMTP_HOST, SMTP_PORT, SMTP_SECURE | lib/email.ts |
| SMTP_USER, SMTP_PASS | lib/email.ts, api/contact |
| SMTP_FROM | lib/email.ts |
| NEXT_PUBLIC_INSTAGRAM_URL | lib/data/social.ts |
| NEXT_PUBLIC_LINKEDIN_URL | lib/data/social.ts |
| NEXT_PUBLIC_FACEBOOK_URL | lib/data/social.ts |
| NEXT_PUBLIC_CONTACT_EMAIL | lib/data/social.ts |

**Référence complète:** .env.example (APP_NAME, PORT, POSTGRES_*, JWT_EXPIRES_IN, etc.).

---

## 11. SCRIPTS (scripts/)

- copy-card-video.ps1, copy-video-service.ps1
- db-restart-standalone-and-push.ps1, db-up-safe.ps1, demarrer-complet.ps1
- dev-clean-start.ps1, forcer-environnement.ps1, fix-path-current-session.ps1
- install-deps.ps1, clean-next.ps1, diagnose-node.ps1
- audit.js, check-db.js, verify-deps.js
- introspect-schema.ts
- Dockerfile.prisma-push, test-db-connection.mjs

---

## 12. LIAISONS PAGES ↔ COMPOSANTS / API (synthèse)

| Page | Composants / données clés | API éventuelles |
|------|---------------------------|------------------|
| / | (redir ou landing) | — |
| /botohub | HeroBanner, WhyBoToHubSection, AgentIA, ServiceTabletsSection, HoloCard | /api/agent-ia, /api/analytics/track |
| /botolink | DevisForm, BoToLinkWhyGrid, layout dédié | /api/contact |
| /botolab | ServiceCard (ui), sections | /api/prospects |
| /botoadvantage | layout + contenu public | — |
| /botoworks | layout + contenu public | — |
| /agentic | AgenticHeroSection, sections agentic | — |
| /login | AuthNav, formulaire login | /api/auth/login, verify-2fa |
| /botoadmin/* | AdminSidebar, tables, CRM, notifications, stats, boss | /api/admin/*, /api/users, /api/prospects, /api/boss/* |

---

**Fin de l’inventaire Phase 0.**  
Prochaine étape : analyse des écarts (sécurité, erreurs, perfs, responsive, données forcées en base) et plan de correction pour viser 90/100.
