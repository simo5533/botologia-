/**
 * Module Contact — demandes de contact (table dédiée pour performance et statut).
 */

import { prisma } from "@/lib/prisma";

export type ContactStatusType = "new" | "read" | "archived";

export type CreateContactInput = {
  name: string;
  email: string;
  message: string;
  source?: string;
  telephone?: string;
  societe?: string;
  poste?: string;
  services?: string[];
  budget?: string;
  timeline?: string;
  description?: string;
  objectifs?: string;
  experience?: string;
  appointmentAt?: Date | null;
  ipAddress?: string;
  userAgent?: string;
};

export async function createContact(input: CreateContactInput): Promise<string> {
  const contact = await prisma.contact.create({
    data: {
      name: input.name,
      email: input.email,
      message: input.message,
      source: input.source ?? null,
      telephone: input.telephone ?? null,
      societe: input.societe ?? null,
      poste: input.poste ?? null,
      services: input.services ?? [],
      budget: input.budget ?? null,
      timeline: input.timeline ?? null,
      description: input.description ?? null,
      objectifs: input.objectifs ?? null,
      experience: input.experience ?? null,
      appointmentAt: input.appointmentAt ?? null,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    },
    select: { id: true },
  });
  return contact.id;
}

export async function getContactCount(where?: { status?: ContactStatusType }): Promise<number> {
  return prisma.contact.count({ where: where ?? {} });
}

export type GetContactsOptions = {
  page?: number;
  limit?: number;
  status?: ContactStatusType;
  source?: string | null;
  orderBy?: "createdAt" | "desc" | "asc";
};

export async function getContactsPaginated(options: GetContactsOptions = {}) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 20));
  const skip = (page - 1) * limit;
  const where: { status?: ContactStatusType; source?: string | null } = {};
  if (options.status) where.status = options.status;
  if (options.source !== undefined) where.source = options.source || null;
  const orderBy = { createdAt: "desc" as const };

  const [items, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        status: true,
        source: true,
        appointmentAt: true,
        createdAt: true,
      },
    }),
    prisma.contact.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function updateContactStatus(
  id: string,
  status: ContactStatusType
): Promise<boolean> {
  const result = await prisma.contact.updateMany({
    where: { id },
    data: { status: status as "new" | "read" | "archived" },
  });
  return result.count > 0;
}
