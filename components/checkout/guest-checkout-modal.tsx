"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ArrowRight,
  Check,
  LogIn,
  UserRound,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

type GuestCheckoutModalProps = {
  open: boolean;
  onClose: () => void;
};

const benefits = [
  "No account required",
  "Quick & secure checkout",
  "Order updates by email",
];

export default function GuestCheckoutModal({
  open,
  onClose,
}: GuestCheckoutModalProps) {
  const router = useRouter();

  function handleSignIn() {
    onClose();
    router.push("/account/login?redirect=/checkout");
  }

  function handleGuestCheckout() {
    onClose();
    router.push("/checkout?mode=guest");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close checkout options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="
              fixed
              inset-0
              z-[100]
              cursor-default
              bg-[#210405]/45
              backdrop-blur-[3px]
            "
          />

          <div
            className="
              pointer-events-none
              fixed
              inset-0
              z-[101]
              flex
              items-end
              justify-center

              sm:items-center
              sm:px-5
            "
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-choice-title"
              initial={{
                opacity: 0,
                y: 70,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 50,
                scale: 0.98,
              }}
              transition={{
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                pointer-events-auto
                relative
                w-full
                overflow-hidden
                rounded-t-[32px]
                bg-[#FFF7EA]
                px-6
                pb-[calc(28px+env(safe-area-inset-bottom))]
                pt-5
                shadow-[0_-20px_70px_rgba(35,5,5,0.2)]

                sm:max-w-[520px]
                sm:rounded-[32px]
                sm:px-8
                sm:pb-8
                sm:pt-7
              "
            >
              <div
                className="
                  mx-auto
                  mb-5
                  h-1
                  w-10
                  rounded-full
                  bg-[#510000]/15

                  sm:hidden
                "
              />

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="
                  absolute
                  right-5
                  top-5
                  hidden
                  size-10
                  cursor-pointer
                  place-items-center
                  rounded-full
                  bg-[#510000]/[0.06]
                  text-[#510000]
                  transition-colors

                  hover:bg-[#510000]/10

                  sm:grid
                "
              >
                <X size={18} />
              </button>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.12,
                  duration: 0.45,
                }}
              >
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.28em]
                    text-[#8A3336]
                  "
                >
                  Almost there
                </p>

                <h2
                  id="checkout-choice-title"
                  className="
                    mt-3
                    max-w-[380px]
                    font-serif
                    text-[34px]
                    leading-[1]
                    tracking-[-0.035em]
                    text-[#510000]

                    sm:text-[42px]
                  "
                >
                  How would you like to continue?
                </h2>

                <p
                  className="
                    mt-3
                    max-w-[390px]
                    text-[13px]
                    leading-6
                    text-[#735B56]
                  "
                >
                  Sign in for a faster experience or continue
                  without creating an account.
                </p>
              </motion.div>

              <div className="mt-7 space-y-3">
                <motion.button
                  type="button"
                  onClick={handleSignIn}
                  initial={{
                    opacity: 0,
                    x: -25,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.18,
                    duration: 0.45,
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    group
                    flex
                    w-full
                    cursor-pointer
                    items-center
                    gap-4
                    rounded-[22px]
                    border
                    border-[#510000]/10
                    bg-white
                    p-4
                    text-left
                    shadow-[0_8px_30px_rgba(81,0,0,0.04)]
                    transition-all
                    duration-300

                    hover:border-[#510000]/20
                    hover:shadow-[0_12px_35px_rgba(81,0,0,0.08)]

                    sm:p-5
                  "
                >
                  <span
                    className="
                      grid
                      size-12
                      shrink-0
                      place-items-center
                      rounded-full
                      bg-[#510000]/[0.06]
                      text-[#721C20]
                    "
                  >
                    <LogIn
                      size={20}
                      strokeWidth={1.6}
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className="
                        block
                        text-sm
                        font-semibold
                        text-[#510000]
                      "
                    >
                      Sign In
                    </span>

                    <span
                      className="
                        mt-1
                        block
                        text-[11px]
                        text-[#765E59]/70
                      "
                    >
                      Access your account and saved details
                    </span>
                  </span>

                  <ArrowRight
                    size={18}
                    className="
                      shrink-0
                      text-[#510000]/50
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </motion.button>

                <div className="flex items-center gap-3 px-2">
                  <span className="h-px flex-1 bg-[#510000]/10" />

                  <span
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-[#765E59]/45
                    "
                  >
                    Or
                  </span>

                  <span className="h-px flex-1 bg-[#510000]/10" />
                </div>

                <motion.button
                  type="button"
                  onClick={handleGuestCheckout}
                  initial={{
                    opacity: 0,
                    x: 25,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.24,
                    duration: 0.45,
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    group
                    relative
                    flex
                    w-full
                    cursor-pointer
                    items-center
                    gap-4
                    overflow-hidden
                    rounded-[22px]
                    bg-[#510000]
                    p-4
                    text-left
                    text-white
                    shadow-[0_14px_35px_rgba(81,0,0,0.18)]

                    sm:p-5
                  "
                >
                  <span
                    className="
                      relative
                      z-10
                      grid
                      size-12
                      shrink-0
                      place-items-center
                      rounded-full
                      bg-white/10
                      text-[#F3D7C8]
                    "
                  >
                    <UserRound
                      size={20}
                      strokeWidth={1.6}
                    />
                  </span>

                  <span className="relative z-10 min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      Continue as Guest
                    </span>

                    <span className="mt-1 block text-[11px] text-white/60">
                      No account or registration required
                    </span>
                  </span>

                  <ArrowRight
                    size={18}
                    className="
                      relative
                      z-10
                      shrink-0
                      text-[#F3D7C8]
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-12
                      -top-14
                      size-40
                      rounded-full
                      border
                      border-white/[0.07]
                    "
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -bottom-20
                      -left-12
                      size-40
                      rounded-full
                      bg-[#F3D7C8]/[0.05]
                    "
                  />
                </motion.button>
              </div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.32,
                  duration: 0.4,
                }}
                className="
                  mt-6
                  flex
                  flex-wrap
                  gap-x-4
                  gap-y-2
                "
              >
                {benefits.map((item) => (
                  <div
                    key={item}
                    className="
                      flex
                      items-center
                      gap-1.5
                      text-[10px]
                      text-[#765E59]/65
                    "
                  >
                    <span
                      className="
                        grid
                        size-4
                        place-items-center
                        rounded-full
                        bg-[#510000]/[0.06]
                        text-[#721C20]
                      "
                    >
                      <Check
                        size={9}
                        strokeWidth={2}
                      />
                    </span>

                    {item}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}