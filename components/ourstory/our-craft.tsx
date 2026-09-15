"use client";

import {
  ChefHat,
  Heart,
  Sparkles,
  Wheat,
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Select",
    text: "Carefully selected ingredients.",
    icon: Wheat,
  },
  {
    number: "02",
    title: "Create",
    text: "Prepared with attention to flavour and texture.",
    icon: ChefHat,
  },
  {
    number: "03",
    title: "Finish",
    text: "Beautifully topped and finished by hand.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Share",
    text: "Freshly prepared for your special moment.",
    icon: Heart,
  },
];

export default function OurCraft() {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-28 xl:px-24">
      <div className="mx-auto max-w-[1350px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="max-w-[650px]"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--brand-primary)]">
            Our craft
          </p>

          <h2 className="mt-4 font-serif text-[40px] leading-none tracking-[-0.03em] text-[var(--brand-text-dark)] sm:text-5xl lg:text-6xl">
            Crafted with care.
          </h2>

          <p className="mt-5 max-w-[540px] text-sm leading-7 text-[var(--brand-muted)] sm:text-base">
            Every Velvet Crust cheesecake moves through a
            thoughtful process where every detail matters.
          </p>
        </motion.div>

        <div className="relative mt-14 lg:mt-20">
          <div className="absolute bottom-10 left-[5%] right-[5%] top-10 hidden h-px bg-[var(--brand-border)] lg:block" />

          <div className="grid gap-0 lg:grid-cols-4">
            {steps.map(
              ({ number, title, text, icon: Icon }, index) => (
                <motion.div
                  key={title}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: false,
                    amount: 0.3,
                  }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.55,
                  }}
                  className="group relative flex gap-5 border-b border-[var(--brand-border)] py-7 last:border-none lg:block lg:border-b-0 lg:px-6 lg:py-0"
                >
                  <div className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full bg-[var(--brand-primary)] text-white shadow-[0_12px_30px_rgba(81,0,0,0.16)] transition-transform duration-300 group-hover:-translate-y-1 lg:size-16">
                    <Icon
                      size={23}
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="min-w-0 lg:mt-7">
                    <span className="text-[10px] font-bold tracking-[0.18em] text-[var(--brand-primary)]/50">
                      {number}
                    </span>

                    <h3 className="mt-1 font-serif text-2xl text-[var(--brand-text-dark)]">
                      {title}
                    </h3>

                    <p className="mt-2 max-w-[230px] text-sm leading-6 text-[var(--brand-muted)]">
                      {text}
                    </p>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}