"use client";

import { FuturisticCursor, AgenticHeroSection } from "@/components/agentic";
import {
  AgentWorkflowSection,
  FeaturesSection,
  LiveDemoSection,
  TestimonialsSection,
  PricingSection,
  FinalCtaSection,
} from "@/components/agentic/sections";

export default function AgenticPage() {
  return (
    <>
      <FuturisticCursor />
      <AgenticHeroSection />
      <AgentWorkflowSection />
      <FeaturesSection />
      <LiveDemoSection />
      <TestimonialsSection />
      <PricingSection />
      <FinalCtaSection />
    </>
  );
}
