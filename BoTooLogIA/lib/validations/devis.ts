import { z } from "zod";

const jobTitles = ["CEO", "CMO", "Directeur Marketing", "Chef de projet", "Autre"] as const;
const timelines = ["urgent", "short", "medium", "long", "defined"] as const;
const frequencies = ["unique", "monthly", "quarterly", "annual"] as const;
const objectives = ["time", "costs", "sales", "quality", "differentiate", "all"] as const;

export const devisStep1Schema = z.object({
  fullName: z.string().min(2, "Nom requis (2 caractères min)").max(120),
  company: z.string().min(1, "Société requise").max(200),
  email: z.string().email("Email professionnel invalide"),
  phone: z.string().min(8, "Téléphone requis").max(30),
  jobTitle: z.enum(jobTitles, { required_error: "Sélectionnez un poste" }),
});

export const devisStep2Schema = z.object({
  services: z.array(z.string()).min(1, "Sélectionnez au moins un service"),
});

export const devisStep3Schema = z.object({
  /** Plus collecté en UI ; conservé pour rétrocompatibilité JSON / BDD */
  budget: z.string().max(100).optional(),
  timeline: z.enum(timelines, { required_error: "Sélectionnez un délai" }),
  /** Non affiché à l’étape 3 : valeur par défaut côté formulaire (« unique ») */
  frequency: z.enum(frequencies, { required_error: "Fréquence requise" }),
  /** Champ libre facultatif (contraintes, disponibilités, etc.) */
  delaisNotes: z.string().max(2000).optional(),
});

export const devisStep4Schema = z.object({
  projectDescription: z.string().min(10, "Décrivez votre projet (10 caractères min)").max(5000),
  usedAiTools: z.boolean(),
  aiToolsList: z.string().max(500).optional(),
  mainObjective: z.enum(objectives, { required_error: "Sélectionnez un objectif" }),
  howHeard: z.string().min(1, "Ce champ est requis").max(200),
  attachmentName: z.string().optional(),
});

/** Créneau pour l’appel découverte 30 min (saisi à l’étape finale) */
export const devisAppointmentSchema = z.object({
  appointmentAt: z
    .string()
    .min(1, "Sélectionnez une date et une heure pour l’appel de 30 min.")
    .refine((s) => !Number.isNaN(new Date(s).getTime()), "Date ou heure invalide.")
    .refine((s) => new Date(s).getTime() >= Date.now() - 120_000, "Choisissez un créneau dans le futur (proche)."),
});

export const devisFullSchema = devisStep1Schema
  .merge(devisStep2Schema)
  .merge(devisStep3Schema)
  .merge(devisStep4Schema)
  .merge(devisAppointmentSchema);

export type DevisFormValues = z.infer<typeof devisFullSchema>;

export const JOB_TITLE_OPTIONS = jobTitles;
export const TIMELINE_OPTIONS = timelines;
export const FREQUENCY_OPTIONS = frequencies;
export const OBJECTIVE_OPTIONS = objectives;
