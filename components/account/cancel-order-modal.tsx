"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  Check,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";

type CancelOrderModalProps = {
  orderId: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => boolean;
};

export default function CancelOrderModal({
  orderId,
  open,
  onClose,
  onConfirm,
}: CancelOrderModalProps) {
  const [loading, setLoading] =
    useState(false);

  function handleClose() {
    if (loading) return;

    onClose();
  }

  function handleConfirm() {
    if (loading) return;

    setLoading(true);

    window.setTimeout(() => {
      const success = onConfirm();

      if (!success) {
        setLoading(false);
      }
    }, 700);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.25,
          }}
          onClick={handleClose}
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-end
            justify-center
            bg-black/45
            p-3
            backdrop-blur-[3px]

            sm:items-center
            sm:p-5
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 70,
              scale: 0.94,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 50,
              scale: 0.96,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              w-full
              max-w-[440px]
              rounded-[28px]
              bg-[var(--brand-background)]
              p-6
              shadow-[0_30px_100px_rgba(0,0,0,0.25)]

              sm:p-7
            "
          >
            <div className="flex items-start justify-between gap-5">
              <motion.div
                initial={{
                  scale: 0,
                  rotate: -15,
                }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  stiffness: 240,
                  damping: 18,
                }}
                className="
                  grid
                  size-12
                  place-items-center
                  rounded-full
                  bg-red-50
                  text-red-700
                "
              >
                <XCircle size={21} />
              </motion.div>

              <button
                type="button"
                disabled={loading}
                onClick={handleClose}
                aria-label="Close"
                className="
                  grid
                  size-9
                  cursor-pointer
                  place-items-center
                  rounded-full
                  text-[var(--brand-muted)]
                  transition

                  hover:bg-black/5
                  hover:text-[var(--brand-text-dark)]

                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <X size={17} />
              </button>
            </div>

            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.08,
                duration: 0.35,
              }}
            >
              <h3 className="mt-6 font-serif text-3xl text-[var(--brand-text-dark)]">
                Cancel this order?
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
                You&apos;re about to cancel{" "}
                <span className="font-semibold text-[var(--brand-text-dark)]">
                  {orderId}
                </span>
                . Once cancelled, this action
                cannot be undone.
              </p>
            </motion.div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={handleClose}
                className="
                  min-h-12
                  cursor-pointer
                  rounded-full
                  border
                  border-[var(--brand-border)]
                  px-4
                  text-xs
                  font-semibold
                  text-[var(--brand-text-dark)]
                  transition
                  duration-300

                  hover:border-[var(--brand-primary)]/30
                  hover:bg-white

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Keep order
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleConfirm}
                className="
                  relative
                  min-h-12
                  cursor-pointer
                  overflow-hidden
                  rounded-full
                  bg-red-700
                  px-4
                  text-xs
                  font-semibold
                  text-white
                  transition
                  duration-300

                  hover:bg-red-800

                  disabled:cursor-wait
                "
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.span
                      key="loading"
                      initial={{
                        opacity: 0,
                        y: 6,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -6,
                      }}
                      className="inline-flex items-center gap-2"
                    >
                      <span
                        className="
                          size-3.5
                          animate-spin
                          rounded-full
                          border-2
                          border-white/30
                          border-t-white
                        "
                      />

                      Cancelling...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="cancel"
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                    >
                      Cancel order
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CancellationSuccess({
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
            y: 30,
            scale: 0.94,
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
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            fixed
            bottom-[calc(6.5rem+env(safe-area-inset-bottom))]
            left-4
            right-4
            z-[120]

            sm:bottom-6
            sm:left-auto
            sm:right-6
            sm:w-[360px]
          "
        >
          <div
            className="
              flex
              items-center
              gap-4
              rounded-[22px]
              border
              border-[var(--brand-border)]
              bg-white
              p-4
              shadow-[0_20px_60px_rgba(81,0,0,0.16)]
            "
          >
            <motion.div
              initial={{
                scale: 0,
                rotate: -20,
              }}
              animate={{
                scale: 1,
                rotate: 0,
              }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 250,
                damping: 18,
              }}
              className="
                grid
                size-11
                shrink-0
                place-items-center
                rounded-full
                bg-[var(--brand-primary)]
                text-white
              "
            >
              <Check
                size={19}
                strokeWidth={2.2}
              />
            </motion.div>

            <div>
              <p className="text-sm font-semibold text-[var(--brand-text-dark)]">
                Order cancelled
              </p>

              <p className="mt-1 text-xs leading-5 text-[var(--brand-muted)]">
                Your order has been cancelled
                successfully.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}