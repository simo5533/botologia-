import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Connexion — Espace Client BoTooLogIA',
};

export default function LoginSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
