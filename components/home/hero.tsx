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
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          object-center
        "
      >
        <source src="/images/video.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#FFF7EA]/95 via-[#FFF7EA]/55 to-black/10" />

      {/* Header */}
      <Header />

      {/* Hero Content */}
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
          flex
          min-h-[100dvh]
          items-center
          px-6
          pb-12
          pt-32

          sm:px-10

          lg:px-16

          xl:px-24
        "
      >
        <div className="w-full max-w-[700px]">
          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            className="mb-5 flex items-center gap-3 sm:gap-4"
          >
            <span className="h-px w-7 bg-[#6E2527] sm:w-10" />

            <p
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.24em]
                text-[#6E2527]

                sm:text-sm
                sm:tracking-[0.3em]
              "
            >
              Homemade Cheesecakes
            </p>

            <span className="hidden h-px w-10 bg-[#6E2527] sm:block" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="
              whitespace-nowrap
              font-serif
              text-[34px]
              font-medium
              leading-none
              tracking-[-0.035em]
              text-[#55191D]

              min-[380px]:text-[36px]
              min-[430px]:text-[40px]

              sm:whitespace-normal
              sm:text-[58px]
              sm:leading-[0.95]

              lg:text-[82px]

              xl:text-[94px]
            "
          >
            A Slice Of{" "}
            <span className="text-black">
              Happiness
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="
              mt-5
              max-w-[510px]
              font-serif
              text-[15px]
              leading-7
              text-[#513632]

              sm:mt-6
              sm:text-xl
              sm:leading-8
            "
          >
            Crafted with premium ingredients, baked with love, and made for
            life&apos;s sweet moments.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp}>
            <Link
              href="/#cheesecakes"
              className="
                mt-8
                hidden
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

                md:inline-flex
              "
            >
              Order Now

              <ArrowRight size={17} />
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            variants={fadeUp}
            className="
              mt-8
              grid
              max-w-[520px]
              grid-cols-3
              gap-2

              sm:mt-10
              sm:gap-7
            "
          >
            <Feature
              icon={<Leaf size={25} strokeWidth={1.5} />}
              title="Premium"
              subtitle="Ingredients"
            />

            <Feature
              icon={<ChefHat size={26} strokeWidth={1.5} />}
              title="Homemade"
              subtitle="With Love"
            />

            <Feature
              icon={<CakeSlice size={26} strokeWidth={1.5} />}
              title="For Every"
              subtitle="Occasion"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
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

function Feature({
  icon,
  title,
  subtitle,
}: FeatureProps) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        text-center
        text-[#682124]

        sm:items-start
        sm:text-left
      "
    >
      {icon}

      <p
        className="
          mt-2
          text-[8px]
          font-medium
          uppercase
          tracking-[0.12em]

          sm:text-xs
          sm:tracking-[0.14em]
        "
      >
        {title}
      </p>

      <p
        className="
          text-[8px]
          uppercase
          tracking-[0.1em]

          sm:text-xs
          sm:tracking-[0.12em]
        "
      >
        {subtitle}
      </p>
    </div>
  );
}