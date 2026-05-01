import { NextRequest } from "next/server";
import { createAuditLog } from "@/lib/db/audit";
import { createContact } from "@/lib/db/contact";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiValidationFailed422 } from "@/lib/api/response";
import { respondApiCatch } from "@/lib/db-error-handler";
import { createContactSchema } from "@/lib/validators/contact";
import { readMutationJson } from "@/lib/validators/parse-body";
import { sendEmail, emailTemplates } from "@/lib/email";
import { formatAppointmentFr } from "@/lib/format-appointment";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? null;
}

/**
 * POST /api/contact — Demande de contact (BoToLink). Sauvegarde en table Contact + AuditLog.
 * Si message est un JSON type "devis", crée un Prospect et envoie les emails (confirmation + notif admin).
 */
export async function POST(request: NextRequest) {
  const body = await readMutationJson(request);
  const parsed = createContactSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationFailed422(parsed.error.flatten());
  }

  const data = parsed.data;
  const { name, email, message: rawMessage } = data;
  const message = rawMessage.trim();
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? undefined;

  let parsedAppointment: Date | undefined;
  try {
    const j = JSON.parse(message) as { type?: string; appointmentAt?: string };
    if (j?.type === "devis" && typeof j.appointmentAt === "string") {
      const d = new Date(j.appointmentAt);
      if (!Number.isNaN(d.getTime())) parsedAppointment = d;
    }
  } catch {
    /* message non-JSON */
  }

  try {
    await createContact({
      name,
      email,
      message: message ?? "",
      source: data.source ?? "botolink",
      telephone: data.telephone,
      societe: data.societe,
      poste: data.poste,
      services: data.services ?? [],
      budget: data.budget,
      timeline: data.timeline,
      description: data.description,
      objectifs: data.objectifs,
      experience: data.experience,
      appointmentAt: parsedAppointment ?? null,
      ipAddress: ip ?? undefined,
      userAgent,
    });
    await createAuditLog({
      action: "contact.request",
      resource: "contact",
      details: { name, email, message },
      ip,
    }).catch((err) => {
      logger.warn("Audit contact.request ignoré (contact déjà enregistré)", {
        route: "POST /api/contact",
        error: err instanceof Error ? err.message : String(err),
      });
    });

    let devisData: {
      fullName?: string;
      services?: string[];
      budget?: string;
      appointmentAt?: string;
    } | null = null;
    try {
      const parsedMsg = JSON.parse(message) as {
        type?: string;
        fullName?: string;
        services?: string[];
        budget?: string;
        appointmentAt?: string;
      };
      if (parsedMsg?.type === "devis") {
        devisData = {
          fullName: parsedMsg.fullName ?? name,
          services: Array.isArray(parsedMsg.services) ? parsedMsg.services : [],
          budget: parsedMsg.budget ?? "Non précisé",
          appointmentAt: parsedMsg.appointmentAt,
        };
      }
    } catch {
      // message n'est pas du JSON devis, ignorer
    }

    const rdvLabel =
      parsedAppointment != null ? formatAppointmentFr(parsedAppointment) : null;

    try {
      await prisma.notification.create({
        data: {
          title:
            devisData && rdvLabel
              ? "Devis BoToLink + rendez-vous"
              : devisData
                ? "Nouveau devis BoToLink"
                : "Nouveau contact reçu",
          message: `${name}${data.societe ? ` (${data.societe})` : ""} — ${email}${rdvLabel ? ` — RDV : ${rdvLabel}` : ""}`,
          type: "SUCCESS",
          link: "/botoadmin/notifications",
          metadata:
            devisData && rdvLabel
              ? {
                  kind: "devis_rdv",
                  email,
                  appointmentAt: parsedAppointment!.toISOString(),
                  appointmentLabel: rdvLabel,
                }
              : undefined,
        },
      });
    } catch {
      // ignore si table absente ou erreur
    }

    if (devisData) {
      try {
        await prisma.analytics.create({
          data: { page: "/botolink", event: "devis_submitted", metadata: { email, nom: devisData.fullName } },
        });
      } catch {
        // ignore analytics
      }

      try {
        await prisma.prospect.upsert({
          where: { email },
          create: {
            nom: devisData.fullName ?? name,
            email,
            services: devisData.services ?? [],
            budget: devisData.budget ?? null,
            source: "botolink",
            status: "NOUVEAU",
            appointmentAt: parsedAppointment ?? null,
            nextFollowUp: parsedAppointment ?? null,
          },
          update: {
            services: devisData.services ?? [],
            budget: devisData.budget ?? null,
            appointmentAt: parsedAppointment ?? undefined,
            nextFollowUp: parsedAppointment ?? undefined,
            updatedAt: new Date(),
          },
        });
      } catch {
        // ignore prospect upsert
      }

      const adminEmail = process.env.SMTP_USER;
      const rdvForMail = parsedAppointment ? formatAppointmentFr(parsedAppointment) : null;
      await Promise.all([
        sendEmail({
          to: email,
          subject: "✅ Votre demande de devis BoTooLogIA",
          html: emailTemplates.confirmationDevis({
            nom: devisData.fullName ?? name,
            services: devisData.services ?? [],
            budget: devisData.budget ?? "Non précisé",
            appointmentLabel: rdvForMail,
          }),
        }),
        ...(adminEmail
          ? [
              sendEmail({
                to: adminEmail,
                subject: `🔔 Nouveau prospect : ${devisData.fullName ?? name}${rdvForMail ? ` — RDV ${rdvForMail}` : ""}`,
                html: emailTemplates.notifAdmin({
                  nom: devisData.fullName ?? name,
                  email,
                  services: devisData.services ?? [],
                  budget: devisData.budget ?? "Non précisé",
                  appointmentLabel: rdvForMail,
                }),
              }),
            ]
          : []),
      ]);
    }

    return apiSuccess({ ok: true }, 201);
  } catch (error: unknown) {
    return respondApiCatch(error, "POST /api/contact");
  }
}
