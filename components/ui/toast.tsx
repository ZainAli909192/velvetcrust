"use client";

import {
  Check,
  CircleAlert,
  Info,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";

export type ToastType =
  | "success"
  | "error"
  | "info";

type ToastProps = {
  type: ToastType;
  title: string;
  message?: string;
  onClose: () => void;
};

export default function Toast({
  type,
  title,
  message,
  onClose,
}: ToastProps) {
  const icon =
    type === "success" ? (
      <Check size={17} strokeWidth={2.2} />
    ) : type === "error" ? (
      <CircleAlert size={17} strokeWidth={2} />
    ) : (
      <Info size={17} strokeWidth={2} />
    );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: 20,
        scale: 0.96,
      }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        flex
        w-full
        items-center
        gap-3
        rounded-[20px]
        border
        border-[var(--brand-border)]
        bg-[var(--brand-cream)]
        px-4
        py-3.5
        shadow-[0_16px_45px_rgba(50,23,22,0.18)]
        backdrop-blur-xl
      "
    >
      <div
        className={`
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full

          ${
            type === "success"
              ? "bg-[var(--brand-primary)] text-white"
              : ""
          }

          ${
            type === "error"
              ? "bg-red-100 text-red-700"
              : ""
          }

          ${
            type === "info"
              ? "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"
              : ""
          }
        `}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.15em]

            ${
              type === "error"
                ? "text-red-700"
                : "text-[var(--brand-primary)]"
            }
          `}
        >
          {title}
        </p>

        {message && (
          <p className="mt-0.5 truncate text-xs text-[var(--brand-muted)]">
            {message}
          </p>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onClose}
        aria-label="Close notification"
        className="
          h-8
          w-8
          shrink-0
          text-[var(--brand-muted)]
        "
      >
        <X size={15} />
      </Button>
    </motion.div>
  );
}
