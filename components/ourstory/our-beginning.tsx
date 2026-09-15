"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function OurBeginning() {
  return (
    <section
      id="our-beginning"
      className="relative overflow-hidden bg-[var(--brand-background)] px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-32 xl:px-24"
    >
      <div className="pointer-events-none absolute -left-32 top-20 size-72 rounded-full bg-[var(--brand-primary-soft)]/60 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1350px] gap-12 lg:grid-cols-[0.92fr_1fr] lg:items-center lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] sm:aspect-[5/6] lg:rounded-[38px]">
            <Image
              src="/images/ourstory/story.webp"
              alt="Preparing a Velvet Crust cheesecake"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 right-4 max-w-[190px] rounded-[22px] bg-[var(--brand-primary)] p-5 text-white shadow-[0_20px_50px_rgba(81,0,0,0.22)] sm:right-8 sm:max-w-[230px] sm:p-6">
            <p className="font-serif text-xl leading-snug sm:text-2xl">
              Homemade at heart.
            </p>

            <p className="mt-1 text-xs text-white/70">
              Premium in every detail.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.7,
            delay: 0.08,
          }}
          className="pt-5 lg:pt-0"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--brand-primary)]" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--brand-primary)]">
              Where it began
            </p>
          </div>

          <h2 className="mt-5 max-w-[620px] font-serif text-[40px] leading-[1.02] tracking-[-0.03em] text-[var(--brand-text-dark)] sm:text-5xl lg:text-6xl">
            It started with a simple idea.
          </h2>

          <div className="mt-7 max-w-[610px] space-y-5 text-[15px] leading-7 text-[var(--brand-muted)] sm:text-base sm:leading-8">
            <p>
              Velvet Crust was born from a passion for creating
              rich, creamy cheesecakes that feel homemade,
              thoughtful and special.
            </p>

            <p>
              What started in the kitchen as a love for baking
              grew into something more — a desire to create
              desserts that become part of birthdays,
              celebrations, gifts, family gatherings and those
              simple moments when you just want something sweet.
            </p>
          </div>

          <div className="mt-9 border-l-2 border-[var(--brand-primary)] pl-5 sm:pl-7">
            <p className="font-serif text-2xl italic leading-snug text-[var(--brand-primary)] sm:text-3xl">
              For us, cheesecake isn&apos;t simply dessert.
            </p>

            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-text-dark)]">
              It&apos;s a slice of happiness.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}