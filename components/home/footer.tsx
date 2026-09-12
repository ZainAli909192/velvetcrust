"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AtSign,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";

import { contactDetails } from "@/lib/contact";
import {
  fadeUp,
  staggerContainer,
} from "@/lib/animations";

export default function Footer() {
  return (
    <footer
      className="
        relative
        overflow-hidden
        bg-[var(--brand-background)]
        px-4
        pb-3
        pt-2
        sm:px-8
        lg:pb-2
        lg:pt-2
      "
    >
      {/* Primary Background */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[105%]
          w-full
          -translate-x-1/2
          -translate-y-1/2
          bg-[var(--brand-primary)]
        "
      />

      {/* Footer Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: false,
          amount: 0.25,
        }}
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[500px]
          max-w-[900px]
          flex-col
          items-center
          justify-center

          sm:min-h-[540px]

          lg:min-h-[600px]
          lg:py-20
        "
      >
        {/* Logo */}
        <motion.div
          variants={fadeUp}
          className="flex justify-center"
        >
          <Link href="/" aria-label="Velvet Crust Home">
            <Image
              src="/images/white_logo.png"
              alt="Velvet Crust"
              width={140}
              height={140}
              className="
                h-[95px]
                w-[95px]
                rounded-full
                object-center
                transition-transform
                duration-500
                hover:scale-105

                sm:h-[110px]
                sm:w-[110px]

                lg:h-[125px]
                lg:w-[125px]
              "
            />
          </Link>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          className="
            mt-5
            text-center
            font-serif
            text-xl
            text-white

            sm:text-2xl
            lg:text-[28px]
          "
        >
          A Slice of Happiness
        </motion.p>

        {/* Social + Contact */}
        <motion.div
          variants={fadeUp}
          className="
            mx-auto
            mt-9
            flex
            w-full
            max-w-[760px]
            flex-wrap
            items-center
            justify-center
            gap-x-8
            gap-y-5
            border-y
            border-white/20
            py-6

            sm:gap-x-10
            lg:gap-x-12
          "
        >
          {/* Instagram */}
          <motion.a
            whileHover={{
              y: -3,
            }}
            transition={{
              duration: 0.2,
            }}
            href={contactDetails.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Velvet Crust on Instagram"
            className="
              flex
              items-center
              gap-2
              text-sm
              text-white/70
              transition-colors
              duration-300
              hover:text-white
            "
          >
            <AtSign
              size={18}
              strokeWidth={1.6}
            />

            <span>Instagram</span>
          </motion.a>

          {/* WhatsApp */}
          <motion.a
            whileHover={{
              y: -3,
            }}
            transition={{
              duration: 0.2,
            }}
            href={`${contactDetails.whatsapp.href}?text=${encodeURIComponent(
              "Hi Velvet Crust, I would like to know more about your cheesecakes."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact Velvet Crust on WhatsApp"
            className="
              flex
              items-center
              gap-2
              text-sm
              text-white/70
              transition-colors
              duration-300
              hover:text-white
            "
          >
            <MessageCircle
              size={18}
              strokeWidth={1.6}
            />

            <span>WhatsApp</span>
          </motion.a>

          {/* Phone */}
          <motion.a
            whileHover={{
              y: -3,
            }}
            transition={{
              duration: 0.2,
            }}
            href={contactDetails.phone.href}
            aria-label={`Call Velvet Crust at ${contactDetails.phone.display}`}
            className="
              flex
              items-center
              gap-2
              text-sm
              text-white/70
              transition-colors
              duration-300
              hover:text-white
            "
          >
            <Phone
              size={18}
              strokeWidth={1.6}
            />

            <span>{contactDetails.phone.display}</span>
          </motion.a>

          {/* Email */}
          <motion.a
            whileHover={{
              y: -3,
            }}
            transition={{
              duration: 0.2,
            }}
            href={contactDetails.email.href}
            aria-label={`Email Velvet Crust at ${contactDetails.email.display}`}
            className="
              flex
              items-center
              gap-2
              text-sm
              text-white/70
              transition-colors
              duration-300
              hover:text-white
            "
          >
            <Mail
              size={18}
              strokeWidth={1.6}
            />

            <span>{contactDetails.email.display}</span>
          </motion.a>
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={fadeUp}
          className="pt-4 text-center"
        >
          <p
            className="
              text-[9px]
              uppercase
              tracking-[0.16em]
              text-white/50

              sm:text-[11px]
            "
          >
            © 2026 Velvet Crust · All Rights Reserved
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}