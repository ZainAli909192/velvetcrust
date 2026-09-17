"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SiteLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            overflow-hidden
            bg-[var(--brand-background)]
          "
        >
          {/* Soft background glow */}
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[420px]
              w-[420px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[var(--brand-primary-soft)]/50
              blur-[90px]
            "
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Circle + Logo */}
            <div className="relative flex h-[180px] w-[180px] items-center justify-center sm:h-[220px] sm:w-[220px]">
              {/* Animated circle */}
              <motion.svg
                viewBox="0 0 200 200"
                className="absolute inset-0 h-full w-full -rotate-90"
              >
                <motion.circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke="var(--brand-primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{
                    pathLength: 0,
                    opacity: 0.3,
                  }}
                  animate={{
                    pathLength: 1,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 1.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </motion.svg>

              {/* Logo */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.82,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative h-[125px] w-[125px] sm:h-[150px] sm:w-[150px]"
              >
                <Image
                  src="/images/logo.png"
                  alt="Velvet Crust"
                  fill
                  sizes="(max-width: 640px) 125px, 150px"
                  priority
                  className="rounded-full object-center "
                />
              </motion.div>
            </div>

            {/* Brand */}
            <motion.p
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.65,
                duration: 0.6,
              }}
              className="
                mt-6
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.38em]
                text-[var(--brand-primary)]
                sm:text-xs
              "
            >
              Velvet Crust
            </motion.p>

            {/* Tagline */}
            <motion.h2
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.8,
                duration: 0.7,
              }}
              className="
                mt-2
                font-serif
                text-[26px]
                text-[var(--brand-text-dark)]
                sm:text-[32px]
              "
            >
              A Slice Of Happiness
            </motion.h2>

         

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{
                delay: 1,
                duration: 0.5,
              }}
              className="
                mt-3
                text-[8px]
                uppercase
                tracking-[0.25em]
                text-[var(--brand-muted)]
              "
            >
              Homemade Cheesecakes
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
