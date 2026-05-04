import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Profil — Paramètres du compte',
};

export default function ProfileSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
