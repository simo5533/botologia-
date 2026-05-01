import Link from "next/link";

/**
 * Lien d'évitement pour la navigation au clavier (accessibilité).
 * Caché visuellement, visible au focus.
 */
export function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:h-auto focus:w-auto focus:overflow-visible focus:rounded-lg focus:bg-holographic-cyan focus:px-4 focus:py-2 focus:text-slate-900 focus:outline-none focus:ring-2 focus:ring-white focus:[clip:auto] focus:[margin:0] focus:[padding:0.5rem_1rem]"
    >
      Aller au contenu principal
    </Link>
  );
}
