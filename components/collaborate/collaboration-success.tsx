"use client";

import {
  Check,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  onReset: () => void;
};

export default function CollaborationSuccess({
  onReset,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
        y: 25,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.94,
        y: -15,
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative
        flex
        min-h-[520px]
        flex-col
        items-center
        justify-center
        overflow-hidden
        rounded-[32px]
        bg-[#510000]
        px-7
        py-16
        text-center

        sm:min-h-[560px]
      "
    >
      <motion.div
        initial={{
          scale: 0,
          rotate: -35,
        }}
        animate={{
          scale: 1,
          rotate: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 170,
          damping: 14,
          delay: 0.15,
        }}
        className="
          relative
          grid
          size-20
          place-items-center
          rounded-full
          bg-[#F3D7C8]
          text-[#510000]
        "
      >
        <motion.div
          initial={{
            scale: 0,
          }}
          animate={{
            scale: [0, 1.25, 1],
          }}
          transition={{
            duration: 0.45,
            delay: 0.42,
          }}
        >
          <Check size={34} strokeWidth={2} />
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: 0.5,
            scale: 1,
          }}
          transition={{
            duration: 0.5,
            delay: 0.55,
          }}
          className="absolute -right-8 -top-5"
        >
          <Heart
            size={25}
            strokeWidth={1}
          />
        </motion.div>
      </motion.div>

      <motion.p
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.4,
        }}
        className="
          mt-8
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.3em]
          text-[#F3D7C8]
        "
      >
        Enquiry Received
      </motion.p>

      <motion.h2
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.5,
        }}
        className="
          mt-4
          font-serif
          text-[42px]
          leading-[0.95]
          tracking-[-0.035em]
          text-white

          sm:text-5xl
        "
      >
        Something Sweet
        <span className="block text-[#F3D7C8]">
          Could Begin Here.
        </span>
      </motion.h2>

      <motion.p
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.65,
        }}
        className="
          mt-6
          max-w-[330px]
          text-sm
          leading-6
          text-white/65
        "
      >
        Thank you. Our team will review your collaboration enquiry
        and get in touch.
      </motion.p>

      <motion.button
        type="button"
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.75,
        }}
        whileTap={{
          scale: 0.96,
        }}
        onClick={onReset}
        className="
          mt-8
          cursor-pointer
          rounded-full
          border
          border-white/20
          px-6
          py-3
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.14em]
          text-white
          transition-colors
          hover:bg-white/10
        "
      >
        Send Another
      </motion.button>

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          opacity: 0.08,
          scale: 1,
        }}
        transition={{
          duration: 1.2,
        }}
        className="
          pointer-events-none
          absolute
          -bottom-28
          -right-28
          size-[330px]
          rounded-full
          border
          border-white
        "
      />
    </motion.div>
  );
}