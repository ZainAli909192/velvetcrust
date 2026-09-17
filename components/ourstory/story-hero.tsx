"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  fadeUp,
  scaleIn,
  staggerContainer,
  viewport,
} from "./animations";

export default function StoryHero() {
  return (
    <section className="relative min-h-[85dvh] overflow-hidden lg:min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 1.08 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={viewport}
        transition={{
          duration: 1.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0"
      >
        <Image
          src="/images/ourstory/hero.webp"
          alt="Velvet Crust artisan cheesecake"
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#FFF7EA]/95 via-[#FFF7EA]/65 to-black/15" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="relative z-10 flex min-h-[85dvh] items-end px-6 pb-20 pt-32 sm:px-10 lg:min-h-screen lg:items-center lg:px-16 xl:px-24"
      >
        <div className="max-w-[650px]">
          <motion.div
            variants={scaleIn}
            className="mb-5 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-[#6E2527]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E2527] sm:text-xs">
              Our Story
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp} 
            className=" font-serif text-[48px] font-medium leading-[0.95] tracking-[-0.04em] text-[#55191D] sm:text-6xl lg:text-[88px]"
          >
            Made With Love.
            <br />
            Made To Be Shared.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[520px] font-serif text-base leading-7 text-[#513632] sm:text-xl sm:leading-8"
          >
            Homemade artisan cheesecakes created for the moments that deserve
            something a little sweeter.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}