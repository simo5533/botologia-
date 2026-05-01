import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { margin:0; font-family: -apple-system, sans-serif; background:#04060f; color:#f0f4ff; }
  .container { max-width:600px; margin:0 auto; padding:40px 20px; }
  .header { text-align:center; padding:40px 0 30px; }
  .logo { font-size:28px; font-weight:900; color:#fff; }
  .logo span { color:#00c8ff; }
  .card { background:rgba(255,255,255,0.03); border:1px solid rgba(0,200,255,0.1); 
    border-radius:16px; padding:32px; margin:20px 0; }
  .btn { display:inline-block; background:linear-gradient(135deg,#00c8ff,#7b5cff); 
    color:#fff; text-decoration:none; padding:14px 32px; border-radius:50px; 
    font-weight:700; margin:20px 0; }
  .footer { text-align:center; color:rgba(255,255,255,0.2); font-size:12px; padding:20px 0; }
  h2 { color:#00c8ff; margin-top:0; }
  p { color:rgba(255,255,255,0.7); line-height:1.7; }
  .divider { height:1px; background:rgba(0,200,255,0.1); margin:20px 0; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">BoToo<span>Log</span>IA</div>
    <p style="color:rgba(255,255,255,0.3);font-size:12px;margin-top:4px;">
      Agence IA • ChatBot & Automatisation
    </p>
  </div>
  ${content}
  <div class="footer">
    <p>© ${new Date().getFullYear()} BoTooLogIA — Tous droits réservés</p>
  </div>
</div>
</body>
</html>
`;

export const emailTemplates = {
  confirmationDevis: (data: {
    nom: string;
    services: string[];
    budget: string;
    appointmentLabel?: string | null;
  }) =>
    baseTemplate(`
      <div class="card">
        <h2>✅ Demande de devis reçue !</h2>
        <p>Bonjour <strong>${data.nom}</strong>,</p>
        <p>Nous avons bien reçu votre demande de devis. 
          Notre équipe d'experts IA l'analyse et vous contacte 
          sous <strong>24h ouvrées</strong>.</p>
        <div class="divider"></div>
        <p><strong>Services demandés :</strong><br>
          ${(Array.isArray(data.services) ? data.services : []).join(", ") || "—"}</p>
        <p><strong>Budget indicatif :</strong> ${data.budget}</p>
        ${
          data.appointmentLabel
            ? `<p><strong>Créneau demandé (appel 30 min) :</strong> ${data.appointmentLabel}</p>`
            : ""
        }
        <div class="divider"></div>
        <p>En attendant, découvrez nos réalisations et cas clients :</p>
        <a href="${baseUrl}/botohub" class="btn">
          Voir nos services →
        </a>
      </div>
    `),

  notifAdmin: (data: {
    nom: string;
    email: string;
    services: string[];
    budget: string;
    appointmentLabel?: string | null;
  }) =>
    baseTemplate(`
      <div class="card">
        <h2>🔔 Nouveau prospect !</h2>
        <p><strong>${data.nom}</strong> vient de soumettre une demande de devis.</p>
        <div class="divider"></div>
        <p>📧 <strong>Email :</strong> ${data.email}</p>
        <p>🎯 <strong>Services :</strong> ${(Array.isArray(data.services) ? data.services : []).join(", ") || "—"}</p>
        <p>💰 <strong>Budget :</strong> ${data.budget}</p>
        ${
          data.appointmentLabel
            ? `<p>📅 <strong>Rendez-vous souhaité :</strong> ${data.appointmentLabel}</p>`
            : ""
        }
        <div class="divider"></div>
        <a href="${baseUrl}/botoadmin/crm" class="btn">
          Voir dans le CRM →
        </a>
      </div>
    `),

  relanceJ3: (data: { nom: string }) =>
    baseTemplate(`
      <div class="card">
        <h2>👋 On pense à vous, ${data.nom} !</h2>
        <p>Il y a 3 jours, vous avez demandé un devis chez BoTooLogIA. 
          Avez-vous des questions sur nos services IA ?</p>
        <p>Notre équipe est disponible pour un appel de 30 min sans engagement.</p>
        <a href="${baseUrl}/botolink#section-creneau" class="btn">
          Réserver un créneau →
        </a>
      </div>
    `),
};

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; error?: unknown }> {
  const from = process.env.SMTP_FROM || "BoTooLogIA <noreply@botoologia.com>";
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    return { success: false, error: "SMTP non configuré" };
  }
  try {
    await transporter.sendMail({ from, to, subject, html });
    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error };
  }
}
