"use client";

import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, Calendar, Loader2, Sparkles } from "lucide-react";
import { isExternalCreneauLink, resolveCreneauHref } from "@/lib/booking";
import { formatAppointmentFr } from "@/lib/format-appointment";
import { devisFullSchema, type DevisFormValues } from "@/lib/validations/devis";
import { StepIndicator } from "./StepIndicator";
import { ServiceCard, SERVICE_OPTIONS } from "./ServiceCard";
import { StepSummary, type DevisFormData } from "./StepSummary";
import { FormBottomButtons } from "./FormBottomButtons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const JOB_TITLES = ["CEO", "CMO", "Directeur Marketing", "Chef de projet", "Autre"] as const;
const TIMELINES = [
  { value: "urgent", label: "Urgent (< 2 semaines)" },
  { value: "short", label: "Court terme (1 mois)" },
  { value: "medium", label: "Moyen terme (3 mois)" },
  { value: "long", label: "Long terme (6 mois+)" },
  { value: "defined", label: "À définir ensemble" },
] as const;
const OBJECTIVES = [
  { value: "time", label: "Gagner du temps" },
  { value: "costs", label: "Réduire les coûts" },
  { value: "sales", label: "Augmenter les ventes" },
  { value: "quality", label: "Améliorer la qualité" },
  { value: "differentiate", label: "Se différencier de la concurrence" },
  { value: "all", label: "Tout à la fois" },
] as const;
const HOW_HEARD = [
  "Recherche Google",
  "Réseaux sociaux",
  "Recommandation",
  "Salon / Événement",
  "Newsletter",
  "Autre",
] as const;

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function DevisForm() {
  const [step, setStep] = useState(1);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.35;

  const minAppointmentLocal = useMemo(() => {
    const t = new Date(Date.now() + 60 * 60 * 1000);
    const p = (n: number) => String(n).padStart(2, "0");
    return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}T${p(t.getHours())}:${p(t.getMinutes())}`;
  }, []);

  const form = useForm<DevisFormValues>({
    resolver: zodResolver(devisFullSchema),
    defaultValues: {
      fullName: "",
      company: "",
      email: "",
      phone: "",
      jobTitle: "Autre",
      services: [],
      budget: "",
      timeline: "medium",
      frequency: "unique",
      delaisNotes: "",
      projectDescription: "",
      usedAiTools: false,
      aiToolsList: "",
      mainObjective: "time",
      howHeard: "",
      appointmentAt: "",
    },
    mode: "onChange",
  });

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = form;
  const watched = watch();

  const step1Valid = useCallback(async () => {
    return trigger(["fullName", "company", "email", "phone", "jobTitle"]);
  }, [trigger]);
  const step2Valid = () => (watched.services?.length ?? 0) >= 1;
  const step3Valid = useCallback(async () => {
    return trigger(["timeline"]);
  }, [trigger]);
  const step4Valid = useCallback(async () => {
    return trigger(["projectDescription", "mainObjective", "howHeard"]);
  }, [trigger]);

  const goNext = async () => {
    if (step === 1) {
      const ok = await step1Valid();
      if (ok) setStep(2);
    } else if (step === 2) {
      if (step2Valid()) setStep(3);
    } else if (step === 3) {
      const ok = await step3Valid();
      if (ok) setStep(4);
    } else if (step === 4) {
      const ok = await step4Valid();
      if (ok) setStep(5);
    }
  };

  const goPrev = () => {
    if (step === 5) setStep(4);
    else if (step > 1) setStep(step - 1);
  };

  const stepCompletion = step === 1
    ? [watched.fullName, watched.company, watched.email, watched.phone, watched.jobTitle].filter(Boolean).length / 5
    : step === 2
      ? Math.min(1, (watched.services?.length ?? 0) / 1)
      : step === 3
        ? (watched.timeline ? 1 : 0)
        : step === 4
          ? [watched.projectDescription, watched.mainObjective, watched.howHeard].filter(Boolean).length / 3
          : step === 5
            ? watched.appointmentAt
              ? 1
              : 0.4
            : 1;

  const onFinalSubmit = async (data: DevisFormValues) => {
    setSubmitStatus("loading");
    setSubmitError(null);
    try {
      const message = JSON.stringify({
        type: "devis",
        ...data,
      }, null, 0);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          message,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
        setSubmitError(json.error || "Erreur lors de l'envoi.");
      }
    } catch {
      setSubmitStatus("error");
      setSubmitError("Erreur réseau. Réessayez.");
    }
  };

  if (submitStatus === "success") {
    const reduce = reduceMotion;
    return (
      <motion.div
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.45 }}
        className="relative overflow-hidden rounded-2xl border border-holographic-cyan/35 bg-slate-800/70 backdrop-blur-xl p-8 text-center shadow-[0_0_40px_rgba(0,200,255,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,200,255,0.18),transparent_55%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.85, 0.5] }}
            transition={{ duration: 1.8, times: [0, 0.5, 1] }}
          />
        )}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          {!reduce && (
            <>
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-holographic-cyan/40"
                initial={{ scale: 0.85, opacity: 0.6 }}
                animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                transition={{ duration: 1.2, repeat: 2, ease: "easeOut" }}
              />
              <motion.span
                className="absolute inset-0 rounded-full border border-cyan-400/30"
                initial={{ scale: 0.9, opacity: 0.4 }}
                animate={{ scale: [1, 1.5], opacity: [0.35, 0] }}
                transition={{ duration: 1.4, repeat: 2, ease: "easeOut", delay: 0.2 }}
              />
            </>
          )}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: reduce ? 0 : 0.1 }}
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-holographic-cyan/30 to-cyan-600/20 ring-2 ring-holographic-cyan/50"
          >
            <CheckCircle2 className="h-9 w-9 text-holographic-cyan drop-shadow-[0_0_12px_rgba(0,200,255,0.6)]" aria-hidden />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.25 }}
          className="relative space-y-3"
        >
          <p className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-holographic-cyan/90">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Enregistré
          </p>
          <h3 className="font-heading text-xl font-bold text-white md:text-2xl">
            Votre devis et votre rendez-vous sont bien envoyés
          </h3>
          <p className="mx-auto max-w-lg text-slate-300 leading-relaxed">
            Merci <strong className="text-white">{watched.fullName}</strong>. Notre équipe a reçu votre demande complète
            {watched.appointmentAt ? " ainsi que votre créneau pour l&apos;appel découverte" : ""}.
            Vous recevrez une confirmation par e-mail si votre boîte est joignable.
          </p>
          {watched.appointmentAt ? (
            <div className="mx-auto mt-4 max-w-md rounded-xl border border-holographic-cyan/25 bg-holographic-cyan/5 px-4 py-3 text-sm text-slate-200">
              <span className="font-medium text-holographic-cyan">Créneau choisi :</span>{" "}
              {formatAppointmentFr(watched.appointmentAt)}
            </div>
          ) : null}
        </motion.div>
        {isExternalCreneauLink() ? (
          <Button asChild className="relative mt-8" size="lg" variant="outline">
            <a href={resolveCreneauHref()} target="_blank" rel="noopener noreferrer">
              <Calendar className="mr-2 h-4 w-4" aria-hidden />
              Agenda en ligne (optionnel)
            </a>
          </Button>
        ) : null}
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/20 bg-slate-800/60 backdrop-blur-xl p-6 md:p-8">
      <StepIndicator currentStep={step} className="mb-8" />

      <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration }}
              className="space-y-4"
            >
              <p className="text-sm text-slate-400">Complétion : {Math.round(stepCompletion * 100)}%</p>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-1">Nom complet</label>
                <input
                  id="fullName"
                  {...register("fullName")}
                  className={cn(
                    "w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-holographic-cyan focus:ring-1 focus:ring-holographic-cyan focus:outline-none",
                    errors.fullName ? "border-red-500/50" : "border-white/15"
                  )}
                  placeholder="Jean Dupont"
                  autoComplete="name"
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-400" role="alert">{errors.fullName.message}</p>}
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-1">Société / Organisation</label>
                <input
                  id="company"
                  {...register("company")}
                  className={cn(
                    "w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-holographic-cyan focus:ring-1 focus:ring-holographic-cyan focus:outline-none",
                    errors.company ? "border-red-500/50" : "border-white/15"
                  )}
                  placeholder="Acme Inc."
                />
                {errors.company && <p className="mt-1 text-sm text-red-400" role="alert">{errors.company.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email professionnel</label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={cn(
                    "w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-holographic-cyan focus:ring-1 focus:ring-holographic-cyan focus:outline-none",
                    errors.email ? "border-red-500/50" : "border-white/15"
                  )}
                  placeholder="jean.dupont@entreprise.com"
                  autoComplete="email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-400" role="alert">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Téléphone</label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className={cn(
                    "w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-holographic-cyan focus:ring-1 focus:ring-holographic-cyan focus:outline-none",
                    errors.phone ? "border-red-500/50" : "border-white/15"
                  )}
                  placeholder="+33 6 12 34 56 78"
                  autoComplete="tel"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-400" role="alert">{errors.phone.message}</p>}
              </div>
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-300 mb-1">Poste occupé</label>
                <select
                  id="jobTitle"
                  {...register("jobTitle")}
                  className={cn(
                    "w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white focus:border-holographic-cyan focus:ring-1 focus:ring-holographic-cyan focus:outline-none",
                    errors.jobTitle ? "border-red-500/50" : "border-white/15"
                  )}
                >
                  {JOB_TITLES.map((t) => (
                    <option key={t} value={t} className="bg-slate-800 text-white">{t}</option>
                  ))}
                </select>
                {errors.jobTitle && <p className="mt-1 text-sm text-red-400" role="alert">{errors.jobTitle.message}</p>}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration }}
              className="space-y-4"
            >
              <p className="text-sm text-slate-400">Sélection multiple. Complétion : {Math.min(100, (watched.services?.length ?? 0) * 12)}%</p>
              <div className="grid gap-3 sm:grid-cols-1">
                {SERVICE_OPTIONS.map((opt, i) => (
                  <ServiceCard
                    key={opt.id}
                    option={opt}
                    index={i}
                    selected={(watched.services ?? []).includes(opt.id)}
                    onToggle={() => {
                      const current = watched.services ?? [];
                      const next = current.includes(opt.id) ? current.filter((s) => s !== opt.id) : [...current, opt.id];
                      setValue("services", next, { shouldValidate: true });
                    }}
                  />
                ))}
              </div>
              {!step2Valid() && <p className="text-sm text-amber-400">Sélectionnez au moins un service.</p>}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-slate-300 mb-1">Délai souhaité</label>
                <select
                  id="timeline"
                  {...register("timeline")}
                  className={cn(
                    "w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white focus:border-holographic-cyan focus:ring-1 focus:ring-holographic-cyan focus:outline-none",
                    errors.timeline ? "border-red-500/50" : "border-white/15"
                  )}
                >
                  {TIMELINES.map((t) => (
                    <option key={t.value} value={t.value} className="bg-slate-800">{t.label}</option>
                  ))}
                </select>
                {errors.timeline && <p className="mt-1 text-sm text-red-400" role="alert">{errors.timeline.message}</p>}
              </div>
              <div>
                <label htmlFor="delaisNotes" className="block text-sm font-medium text-slate-300 mb-1">
                  Précisions (facultatif)
                </label>
                <textarea
                  id="delaisNotes"
                  {...register("delaisNotes")}
                  rows={3}
                  maxLength={2000}
                  placeholder="Contraintes de calendrier, disponibilités, précisions sur le budget ou la durée…"
                  className={cn(
                    "w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-holographic-cyan focus:ring-1 focus:ring-holographic-cyan focus:outline-none resize-y",
                    errors.delaisNotes ? "border-red-500/50" : "border-white/15"
                  )}
                />
                {errors.delaisNotes && <p className="mt-1 text-sm text-red-400" role="alert">{errors.delaisNotes.message}</p>}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration }}
              className="space-y-4"
            >
              <p className="text-sm text-slate-400">Complétion : {Math.round(stepCompletion * 100)}%</p>
              <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-slate-300 mb-1">Description du projet</label>
                <textarea
                  id="projectDescription"
                  {...register("projectDescription")}
                  rows={5}
                  className={cn(
                    "w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-holographic-cyan focus:ring-1 focus:ring-holographic-cyan focus:outline-none resize-y",
                    errors.projectDescription ? "border-red-500/50" : "border-white/15"
                  )}
                  placeholder="Décrivez votre projet, vos objectifs et vos contraintes. Plus nous en savons, plus notre proposition sera pertinente."
                />
                {errors.projectDescription && <p className="mt-1 text-sm text-red-400" role="alert">{errors.projectDescription.message}</p>}
              </div>
              <div>
                <label htmlFor="usedAiTools" className="flex cursor-pointer items-center gap-2">
                  <input
                    id="usedAiTools"
                    type="checkbox"
                    {...register("usedAiTools")}
                    className="h-4 w-4 rounded border-white/30 bg-white/5 text-holographic-cyan focus:ring-holographic-cyan"
                  />
                  <span className="text-sm text-slate-300">J&apos;ai déjà utilisé des outils IA</span>
                </label>
              </div>
              {(watched.usedAiTools === true || String(watched.usedAiTools) === "true") && (
                <div>
                  <label htmlFor="aiToolsList" className="block text-sm font-medium text-slate-300 mb-1">Lesquels ?</label>
                  <input
                    id="aiToolsList"
                    {...register("aiToolsList")}
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-holographic-cyan focus:ring-1 focus:ring-holographic-cyan focus:outline-none"
                    placeholder="ChatGPT, Midjourney, Copilot..."
                  />
                </div>
              )}
              <div>
                <label htmlFor="mainObjective" className="block text-sm font-medium text-slate-300 mb-1">Objectif principal</label>
                <select
                  id="mainObjective"
                  {...register("mainObjective")}
                  className={cn(
                    "w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white focus:border-holographic-cyan focus:ring-1 focus:ring-holographic-cyan focus:outline-none",
                    errors.mainObjective ? "border-red-500/50" : "border-white/15"
                  )}
                >
                  {OBJECTIVES.map((o) => (
                    <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="howHeard" className="block text-sm font-medium text-slate-300 mb-1">Comment avez-vous entendu parler de nous ?</label>
                <select
                  id="howHeard"
                  {...register("howHeard")}
                  className={cn(
                    "w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white focus:border-holographic-cyan focus:ring-1 focus:ring-holographic-cyan focus:outline-none",
                    errors.howHeard ? "border-red-500/50" : "border-white/15"
                  )}
                >
                  <option value="" className="bg-slate-800">— Choisir —</option>
                  {HOW_HEARD.map((h) => (
                    <option key={h} value={h} className="bg-slate-800">{h}</option>
                  ))}
                </select>
                {errors.howHeard && <p className="mt-1 text-sm text-red-400" role="alert">{errors.howHeard.message}</p>}
              </div>
              <div>
                <label htmlFor="devis-attachment" className="block text-sm font-medium text-slate-300 mb-1">Pièce jointe / brief (optionnel)</label>
                <input
                  id="devis-attachment"
                  name="attachment"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  aria-label="Joindre un fichier PDF, Word ou texte"
                  className="w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-holographic-cyan/20 file:px-4 file:py-2 file:text-holographic-cyan"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setValue("attachmentName", file?.name ?? undefined);
                  }}
                />
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration }}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="appointmentAt"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200"
                >
                  <Calendar className="h-4 w-4 text-holographic-cyan" aria-hidden />
                  Créneau souhaité — appel découverte 30 min (sans engagement)
                </label>
                <input
                  id="appointmentAt"
                  type="datetime-local"
                  min={minAppointmentLocal}
                  {...register("appointmentAt")}
                  className={cn(
                    "w-full max-w-md rounded-lg border bg-white/5 px-4 py-3 text-white focus:border-holographic-cyan focus:ring-1 focus:ring-holographic-cyan focus:outline-none",
                    errors.appointmentAt ? "border-red-500/50" : "border-white/15"
                  )}
                />
                {errors.appointmentAt && (
                  <p className="mt-1 text-sm text-red-400" role="alert">
                    {errors.appointmentAt.message}
                  </p>
                )}
                <p className="mt-2 text-xs text-slate-500">
                  Heure affichée selon votre appareil. Notre équipe confirmera ou proposera un autre créneau si besoin.
                </p>
              </div>
              <StepSummary data={watched as DevisFormData} className="mb-6" />
              {submitStatus === "error" && submitError && (
                <p className="mb-4 text-sm text-red-400" role="alert">{submitError}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {step === 5 ? (
          <FormBottomButtons
            submitting={submitStatus === "loading"}
            showSubmitButton={false}
          />
        ) : null}

        <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={step === 1 || submitStatus === "loading"}
            className="gap-2 shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
            Étape précédente
          </Button>
          {step < 5 ? (
            <Button
              type="button"
              onClick={goNext}
              disabled={step === 2 && !step2Valid()}
              className="gap-2 bg-holographic-cyan text-slate-900 hover:bg-cyan-400 w-full sm:w-auto"
            >
              Étape suivante
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={submitStatus === "loading"}
              className="gap-2 bg-holographic-cyan text-slate-900 hover:bg-cyan-400 w-full sm:w-auto min-h-[48px] font-bold shadow-[0_0_28px_rgba(0,200,255,0.25)] hover:shadow-[0_0_36px_rgba(0,200,255,0.35)] transition-shadow"
            >
              {submitStatus === "loading" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  Envoi en cours…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" aria-hidden />
                  Confirmer l&apos;envoi — devis et rendez-vous
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
