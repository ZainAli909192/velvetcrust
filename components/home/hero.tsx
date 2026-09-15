"use client";

import Header from "./header";
import Link from "next/link";
import {
  ArrowRight,
  CakeSlice,
  ChefHat,
  Leaf,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  fadeUp,
  staggerContainer,
} from "@/lib/animations";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden">

      {/* Mobile video */}
      <video
        autoPlay
        muted
        loop
        controls={false}
        playsInline
        preload="auto"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          object-center
          lg:hidden
        "
      >
        <source
          src="/mob-video.mp4"
          type="video/mp4"
        />
      </video>

      {/* Mobile soft brand tint */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          bg-[#510000]/16
          lg:hidden
        "
      />

      {/* Mobile warm cream light */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[2]
          bg-[linear-gradient(to_bottom,rgba(255,247,234,0.06)_0%,rgba(255,247,234,0.03)_30%,rgba(70,18,18,0.05)_60%,rgba(45,8,8,0.20)_100%)]
          lg:hidden
        "
      />

      {/* Mobile text readability glow */}
      <div
        className="
          pointer-events-none
          absolute
          -left-[20%]
          bottom-[7%]
          z-[2]
          h-[66%]
          w-[105%]
          bg-[radial-gradient(ellipse_at_left_center,rgba(255,244,229,0.28)_0%,rgba(255,238,220,0.14)_42%,transparent_73%)]
          blur-[10px]
          lg:hidden
        "
      />

      {/* Mobile bottom depth */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-[2]
          h-[35%]
          bg-gradient-to-t
          from-[#300606]/30
          via-[#510000]/8
          to-transparent
          lg:hidden
        "
      />

      {/* Desktop video */}
      <video
        autoPlay
        muted
        loop
        controls={false}
        playsInline
        preload="auto"
        className="
          absolute
          inset-0
          hidden
          h-full
          w-full
          object-cover
          object-center
          lg:block
        "
      >
        <source
          src="/images/video.mp4"
          type="video/mp4"
        />
      </video>

      {/* Desktop overlay */}
      <div
        className="
          absolute
          inset-0
          z-[1]
          hidden
          bg-gradient-to-r
          from-[#FFF7EA]/95
          via-[#FFF7EA]/55
          to-black/10
          lg:block
        "
      />

      <Header />

      {/* Mobile content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="
          absolute
          inset-x-0
          bottom-[18%]
          z-10
          px-7
          sm:px-10
          lg:hidden
        "
      >
        <div className="w-full max-w-[390px] -mt-20 ">

          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            className="mb-5 flex items-center gap-3"
          >

            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-black
                -mt-70
              "
            >
              Homemade Cheesecakes
            </p>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="
              max-w-[360px]
              font-serif
              text-[50px]
              font-medium
              leading-[0.9]
              tracking-[-0.045em]
              text-white
 
              min-[375px]:text-[38px]
              min-[410px]:text-[37px]
              relative
                           top-[-125]
                           text-[var(--brand-primary)] 

            "
          >  
            A Slice Of

            <span className="block text-[var(--brand-primary)]">
              Happiness
            </span>
          </motion.h1>

         

          {/* CTA */}
          <motion.div variants={fadeUp}>
            <Link
              href="/#cheesecakes"
              className="
                mt-6
                inline-flex
                items-center
                gap-5
                rounded-full
                border
                border-white/70
                bg-white/95
                px-8
                py-4

                text-[10px]
                font-semibold
                uppercase
                tracking-[0.17em]
                text-[#510000]

                shadow-[0_12px_35px_rgba(0,0,0,0.14)]
                backdrop-blur-sm

                transition
                duration-300

                hover:bg-[#FFF7EA]
                active:scale-[0.97]
              "
            >
              Order Now

              <ArrowRight size={16} />
            </Link>
          </motion.div>

           {/* Description */}
          <motion.p
            variants={fadeUp}
            className="
              mt-6
              max-w-[355px]
              text-[14px]
              font-normal
              leading-7
              text-white/95

              min-[390px]:text-[15px]
            "
          >
            Crafted with premium ingredients,
            baked with love, and made for
            life&apos;s sweet moments.
          </motion.p>
        </div>
      </motion.div>

      {/* Desktop content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: false,
          amount: 0.3,
        }}
        className="
          relative
          z-10
          hidden
          min-h-[100dvh]
          items-center
          px-16
          pb-12
          pt-32

          lg:flex
          xl:px-24
        "
      >
        <div className="w-full max-w-[700px]">

          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            className="mb-5 flex items-center gap-4"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#6E2527]">
              Homemade Cheesecakes
            </p>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="
              font-serif
              text-[82px]
              font-medium
              leading-[0.95]
              tracking-[-0.035em]
              text-[#55191D]

              xl:text-[94px]
            "
          >
            A Slice Of Happiness
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="
              mt-6
              max-w-[510px]
              font-serif
              text-xl
              leading-8
              text-[#513632]
            "
          >
            Crafted with premium ingredients,
            baked with love, and made for
            life&apos;s sweet moments.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp}>
            <Link
              href="/#cheesecakes"
              className="
                mt-8
                inline-flex
                items-center
                gap-4
                rounded-full
                bg-[#861417]
                px-8
                py-4

                text-sm
                font-medium
                uppercase
                tracking-[0.14em]
                text-white

                transition
                duration-300

                hover:-translate-y-0.5
                hover:bg-[#681014]
              "
            >
              Order Now

              <ArrowRight size={17} />
            </Link>
          </motion.div>

          {/* Desktop features */}
          <motion.div
            variants={fadeUp}
            className="mt-10 grid max-w-[520px] grid-cols-3 gap-7"
          >
            <DesktopFeature
              icon={
                <Leaf
                  size={25}
                  strokeWidth={1.5}
                />
              }
              title="Premium"
              subtitle="Ingredients"
            />

            <DesktopFeature
              icon={
                <ChefHat
                  size={26}
                  strokeWidth={1.5}
                />
              }
              title="Homemade"
              subtitle="With Love"
            />

            <DesktopFeature
              icon={
                <CakeSlice
                  size={26}
                  strokeWidth={1.5}
                />
              }
              title="For Every"
              subtitle="Occasion"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Desktop scroll indicator */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: false,
          amount: 0.8,
        }}
        transition={{
          duration: 0.7,
          delay: 0.6,
        }}
        className="
          absolute
          bottom-6
          left-1/2
          z-10
          hidden
          -translate-x-1/2
          items-center
          gap-4

          lg:flex
        "
      >
        <span className="h-px w-12 bg-[#6E2527]/50" />

        <span className="text-[10px] uppercase tracking-[0.3em] text-[#572326]">
          Scroll to Explore
        </span>

        <span className="h-px w-12 bg-[#6E2527]/50" />
      </motion.div>
    </section>
  );
}

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

function DesktopFeature({
  icon,
  title,
  subtitle,
}: FeatureProps) {
  return (
    <div className="flex flex-col items-start text-left text-[#682124]">
      {icon}

      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em]">
        {title}
      </p>

      <p className="text-xs font-medium uppercase tracking-[0.12em]">
        {subtitle}
      </p>
    </div>
  );
}