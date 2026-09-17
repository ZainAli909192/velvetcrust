"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  fadeUp,
  staggerContainer,
} from "@/lib/animations";

export default function MobileHeroContent() {
  const [
    showOrderButton,
    setShowOrderButton,
  ] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowOrderButton(
        window.scrollY < 40
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return (
    <>
      <motion.div
        variants={
          staggerContainer
        }
        initial="hidden"
        animate="show"
        className="
          absolute
          inset-x-0
          bottom-[24%]
          z-10
          px-7

          sm:px-10
          lg:hidden
        "
      >
        <div className="w-full max-w-[390px]">
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.3em]
              text-black
            "
          >
            Homemade Cheesecakes
          </motion.p>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="
              mt-5
              max-w-[360px]
              font-serif
              text-[38px]
              font-medium
              leading-[0.9]
              tracking-[-0.045em]
              text-white

              min-[410px]:text-[40px]
            "
          >
            A Slice Of

            <span
              className="
                block
                text-[var(--brand-primary)]
              "
            >
              Happiness
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="
              mt-[90%]
              max-w-[355px]

              text-[14px]
              font-normal
              leading-7
              text-white/95

              min-[390px]:text-[15px]
              
            "
          >
            
          </motion.p>
        </div>
      </motion.div>

      {/* Mobile Order Now */}
      <AnimatePresence>
        {showOrderButton && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 10,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="
              fixed
              bottom-[calc(7.5rem+env(safe-area-inset-bottom))]
              left-7
              z-[74]

              sm:left-10
              lg:hidden
            "
          >
            <Link
              href="/#cheesecakes"
              className="
                inline-flex
                min-h-12
                items-center
                gap-5
                rounded-full

                border
                border-white/70

                bg-white/95
                px-5

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

              <ArrowRight
                size={16}
              />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}