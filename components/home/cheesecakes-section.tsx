"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { cheesecakes } from "@/data/cheesecakes";
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";

export default function CheesecakesSection() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-8 lg:px-12 xl:px-20">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute left-0 top-24 h-56 w-56 rounded-full bg-[var(--brand-primary-soft)]/30 blur-3xl" />

      <div className="pointer-events-none absolute bottom-32 right-0 h-72 w-72 rounded-full bg-[var(--brand-primary-soft)]/30 blur-3xl" />

      <div className="relative mx-auto max-w-[1500px]">
        {/* Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <h2 className="font-serif text-4xl leading-tight text-[var(--brand-text-dark)] sm:text-5xl lg:text-6xl">
            Our Cheesecakes
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--brand-muted)] sm:text-base">
            Homemade cheesecakes crafted with premium ingredients and made
            for every sweet moment.
          </p>
        </motion.div>

        {/* Cheesecake Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: false,
            amount: 0.12,
          }}
          className="
            grid
            grid-cols-2
            gap-x-4
            gap-y-12

            sm:gap-x-6

            lg:grid-cols-3
            lg:items-start
            lg:gap-x-10
            lg:gap-y-16
          "
        >
          {cheesecakes.map((cake, index) => (
            <motion.article
              key={cake.id}
              variants={fadeUp}
              className="group relative flex flex-col"
            >
              {/* FIXED PRODUCT STAGE */}
              <div
                className="
                  relative
                  flex
                  h-[180px]
                  w-full
                  items-center
                  justify-center

                  sm:h-[250px]

                  lg:h-[320px]

                  xl:h-[350px]
                "
              >
                {/* Product Image */}
                <motion.div
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`
                    relative
                    h-full
                    w-full
                    transition-transform
                    duration-500

                    ${
                      index === 1
                        ? "scale-[0.82] lg:scale-[0.84]"
                        : "scale-100"
                    }
                  `}
                >
                  <Image
                    src={cake.image}
                    alt={cake.name}
                    fill
                    className="
                      object-contain
                      object-center
                      drop-shadow-[0_18px_30px_rgba(76,28,28,0.12)]
                    "
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </motion.div>
              </div>

              {/* Product Info */}
              <div className="relative z-10 mt-4 text-center lg:mt-5">
                <h3 className="font-serif text-lg font-semibold text-[var(--brand-text-dark)] sm:text-2xl">
                  {cake.name}
                </h3>

                <p className="mt-1 text-[11px] text-[var(--brand-muted)] sm:text-sm">
                  {cake.description}
                </p>

                <p className="mt-2 text-base font-bold text-[var(--brand-primary)] sm:text-xl">
                  AED {cake.price}
                </p>

                <Link
                  href={`/order/${cake.slug}`}
                  className="
                    mt-3
                    inline-flex
                    min-w-[135px]
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[var(--brand-primary)]
                    px-5
                    py-2.5
                    text-xs
                    font-medium
                    text-white
                    transition
                    duration-300

                    hover:-translate-y-0.5
                    hover:bg-[var(--brand-primary-dark)]

                    sm:min-w-[160px]
                    sm:px-6
                    sm:py-3
                    sm:text-sm
                  "
                >
                  Order Now
                  <ArrowRight size={15} />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Bottom Brand Line */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-20 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-muted)] sm:text-xs"
        >
          <span>Homemade</span>

          <span className="h-1 w-1 rounded-full bg-[var(--brand-primary)]" />

          <span>Premium Ingredients</span>

          <span className="h-1 w-1 rounded-full bg-[var(--brand-primary)]" />

          <span>Same-Day Delivery</span>
        </motion.div>
      </div>
    </section>
  );
}