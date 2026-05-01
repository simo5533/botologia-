"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTeleport } from "@/components/TeleportProvider";
import { useReducedMotion } from "framer-motion";

const TELEPORT_TARGET = "/botolink";

export interface CtaLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: React.ReactNode;
}

/**
 * Lien CTA : si la cible est le formulaire (BoToLink), déclenche l’effet téléportation puis navigation.
 */
export const CtaLink = React.forwardRef<HTMLAnchorElement, CtaLinkProps>(
  function CtaLink({ href, children, className, ...rest }, ref) {
    const pathname = usePathname();
    const teleport = useTeleport();
    const reduceMotion = useReducedMotion();
    const useTeleportEffect = href === TELEPORT_TARGET && pathname !== TELEPORT_TARGET && !reduceMotion;

    if (useTeleportEffect && teleport) {
      return (
        <button
          type={"button"}
          ref={ref as React.Ref<HTMLButtonElement>}
          className={className}
          onClick={() => teleport.navigateWithTeleport(href)}
          {...(rest as Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">)}
        >
          {children}
        </button>
      );
    }

    return (
      <Link href={href} className={className} ref={ref} {...rest}>
        {children}
      </Link>
    );
  }
);
