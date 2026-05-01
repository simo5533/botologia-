import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme-page px-4">
      <h1 className="text-4xl font-heading font-bold text-cyber-cyan mb-2">404</h1>
      <p className="text-white/80 mb-6">Cette page n’existe pas.</p>
      <Link
        href="/"
        className="rounded-lg bg-cyber-cyan/20 text-cyber-cyan px-4 py-2 hover:bg-cyber-cyan/30 transition-colors"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
