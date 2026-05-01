import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agentic AI — Build, Ship, Improve",
  description:
    "Agentic AI Full-Stack. Teleport to the future. One deploy away.",
};

export default function AgenticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="agentic-theme agentic-noise agentic-scanlines agentic-cursor-none min-h-screen bg-agentic-bg bg-cover bg-center">
      {children}
    </div>
  );
}
