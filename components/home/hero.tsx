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
        <source src="/mob-video.mp4" type="video/mp4" />
      </video>

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
        <source src="/images/video.mp4" type="video/mp4" />
      </video>

      {/* Mobile overlay */}
      <div
        className="
          absolute
          inset-0
          z-[1]
          bg-[linear-gradient(90deg,rgba(255,248,237,0.93)_0%,rgba(255,248,237,0.76)_44%,rgba(255,248,237,0.23)_74%,rgba(255,248,237,0.03)_100%)]

          lg:hidden
        "
      />

      {/* Mobile soft glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-[15%]
          z-[2]
          h-[58%]
          w-[78%]
          bg-[radial-gradient(ellipse_at_left,rgba(255,248,237,0.72)_0%,rgba(255,248,237,0.35)_52%,transparent_82%)]
          blur-xl

          lg:hidden
        "
      />

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
          left-0
          top-[23%]
          z-10
          w-full
          px-6

          min-[390px]:top-[24%]

          sm:px-10

          lg:hidden
        "
      >
        <div className="w-full max-w-[390px]">
          {/* Heading */}
          <motion.div variants={fadeUp}>
            <h1
              className="
                font-serif
                text-[49px]
                font-medium
                leading-[0.88]
                tracking-[-0.045em]
                text-[var(--brand-primary)]

                min-[380px]:text-[52px]
                min-[430px]:text-[56px]
              "
            >
              A Slice Of
            </h1>

            <div className="relative -mt-1">
              <span
                className="
                  block
                  -rotate-[3deg]
                  text-[66px]
                  leading-[0.95]
                  text-[#B56E42]

                  min-[380px]:text-[72px]
                  min-[430px]:text-[78px]
                "
                style={{
                  fontFamily:
                    '"Brush Script MT", "Segoe Script", cursive',
                }}
              >
                Happiness
              </span>

              <span
                className="
                  absolute
                  -bottom-2
                  left-7
                  h-px
                  w-[72%]
                  -rotate-[4deg]
                  bg-[#B56E42]/70
                "
              />
            </div>
          </motion.div>

          {/* Decorative text */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.8,
            }}
            className="
              pointer-events-none
              mt-[120px]
              -rotate-[7deg]
              text-[#9F6749]/75
            "
            style={{
              fontFamily:
                '"Brush Script MT", "Segoe Script", cursive',
            }}
          >
            <p className="text-[22px] leading-[0.9]">
              Sweet
            </p>

            <p className="ml-3 text-[24px] leading-[0.9]">
              Moments
            </p>

            <p className="ml-7 text-[20px] leading-none">
              Always ♡
            </p>
          </motion.div>
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
            <span className="h-px w-10 bg-[#6E2527]" />

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#6E2527]">
              Homemade Cheesecakes
            </p>

            <span className="h-px w-10 bg-[#6E2527]" />
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
            baked with love, and made for life&apos;s
            sweet moments.
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
              icon={<Leaf size={25} strokeWidth={1.5} />}
              title="Premium"
              subtitle="Ingredients"
            />

            <DesktopFeature
              icon={<ChefHat size={26} strokeWidth={1.5} />}
              title="Homemade"
              subtitle="With Love"
            />

            <DesktopFeature
              icon={<CakeSlice size={26} strokeWidth={1.5} />}
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