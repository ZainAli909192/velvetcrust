"use client";

import Link from "next/link";

import {
  ArrowRight,
  CakeSlice,
  ChefHat,
  Leaf,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  fadeUp,
  staggerContainer,
} from "@/lib/animations";

export default function DesktopHeroContent() {
  return (
    <>
      <motion.div
        variants={
          staggerContainer
        }
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
          <motion.div
            variants={fadeUp}
            className="
              mb-5
              flex
              items-center
              gap-4
            "
          >
            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#6E2527]
              "
            >
              Homemade Cheesecakes
            </p>
          </motion.div>

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

          <motion.p
            variants={fadeUp}
            className="
              mt-10
              max-w-[510px]
              font-serif
              text-xl
              leading-8
              text-[#513632]
            "
          >
            Crafted with premium
            ingredients, baked with love,
            and made for life&apos;s sweet
            moments.
          </motion.p>

          <motion.div
            variants={fadeUp}
          >
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

              <ArrowRight
                size={17}
              />
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="
              mt-10
              grid
              max-w-[520px]
              grid-cols-3
              gap-7
            "
          >
            <DesktopFeature
              icon={
                <Leaf
                  size={25}
                  strokeWidth={
                    1.5
                  }
                />
              }
              title="Premium"
              subtitle="Ingredients"
            />

            <DesktopFeature
              icon={
                <ChefHat
                  size={26}
                  strokeWidth={
                    1.5
                  }
                />
              }
              title="Homemade"
              subtitle="With Love"
            />

            <DesktopFeature
              icon={
                <CakeSlice
                  size={26}
                  strokeWidth={
                    1.5
                  }
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

        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-[#572326]
          "
        >
          Scroll to Explore
        </span>

        <span className="h-px w-12 bg-[#6E2527]/50" />
      </motion.div>
    </>
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
    <div
      className="
        flex
        flex-col
        items-start
        text-left
        text-[#682124]
      "
    >
      {icon}

      <p
        className="
          mt-2
          text-xs
          font-semibold
          uppercase
          tracking-[0.14em]
        "
      >
        {title}
      </p>

      <p
        className="
          text-xs
          font-medium
          uppercase
          tracking-[0.12em]
        "
      >
        {subtitle}
      </p>
    </div>
  );
}