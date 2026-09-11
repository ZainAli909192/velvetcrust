"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import {
  fadeUp,
  fadeLeft,
  fadeRight,
  cakeRise,
  staggerContainer,
  viewportOnce,
  floatAnimation,
  floatTransition,
  pulseAnimation,
  pulseTransition,
} from "@/lib/animations";

export default function FinalCTA() {
  return (
    <section className="bg-[var(--brand-background)] px-4 py-12 sm:px-6 lg:px-10 lg:py-24">
      {/* MOBILE */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto max-w-[520px] lg:hidden"
      >
        <div
          className="
            relative
            min-h-[430px]
            overflow-hidden
            rounded-[30px]
            px-6
            pb-6
            pt-8
          "
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            className="
              text-center
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.32em]
              text-[var(--brand-primary)]
            "
          >
            Save Room for Something
          </motion.p>

          {/* Heading */}
          <motion.h2
            variants={fadeUp}
            className="
              mt-2
              text-center
              font-serif
              text-[54px]
              leading-[0.92]
              tracking-[-0.03em]
              text-[var(--brand-primary)]
            "
          >
            Sweet.
          </motion.h2>

          {/* Left copy */}
          <motion.div
            variants={fadeLeft}
            className="absolute left-6 top-[165px] z-20"
          >
            <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]/75">
              Made Fresh
            </p>

            <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]/75">
              Shared With Love
            </p>

            <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]/75">
              Velvet Crust
            </p>

            <motion.span
              animate={pulseAnimation}
              transition={pulseTransition}
              className="mt-2 block text-lg text-[var(--brand-primary)]"
            >
              ♡
            </motion.span>
          </motion.div>

          {/* Right handwritten */}
          <motion.div
            variants={fadeRight}
            className="
              absolute
              right-5
              top-[160px]
              z-20
              rotate-[-7deg]
              text-right
              font-serif
              text-[18px]
              italic
              leading-[1.05]
              text-[var(--brand-primary)]/55
            "
          >
            Good
            <br />
            Things
            <br />
            Taste
            <br />
            Better
            <br />
            Here ♡
          </motion.div>

          {/* Cake */}
          <motion.div
            variants={cakeRise}
            className="
              absolute
              bottom-4
              left-1/2
              h-[230px]
              w-[270px]
              -translate-x-1/2
            "
          >
            <motion.div
              animate={floatAnimation}
              transition={floatTransition}
              className="relative h-full w-full"
            >
              <Image
                src="/images/cta/berry.png"
                alt="Strawberry cheesecake"
                fill
                priority
                className="object-contain object-bottom"
                sizes="270px"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* DESKTOP / TABLET */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="
          relative
          mx-auto
          hidden
          min-h-[650px]
          max-w-[1500px]
          overflow-hidden
          rounded-[56px]
          bg-[var(--brand-primary)]
          lg:block
        "
      >
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]" />

        {/* Left decorative */}
        <motion.div
          variants={fadeLeft}
          className="
            pointer-events-none
            absolute
            left-[5%]
            top-[16%]
            rotate-[-8deg]
            font-serif
            text-[34px]
            italic
            leading-[1.05]
            text-[#e5b8aa]/55
          "
        >
          Good
          <br />
          Things
          <br />
          Taste
          <br />
          Better
          <br />
          Here ♡
        </motion.div>

        {/* Right badge */}
        <motion.div
          variants={fadeRight}
          className="
            pointer-events-none
            absolute
            right-[7%]
            top-[12%]
            flex
            h-[180px]
            w-[180px]
            items-center
            justify-center
            rounded-full
            border
            border-[#e5b8aa]/25
            text-center
            text-[#e5b8aa]/45
          "
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.42em]">
              Sweeter
            </p>

            <motion.div
              animate={pulseAnimation}
              transition={pulseTransition}
              className="my-3 text-3xl"
            >
              ♡
            </motion.div>

            <p className="text-[11px] uppercase tracking-[0.42em]">
              Always
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div
          className="
            relative
            z-20
            mx-auto
            flex
            max-w-[900px]
            flex-col
            items-center
            px-10
            pt-16
            text-center
          "
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.42em] text-white/85"
          >
            Velvet Crust
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="
              mt-4
              max-w-[850px]
              font-serif
              text-[76px]
              leading-[0.96]
              tracking-[-0.025em]
              text-white
              xl:text-[88px]
            "
          >
            Happiness is
            <br />
            only a slice away.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-[650px] text-[15px] leading-7 text-white/78"
          >
            Handcrafted cheesecakes, made for sharing, gifting,
            celebrating—or keeping all to yourself.
          </motion.p>

          <motion.div variants={fadeUp}>
            <Link
              href="#home"
              className="
                mt-7
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-[var(--brand-background)]
                px-9
                py-4
                text-xs
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[var(--brand-primary)]
                transition
                duration-300
                hover:-translate-y-0.5
                hover:bg-white
              "
            >
              Order Now
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Cakes */}
        <div className="absolute inset-x-0 bottom-0 z-10 h-[360px]">
          {/* Blueberry */}
          <motion.div
            variants={cakeRise}
            className="absolute -bottom-14 -left-4 h-[360px] w-[430px] xl:w-[470px]"
          >
            <motion.div
              animate={floatAnimation}
              transition={{
                ...floatTransition,
                delay: 0,
              }}
              className="relative h-full w-full"
            >
              <Image
                src="/images/cta/blueberry-cheesecake.png"
                alt="Blueberry cheesecake"
                fill
                className="object-contain object-bottom"
                sizes="470px"
              />
            </motion.div>
          </motion.div>

          {/* Strawberry */}
          <motion.div
            variants={cakeRise}
            className="
              absolute
              -bottom-20
              left-1/2
              h-[390px]
              w-[470px]
              -translate-x-1/2
              xl:w-[520px]
            "
          >
            <motion.div
              animate={floatAnimation}
              transition={{
                ...floatTransition,
                delay: 0.4,
              }}
              className="relative h-full w-full"
            >
              <Image
                src="/images/cta/strawberry-cheesecake.png"
                alt="Strawberry cheesecake"
                fill
                priority
                className="object-contain object-bottom"
                sizes="520px"
              />
            </motion.div>
          </motion.div>

          {/* Lemon */}
          <motion.div
            variants={cakeRise}
            className="absolute -bottom-14 -right-4 h-[360px] w-[430px] xl:w-[470px]"
          >
            <motion.div
              animate={floatAnimation}
              transition={{
                ...floatTransition,
                delay: 0.8,
              }}
              className="relative h-full w-full"
            >
              <Image
                src="/images/cta/lemon-cheesecake.png"
                alt="Lemon cheesecake"
                fill
                className="object-contain object-bottom"
                sizes="470px"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}