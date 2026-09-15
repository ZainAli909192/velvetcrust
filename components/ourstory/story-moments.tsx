"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const moments = [
  {
    title: "Birthdays",
    image: "/images/ourstory/birthday.webp",
    className:
      "col-span-2 aspect-[1.4/1] sm:col-span-1 sm:row-span-2 sm:aspect-auto",
  },
  {
    title: "Celebrations",
    image: "/images/ourstory/celebration.webp",
    className: "aspect-square",
  },
  {
    title: "Gifting",
    image: "/images/ourstory/gifting.webp",
    className: "aspect-square",
  },
  {
    title: "Just Because",
    image: "/images/ourstory/just-because.webp",
    className:
      "col-span-2 aspect-[1.65/1] sm:col-span-2",
  },
];

export default function StoryMoments() {
  return (
    <section className="bg-white px-4 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-28 xl:px-24">
      <div className="mx-auto max-w-[1350px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="mx-auto max-w-[760px] text-center"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.27em] text-[var(--brand-primary)]">
            Made for your moments
          </p>

          <h2 className="mt-4 font-serif text-[40px] leading-[1.02] tracking-[-0.035em] text-[var(--brand-text-dark)] sm:text-5xl lg:text-6xl">
            Some moments are planned.
            <span className="block text-[var(--brand-primary)]">
              Others just deserve cheesecake.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-[550px] text-sm leading-7 text-[var(--brand-muted)] sm:text-base">
            Big celebrations, thoughtful gifts or an ordinary
            evening made a little sweeter.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:grid-rows-2 sm:gap-4 lg:mt-16">
          {moments.map((moment, index) => (
            <motion.article
              key={moment.title}
              initial={{
                opacity: 0,
                y: 24,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: false,
                amount: 0.2,
              }}
              transition={{
                duration: 0.55,
                delay: index * 0.06,
              }}
              className={`group relative min-h-[180px] overflow-hidden rounded-[20px] sm:min-h-[280px] sm:rounded-[28px] ${moment.className}`}
            >
              <Image
                src={moment.image}
                alt={moment.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, 50vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#32090a]/75 via-transparent to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                <p className="font-serif text-xl text-white sm:text-3xl">
                  {moment.title}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-10 max-w-[700px] text-center font-serif text-xl italic leading-8 text-[var(--brand-primary)] sm:text-2xl"
        >
          Your moment. Your cheesecake. Your slice of happiness.
        </motion.p>
      </div>
    </section>
  );
}