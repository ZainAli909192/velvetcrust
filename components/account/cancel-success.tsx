"use client";

import { Check } from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

export default function CancelSuccess({
  show,
}: {
  show: boolean;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 15,
          }}
          className="
            fixed
            bottom-28
            left-1/2
            z-[120]
            flex
            -translate-x-1/2
            items-center
            gap-3
            whitespace-nowrap
            rounded-full
            bg-[var(--brand-text-dark)]
            px-5
            py-3
            text-xs
            font-semibold
            text-white
            shadow-[0_15px_45px_rgba(0,0,0,0.2)]

            lg:bottom-8
          "
        >
          <span className="grid size-6 place-items-center rounded-full bg-white/15">
            <Check size={13} />
          </span>

          Order cancelled successfully
        </motion.div>
      )}
    </AnimatePresence>
  );
}