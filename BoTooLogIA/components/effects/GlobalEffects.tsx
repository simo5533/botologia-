"use client";

import { useEffect } from "react";
import CustomCursor from "./CustomCursor";
import AuroraBackground from "./AuroraBackground";
import LightDecor from "./LightDecor";

export default function GlobalEffects() {
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => {
      if (mq.matches) document.documentElement.classList.add("futuristic-cursor-active");
      else document.documentElement.classList.remove("futuristic-cursor-active");
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.documentElement.classList.remove("futuristic-cursor-active");
    };
  }, []);

  return (
    <>
      <AuroraBackground />
      <LightDecor />
      <CustomCursor />
    </>
  );
}
