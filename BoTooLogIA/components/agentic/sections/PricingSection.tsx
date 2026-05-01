"use client";

import { motion } from "framer-motion";

const easeSmooth = [0.25, 0.1, 0.25, 1];
const TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: "Custom",
    desc: "Small teams, up to 5 agents.",
    features: ["Multi-agent planning", "Tool calling", "Email support"],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "Custom",
    desc: "Unlimited agents, full stack.",
    features: ["Everything in Starter", "Secure deploy", "Live monitoring", "Priority support", "SLA 99.9%"],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    desc: "Dedicated infra and compliance.",
    features: ["Everything in Pro", "Dedicated cluster", "SSO & audit", "Custom contracts"],
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section className="relative border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="font-heading text-3xl font-bold text-white md:text-4xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: easeSmooth }}
        >
          Pricing
        </motion.h2>
        <motion.p
          className="mt-3 text-slate-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Scale with your team. Contact us for exact numbers.
        </motion.p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              className={`relative rounded-xl ${
                tier.highlighted ? "p-[1px]" : "border border-agentic-glass-border"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: easeSmooth }}
            >
              {tier.highlighted && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-agentic-cyan/50 via-agentic-cyan/30 to-agentic-cyan/50"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <div
                className={`relative rounded-[11px] p-6 backdrop-blur-sm ${
                  tier.highlighted
                    ? "bg-agentic-glass/95 shadow-[0_0_40px_rgba(0,229,255,0.1)]"
                    : "bg-agentic-glass/60"
                }`}
              >
              <h3 className="font-heading text-lg font-semibold text-white">{tier.name}</h3>
              <p className="mt-1 text-2xl font-bold text-agentic-cyan">{tier.price}</p>
              <p className="mt-2 text-sm text-slate-400">{tier.desc}</p>
              <ul className="mt-6 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-agentic-cyan">✓</span> {f}
                  </li>
                ))}
              </ul>
              <motion.button
                data-cursor-magnetic
                className={`mt-8 w-full rounded-lg py-3 font-medium transition-colors ${
                  tier.highlighted
                    ? "bg-agentic-cyan/20 text-agentic-cyan border border-agentic-cyan/40 hover:bg-agentic-cyan/30"
                    : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact sales
              </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
