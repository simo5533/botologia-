"use client";

import { Suspense, useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, UserPlus, Shield } from "lucide-react";
import { useSession } from "@/components/providers/SessionProvider";

/** Validation email côté client (format) */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(value: string): boolean {
  return value.length > 0 && EMAIL_REGEX.test(value.trim());
}

/** Rôles ayant accès à l’admin — redirection vers /botoadmin. Les autres vont sur /botohub. */
const ADMIN_ROLES = ["admin", "boss", "super_admin"];
function getRedirectAfterLogin(role: string | undefined, callbackUrl: string): string {
  const isAdmin = role && ADMIN_ROLES.includes(role.toLowerCase());
  if (isAdmin) return callbackUrl || "/botoadmin";
  return "/botohub";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, refetch } = useSession();
  const redirectTo = searchParams.get("callbackUrl") ?? searchParams.get("redirect") ?? "/botoadmin";

  const [isRegister, setIsRegister] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code2fa, setCode2fa] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  const formRef = useRef<HTMLFormElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const regRef = useRef<HTMLDivElement>(null);

  const adjustHeight = useCallback(() => {
    const form = formRef.current;
    const log = logRef.current;
    const reg = regRef.current;
    if (!form || !log || !reg) return;
    const active = isRegister ? reg : log;
    const h = active.getBoundingClientRect().height;
    form.style.height = `${Math.max(h + 80, 380)}px`;
  }, [isRegister]);

  useEffect(() => {
    const id = requestAnimationFrame(() => adjustHeight());
    const t = setTimeout(() => adjustHeight(), 150);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, [isRegister, step, adjustHeight]);

  useEffect(() => {
    const t = setTimeout(() => adjustHeight(), 50);
    return () => clearTimeout(t);
  }, [adjustHeight]);

  // Redirection côté client si déjà connecté (selon rôle : admin → botoadmin, user → botohub)
  useEffect(() => {
    if (session.status !== "authenticated") return;
    const user = "user" in session ? session.user : null;
    if (!user) return;
    const target = getRedirectAfterLogin(user.role, redirectTo);
    router.push(target);
    router.refresh();
  }, [session, redirectTo, router]);

  const handleToggle = useCallback(() => {
    setError("");
    setSuccess("");
    setFieldErrors({});
    setIsRegister((prev) => !prev);
  }, []);

  function validateLoginFields(): boolean {
    const next: Record<string, string | undefined> = {};
    if (!email.trim()) next.email = "L'email est requis.";
    else if (!isValidEmail(email)) next.email = "Format d'email invalide.";
    if (!password) next.password = "Le mot de passe est requis.";
    setFieldErrors(next);
    setError("");
    return Object.keys(next).length === 0;
  }

  async function handleSubmitLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!validateLoginFields()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Identifiants incorrects. Réessayez.");
        setFieldErrors({});
        return;
      }
      if (data?.data?.needs2FA) {
        setStep(2);
        setCode2fa("");
        setError("");
        return;
      }
      await refetch();
      const role = data?.data?.role;
      const target = getRedirectAfterLogin(role, redirectTo);
      router.push(target);
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit2FA(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code2fa.replace(/\s/g, "") }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Code incorrect.");
        return;
      }
      await refetch();
      const role = data?.data?.role;
      const target = getRedirectAfterLogin(role, redirectTo);
      router.push(target);
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  function validateRegisterFields(): boolean {
    const next: Record<string, string> = {};
    if (!regName.trim()) next.name = "Le nom est requis.";
    if (!regEmail.trim()) next.email = "L'email est requis.";
    else if (!isValidEmail(regEmail)) next.email = "Format d'email invalide.";
    if (regPassword.length < 8) next.password = "Minimum 8 caractères.";
    if (regPassword !== regConfirmPassword) next.confirmPassword = "Les mots de passe ne correspondent pas.";
    setFieldErrors(next);
    setError("");
    return Object.keys(next).length === 0;
  }

  async function handleSubmitRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!validateRegisterFields()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword,
          confirmPassword: regConfirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Inscription impossible.");
        return;
      }
      setSuccess(data?.data?.message ?? "Compte créé. Connectez-vous.");
      setEmail(regEmail.trim());
      setPassword("");
      setRegPassword("");
      setRegConfirmPassword("");
      setTimeout(() => {
        setIsRegister(false);
        setSuccess("");
      }, 2000);
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (session.status === "loading") {
    return (
      <div className="login-page-root flex min-h-screen items-center justify-center bg-transparent">
        <div className="font-mono text-cyan-400 animate-pulse">Vérification...</div>
      </div>
    );
  }

  return (
    <div className="login-page-root">
      <div className="login-card-wrapper">
        <form
          ref={formRef}
          className={`login-card ${isRegister ? "login-card--register" : ""}`}
          onSubmit={(e) => {
            if (isRegister) handleSubmitRegister(e);
            else if (step === 1) handleSubmitLogin(e);
            else handleSubmit2FA(e);
          }}
          noValidate
        >
          {/* Toggle Connexion / Inscription */}
          <button
            type="button"
            className="login-card__toggle"
            onClick={handleToggle}
            aria-label={isRegister ? "Afficher connexion" : "Afficher inscription"}
            aria-expanded={isRegister}
          >
            <span className="login-card__toggle-bar" />
            <span className="login-card__toggle-bar" />
            <span className="login-card__toggle-bar" />
          </button>

          {/* Bloc Connexion / 2FA */}
          <div
            ref={logRef}
            className={`login-card__panel ${isRegister ? "login-card__panel--hidden" : ""}`}
          >
            <div className="login-card__logo" aria-hidden>
              <Shield className="login-card__logo-icon" />
            </div>
            <h1 className="login-card__title">
              {step === 1 ? "Connexion" : "Code à usage unique"}
            </h1>
            <p className="login-card__subtitle">
              {step === 1 ? "Accédez à votre espace sécurisé" : "Saisissez le code de votre application"}
            </p>

            {error && (
              <div className="login-card__error" role="alert">
                {error}
              </div>
            )}

            {step === 1 ? (
              <>
                <div className="login-card__field">
                  <label htmlFor="login-email" className="login-card__label">Email</label>
                  <div className="login-card__input-wrap">
                    <Mail className="login-card__input-icon" aria-hidden />
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }}
                      placeholder="vous@exemple.com"
                      className={`login-card__input ${fieldErrors.email ? "login-card__input--error" : ""}`}
                    />
                  </div>
                  {fieldErrors.email && <span className="login-card__field-error">{fieldErrors.email}</span>}
                </div>

                <div className="login-card__field">
                  <label htmlFor="login-password" className="login-card__label">Mot de passe</label>
                  <div className="login-card__input-wrap">
                    <Lock className="login-card__input-icon" aria-hidden />
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })); }}
                      placeholder="••••••••"
                      className={`login-card__input login-card__input--with-btn ${fieldErrors.password ? "login-card__input--error" : ""}`}
                    />
                    <button
                      type="button"
                      className="login-card__eye"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {fieldErrors.password && <span className="login-card__field-error">{fieldErrors.password}</span>}
                  <div className="login-card__forgot-wrap">
                    <Link href="/login/forgot-password" className="login-card__forgot">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </div>

                <button type="submit" className="login-card__submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="login-card__spinner" size={20} aria-hidden />
                      Vérification…
                    </>
                  ) : (
                    "Continuer"
                  )}
                </button>
              </>
            ) : (
              <>
                <div className="login-card__field">
                  <label htmlFor="login-2fa" className="login-card__label">Code à 6 chiffres</label>
                  <input
                    id="login-2fa"
                    name="one-time-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="000000"
                    maxLength={8}
                    value={code2fa}
                    onChange={(e) => setCode2fa(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    className="login-card__input login-card__input--center"
                  />
                </div>
                <button
                  type="submit"
                  className="login-card__submit"
                  disabled={loading || code2fa.length < 6}
                >
                  {loading ? (
                    <>
                      <Loader2 className="login-card__spinner" size={20} aria-hidden />
                      Vérification…
                    </>
                  ) : (
                    "Valider"
                  )}
                </button>
                <button
                  type="button"
                  className="login-card__back"
                  onClick={() => { setStep(1); setError(""); setCode2fa(""); }}
                >
                  <ArrowLeft size={16} aria-hidden />
                  Retour à l{"'"}identifiant
                </button>
              </>
            )}

            <p className="login-card__footer">
              <Link href="/botohub" className="login-card__link">
                <ArrowLeft size={14} aria-hidden />
                Retour à l{"'"}accueil
              </Link>
            </p>
          </div>

          {/* Bloc Inscription */}
          <div
            ref={regRef}
            className={`login-card__panel login-card__panel--register ${isRegister ? "" : "login-card__panel--hidden"}`}
          >
            <div className="login-card__logo" aria-hidden>
              <UserPlus className="login-card__logo-icon" />
            </div>
            <h1 className="login-card__title">Inscription</h1>
            <p className="login-card__subtitle">Créez votre compte</p>

            {error && <div className="login-card__error" role="alert">{error}</div>}
            {success && <div className="login-card__success" role="status">{success}</div>}

            <div className="login-card__field">
              <label htmlFor="reg-name" className="login-card__label">Nom</label>
              <div className="login-card__input-wrap">
                <Mail className="login-card__input-icon" aria-hidden />
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={regName}
                  onChange={(e) => { setRegName(e.target.value); setFieldErrors((p) => ({ ...p, name: undefined })); }}
                  placeholder="Votre nom"
                  className={`login-card__input ${fieldErrors.name ? "login-card__input--error" : ""}`}
                />
              </div>
              {fieldErrors.name && <span className="login-card__field-error">{fieldErrors.name}</span>}
            </div>
            <div className="login-card__field">
              <label htmlFor="reg-email" className="login-card__label">Email</label>
              <div className="login-card__input-wrap">
                <Mail className="login-card__input-icon" aria-hidden />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={regEmail}
                  onChange={(e) => { setRegEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }}
                  placeholder="vous@exemple.com"
                  className={`login-card__input ${fieldErrors.email ? "login-card__input--error" : ""}`}
                />
              </div>
              {fieldErrors.email && <span className="login-card__field-error">{fieldErrors.email}</span>}
            </div>
            <div className="login-card__field">
              <label htmlFor="reg-password" className="login-card__label">Mot de passe (min. 8 caractères)</label>
              <div className="login-card__input-wrap">
                <Lock className="login-card__input-icon" aria-hidden />
                <input
                  id="reg-password"
                  name="new-password"
                  type={regShowPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={regPassword}
                  onChange={(e) => { setRegPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })); }}
                  placeholder="••••••••"
                  className={`login-card__input login-card__input--with-btn ${fieldErrors.password ? "login-card__input--error" : ""}`}
                />
                <button
                  type="button"
                  className="login-card__eye"
                  onClick={() => setRegShowPassword((p) => !p)}
                  aria-label={regShowPassword ? "Masquer" : "Afficher"}
                  tabIndex={-1}
                >
                  {regShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && <span className="login-card__field-error">{fieldErrors.password}</span>}
            </div>
            <div className="login-card__field">
              <label htmlFor="reg-confirm" className="login-card__label">Confirmer le mot de passe</label>
              <div className="login-card__input-wrap">
                <Lock className="login-card__input-icon" aria-hidden />
                <input
                  id="reg-confirm"
                  name="confirm-new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={regConfirmPassword}
                  onChange={(e) => { setRegConfirmPassword(e.target.value); setFieldErrors((p) => ({ ...p, confirmPassword: undefined })); }}
                  placeholder="••••••••"
                  className={`login-card__input ${fieldErrors.confirmPassword ? "login-card__input--error" : ""}`}
                />
              </div>
              {fieldErrors.confirmPassword && <span className="login-card__field-error">{fieldErrors.confirmPassword}</span>}
            </div>
            <button type="submit" className="login-card__submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="login-card__spinner" size={20} aria-hidden />
                  Création…
                </>
              ) : (
                <>S{"'"}inscrire</>
              )}
            </button>
            <p className="login-card__footer">
              <Link href="/botohub" className="login-card__link">
                <ArrowLeft size={14} aria-hidden />
                Retour à l{"'"}accueil
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="login-page-root flex min-h-screen items-center justify-center bg-transparent text-slate-300">
          Chargement…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
