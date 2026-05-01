"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UfoCtaButton } from "@/components/sections/UfoCtaButton";
import { publicNavLinks } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Navbar sticky futuriste — glassmorphism, liens + CTA "Entrer dans le futur"
 * Menu mobile : fermeture Escape, piège au focus, restauration du focus au toggle.
 */
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!open) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open || !menuRef.current) return;
    const el = menuRef.current;
    const focusables = el.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = focusables[0];
    if (first) {
      const t = requestAnimationFrame(() => first.focus());
      return () => cancelAnimationFrame(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !menuRef.current) return;
    const el = menuRef.current;
    const focusables = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusables.length === 0) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const current = document.activeElement as HTMLElement | null;
      if (!current || !el.contains(current)) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (current === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (current === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-[0_1px_0_rgba(0,212,255,0.03)]"
      role="banner"
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        <Link
          href="/botohub#banner"
          className={cn(
            "font-heading text-xl font-bold tracking-tight",
            "bg-gradient-to-r from-white via-white to-[#00d4ff]/90 bg-clip-text text-transparent"
          )}
        >
          BoTooLogIA
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {publicNavLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-[filter] duration-200 nav-rubrique-gradient",
                pathname === href && "nav-rubrique-gradient--active"
              )}
            >
              {label}
            </Link>
          ))}
          <UfoCtaButton asLink href="/botolink" size="sm" />
        </div>

        {/* Mobile toggle */}
        <Button
          ref={toggleRef}
          variant="ghost"
          size="icon"
          className="md:hidden text-slate-700 dark:text-slate-200 focus-visible:ring-2 focus-visible:ring-holographic-cyan focus-visible:ring-offset-2"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-haspopup="true"
        >
          {open ? <X /> : <Menu />}
        </Button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 bg-slate-900/90 backdrop-blur-xl"
          >
            <div ref={menuRef} className="flex flex-col gap-2 px-4 py-4">
              {publicNavLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm font-medium transition-[filter,background-color]",
                    "nav-rubrique-gradient",
                    pathname === href
                      ? "nav-rubrique-gradient--active bg-holographic-cyan/10"
                      : "hover:bg-white/10"
                  )}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-2">
                <UfoCtaButton asLink href="/botolink" className="w-full" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
