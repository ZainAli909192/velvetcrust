"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function BrandStatement() {
  return (
    <section className="relative min-h-[70svh] overflow-hidden sm:min-h-[75vh] lg:min-h-[85vh]">
      <motion.div
        initial={{ scale: 1.05 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: false }}
        transition={{
          duration: 1.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0"
      >
        <Image
          src="/images/herobg.png"
          alt="Velvet Crust artisan cheesecake"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-[#31090a]/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#31090a]/80 via-transparent to-black/15" />

      <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-[1400px] items-end px-5 pb-14 sm:min-h-[75vh] sm:px-8 sm:pb-16 lg:min-h-[85vh] lg:items-center lg:px-16 xl:px-24">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
            amount: 0.35,
          }}
          transition={{ duration: 0.75 }}
          className="max-w-[760px]"
        >
          <p className="text-[10px] font-semibold  tracking-[0.28em] text-white/65">
            What we believe
          </p>

        <h2 className="mt-5 font-serif text-[48px] leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-[88px]">
  Made with love.
  <span className="block text-[#f0d3c3]">
    Shared with joy.
  </span>
</h2>

          <p className="mt-7 max-w-[520px] text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
            From our kitchen to your table, every Velvet Crust
            cheesecake is created to bring a little more
            happiness to the moment.
          </p>
        </motion.div>
      </div>
    </section>
  );
}