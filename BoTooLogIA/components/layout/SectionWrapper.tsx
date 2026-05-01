import { cn } from "@/lib/utils";
import GlitchText from "@/components/effects/GlitchText";
import { SiteContentFrame } from "@/components/layout/SiteContentFrame";

export interface SectionWrapperProps {
  id?: string;
  /** Libellé au-dessus du titre (uppercase, style vitrine) */
  eyebrow?: string;
  title?: string;
  /** Petit libellé affiché entre le titre et le sous-titre (ex. BoToAdvantage) */
  titleTag?: string;
  subtitle?: string;
  /** Niveau de titre pour la hiérarchie SEO (h1 par page, puis h2) */
  headingLevel?: 1 | 2;
  /** Affiche le titre avec effet Glitch futuriste */
  titleGlitch?: boolean;
  /** Affiche le titre avec dégradé de couleur animé (cyan → violet) */
  titleGradient?: boolean;
  /** Enveloppe le contenu dans un cadre verre (SiteContentFrame) */
  framed?: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const headingBase = "font-heading text-3xl font-bold tracking-tight md:text-4xl";

/** Titre rubrique : cyan vif → violet → bleu (réf. maquette) + lueur — réutilisable hors SectionWrapper */
export const sectionTitleGradientClass = cn(
  "inline-block max-w-full bg-gradient-to-r from-[#00D2FF] via-[#A855F7] to-[#3B82F6]",
  "bg-clip-text text-transparent",
  "drop-shadow-[0_0_20px_rgba(0,210,255,0.45)]",
  "drop-shadow-[0_0_36px_rgba(168,85,247,0.35)]",
  "drop-shadow-[0_0_48px_rgba(59,130,246,0.25)]"
);

/**
 * Wrapper de section avec titre optionnel — espacement aéré, typo cohérente, hiérarchie h1/h2
 */
export function SectionWrapper({
  id,
  eyebrow,
  title,
  titleTag,
  subtitle,
  headingLevel = 2,
  titleGlitch = false,
  titleGradient = false,
  framed = false,
  children,
  className,
  contentClassName,
}: SectionWrapperProps) {
  const HeadingTag = headingLevel === 1 ? "h1" : "h2";
  const titleId = title ? "section-title" : undefined;
  const titleContent =
    titleGradient ? (
      <span className={sectionTitleGradientClass}>{title}</span>
    ) : titleGlitch ? (
      <GlitchText text={title!} intensity="low" />
    ) : (
      title
    );

  const headingClassName = cn(
    headingBase,
    titleGradient && "text-transparent",
    titleGlitch && "text-white",
    !titleGradient && !titleGlitch && "text-slate-100"
  );

  return (
    <section
      id={id}
      className={cn("py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative bg-theme-section", className)}
      aria-labelledby={titleId}
    >
      <div className={cn("mx-auto w-full min-w-0 max-w-7xl", contentClassName)}>
        {title && (
          <header className="mb-8 text-center sm:mb-10 md:mb-16">
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400/90">
                {eyebrow}
              </p>
            )}
            <HeadingTag
              id={titleId}
              className={cn(headingClassName, "px-1 sm:px-0 break-words")}
            >
              {titleContent}
            </HeadingTag>
            {titleTag && (
              <p className="mt-1 mb-0 text-sm font-medium tracking-widest uppercase text-holographic-cyan/90">
                {titleTag}
              </p>
            )}
            {subtitle && (
              <p className="mt-2 max-w-3xl mx-auto px-1 text-sm leading-relaxed text-[#e2e8f0] sm:px-0 sm:text-base">
                {subtitle}
              </p>
            )}
          </header>
        )}
        {framed ? (
          <SiteContentFrame className="p-5 sm:p-8 md:p-10 lg:p-12">
            {children}
          </SiteContentFrame>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
