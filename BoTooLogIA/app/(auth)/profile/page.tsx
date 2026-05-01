"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, User, Lock, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(value: string): boolean {
  return value.length > 0 && EMAIL_REGEX.test(value.trim());
}

type ProfileUser = {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/profile", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const user = data?.data ?? null;
        if (!user) {
          router.replace("/login?redirect=/profile");
          return;
        }
        setProfile(user);
        setName(user.name ?? "");
        setEmail(user.email ?? "");
      })
      .catch(() => router.replace("/login?redirect=/profile"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSubmitProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    if (!profile) return;
    const nameTrim = name.trim();
    const emailTrim = email.trim().toLowerCase();
    if (!nameTrim) {
      setProfileError("Le nom est requis.");
      return;
    }
    if (!emailTrim || !isValidEmail(emailTrim)) {
      setProfileError("Email invalide.");
      return;
    }
    setProfileSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: nameTrim, email: emailTrim }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileError(data?.error ?? "Erreur lors de la mise à jour.");
        return;
      }
      setProfileSuccess("Profil enregistré.");
      if (data?.data) setProfile(data.data);
      setTimeout(() => setProfileSuccess(""), 3000);
    } catch {
      setProfileError("Erreur réseau.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleSubmitPassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");
    if (newPassword.length < 8) {
      setPwdError("Le nouveau mot de passe doit faire au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("Les mots de passe ne correspondent pas.");
      return;
    }
    setPwdSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmNewPassword: confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwdError(data?.error ?? "Erreur lors du changement.");
        return;
      }
      setPwdSuccess("Mot de passe mis à jour.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwdSuccess(""), 3000);
    } catch {
      setPwdError("Erreur réseau.");
    } finally {
      setPwdSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="login-page-root flex min-h-screen items-center justify-center bg-theme-page">
        <div className="font-mono text-cyan-400 animate-pulse flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          Chargement…
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="login-page-root min-h-screen py-12 px-4">
      <div className="mx-auto max-w-md">
        <div className="login-card rounded-2xl border border-[#00d4ff]/20 bg-[#0A0A0A]/95 p-6 shadow-xl">
          <div className="login-card__logo mb-4 flex justify-center" aria-hidden>
            <User className="login-card__logo-icon h-12 w-12 text-[#00d4ff]" />
          </div>
          <h1 className="login-card__title text-center">Mon profil</h1>
          <p className="login-card__subtitle text-center mb-6">
            Modifiez vos informations personnelles
          </p>

          {/* Formulaire infos */}
          <form onSubmit={handleSubmitProfile} className="space-y-4 mb-8">
            {profileError && (
              <div className="login-card__error" role="alert">{profileError}</div>
            )}
            {profileSuccess && (
              <div className="login-card__success" role="status">{profileSuccess}</div>
            )}
            <div className="login-card__field">
              <label htmlFor="profile-name" className="login-card__label">Nom</label>
              <div className="login-card__input-wrap">
                <User className="login-card__input-icon" aria-hidden />
                <input
                  id="profile-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  className="login-card__input"
                />
              </div>
            </div>
            <div className="login-card__field">
              <label htmlFor="profile-email" className="login-card__label">Email</label>
              <div className="login-card__input-wrap">
                <Mail className="login-card__input-icon" aria-hidden />
                <input
                  id="profile-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="login-card__input"
                />
              </div>
            </div>
            <button
              type="submit"
              className="login-card__submit w-full"
              disabled={profileSaving}
            >
              {profileSaving ? (
                <>
                  <Loader2 className="login-card__spinner inline-block mr-2" size={18} />
                  Enregistrement…
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </button>
          </form>

          {/* Changement mot de passe */}
          <div className="border-t border-white/10 pt-6">
            <h2 className="login-card__subtitle text-sm font-semibold text-slate-300 mb-4">
              Changer le mot de passe
            </h2>
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              {pwdError && (
                <div className="login-card__error" role="alert">{pwdError}</div>
              )}
              {pwdSuccess && (
                <div className="login-card__success" role="status">{pwdSuccess}</div>
              )}
              <div className="login-card__field">
                <label htmlFor="current-pwd" className="login-card__label">Mot de passe actuel</label>
                <div className="login-card__input-wrap">
                  <Lock className="login-card__input-icon" aria-hidden />
                  <input
                    id="current-pwd"
                    name="current-password"
                    type={showPasswords ? "text" : "password"}
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="login-card__input login-card__input--with-btn"
                  />
                  <button
                    type="button"
                    className="login-card__eye"
                    onClick={() => setShowPasswords((p) => !p)}
                    aria-label={showPasswords ? "Masquer" : "Afficher"}
                    tabIndex={-1}
                  >
                    {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="login-card__field">
                <label htmlFor="new-pwd" className="login-card__label">Nouveau mot de passe (min. 8 caractères)</label>
                <div className="login-card__input-wrap">
                  <Lock className="login-card__input-icon" aria-hidden />
                  <input
                    id="new-pwd"
                    name="new-password"
                    type={showPasswords ? "text" : "password"}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="login-card__input"
                  />
                </div>
              </div>
              <div className="login-card__field">
                <label htmlFor="confirm-pwd" className="login-card__label">Confirmer le nouveau mot de passe</label>
                <div className="login-card__input-wrap">
                  <Lock className="login-card__input-icon" aria-hidden />
                  <input
                    id="confirm-pwd"
                    name="confirm-new-password"
                    type={showPasswords ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="login-card__input"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="login-card__submit w-full"
                disabled={pwdSaving || !currentPassword || newPassword.length < 8 || newPassword !== confirmPassword}
              >
                {pwdSaving ? (
                  <>
                    <Loader2 className="login-card__spinner inline-block mr-2" size={18} />
                    Mise à jour…
                  </>
                ) : (
                  "Changer le mot de passe"
                )}
              </button>
            </form>
          </div>

          <p className="login-card__footer mt-6">
            <Link href="/botohub" className="login-card__link">
              <ArrowLeft size={14} aria-hidden />
              Retour à l&apos;accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
