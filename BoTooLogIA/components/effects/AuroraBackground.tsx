"use client";

/** Aurora en CSS pur — transform/opacity uniquement, GPU accelerated */
export default function AuroraBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
      <div className="aurora-blob aurora-3" />
    </div>
  );
}
