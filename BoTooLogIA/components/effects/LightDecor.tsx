"use client";

/** Décorations purement CSS — zéro JS, zéro calcul */
export default function LightDecor() {
  return (
    <>
      <div className="futuristic-sidebar" aria-hidden="true" />
      <div className="static-dots" aria-hidden="true" />
      <div className="corner-decoration top-left" aria-hidden="true" />
      <div className="corner-decoration bottom-right" aria-hidden="true" />
    </>
  );
}
