import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Page « Mot de passe oublié » — placeholder.
 * À brancher sur un envoi d'email de réinitialisation (API + email service) si besoin.
 */
export default function ForgotPasswordPage() {
  return (
    <div className="login-page-root">
      <div className="login-card-wrapper">
        <div className="login-card" style={{ minHeight: "280px" }}>
          <div className="login-card__panel">
            <h1 className="login-card__title">Mot de passe oublié</h1>
            <p className="login-card__subtitle">
              Contactez l&apos;administrateur pour réinitialiser votre mot de passe, ou utilisez un code de secours si vous avez activé la 2FA.
            </p>
            <p className="login-card__footer" style={{ marginTop: "1.5rem" }}>
              <Link href="/login" className="login-card__link">
                <ArrowLeft size={14} aria-hidden />
                Retour à la connexion
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
