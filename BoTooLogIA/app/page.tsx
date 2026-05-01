"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Racine : redirection vers la home BoToHub.
 * Client-side pour éviter 404 lors de la première requête (compilation lente).
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/botohub");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-page">
      <p className="text-slate-500 dark:text-slate-400 animate-pulse">
        Redirection…
      </p>
    </div>
  );
}
