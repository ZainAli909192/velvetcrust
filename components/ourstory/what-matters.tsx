"use client";

import {
  Heart,
  Sparkles,
  Wheat,
} from "lucide-react";
import { motion } from "framer-motion";

const values = [
  {
    title: "Freshness",
    text: "Freshly made with care and attention.",
    icon: Sparkles,
  },
  {
    title: "Quality",
    text: "Carefully selected ingredients and thoughtful preparation.",
    icon: Wheat,
  },
  {
    title: "The Moment",
    text: "Made to be shared, gifted, celebrated and remembered.",
    icon: Heart,
  },
];

export default function WhatMatters() {
  return (
    <section className="bg-[var(--brand-background)] px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-28 xl:px-24">
      <div className="mx-auto max-w-[1300px]">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--brand-primary)]">
              What matters to us
            </p>

            <h2 className="mt-4 max-w-[450px] font-serif text-[42px] leading-[1] tracking-[-0.03em] text-[var(--brand-text-dark)] sm:text-5xl lg:text-6xl">
              Simple things,
              <span className="block text-[var(--brand-primary)]">
                done beautifully.
              </span>
            </h2>
          </motion.div>

          <div>
            {values.map(
              ({ title, text, icon: Icon }, index) => (
                <motion.div
                  key={title}
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: false,
                    amount: 0.4,
                  }}
                  transition={{
                    delay: index * 0.07,
                  }}
                  className="flex gap-5 border-b border-[var(--brand-border)] py-7 first:pt-0 last:border-none lg:gap-8"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                    />
                  </span>

                  <div>
                    <h3 className="font-serif text-2xl text-[var(--brand-text-dark)] sm:text-3xl">
                      {title}
                    </h3>

                    <p className="mt-2 max-w-[520px] text-sm leading-6 text-[var(--brand-muted)] sm:text-base sm:leading-7">
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