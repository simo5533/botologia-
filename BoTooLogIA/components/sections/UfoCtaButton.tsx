"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRIMARY_CTA_LABEL = "Entrer dans le futur";

/** Icône UFO avec effet propulsion au hover (réduit si prefers-reduced-motion) */
function UfoIcon({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      className={cn("inline-flex", className)}
      whileHover={reduceMotion ? undefined : { y: -2, rotate: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      aria-hidden
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <ellipse cx="12" cy="10" rx="6" ry="3" />
        <path d="M6 10v2c0 2 2.5 3 6 3s6-1 6-3v-2" />
        {!reduceMotion && (
          <motion.g
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <line x1="8" y1="12" x2="8" y2="15" />
            <line x1="12" y1="13" x2="12" y2="16" />
            <line x1="16" y1="12" x2="16" y2="15" />
          </motion.g>
        )}
        {reduceMotion && (
          <g>
            <line x1="8" y1="12" x2="8" y2="15" />
            <line x1="12" y1="13" x2="12" y2="16" />
            <line x1="16" y1="12" x2="16" y2="15" />
          </g>
        )}
      </svg>
    </motion.span>
  );
}

export interface UfoCtaButtonProps {
  asLink?: boolean;
  href?: string;
  size?: "default" | "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
}

/**
 * CTA principal "Entrer dans le futur" avec icône UFO animée (hover propulsion)
 */
export function UfoCtaButton({
  asLink = false,
  href = "/botohub#cta",
  size = "default",
  className,
  children = PRIMARY_CTA_LABEL,
}: UfoCtaButtonProps) {
  const content = (
    <>
      <UfoIcon />
      <span>{children}</span>
    </>
  );

  if (asLink) {
    return (
      <Button asChild size={size} className={cn("group", className)}>
        <Link href={href}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button size={size} className={cn("group", className)}>
      {content}
    </Button>
  );
}
