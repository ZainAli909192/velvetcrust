"use client";

import {
  LoaderCircle,
  TriangleAlert,
  X,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

type CancelOrderModalProps = {
  open: boolean;

  isLoading?: boolean;

  error?: string;

  onClose: () => void;

  onConfirm: () =>
    void | Promise<void>;
};

export default function CancelOrderModal({
  open,
  isLoading = false,
  error = "",
  onClose,
  onConfirm,
}: CancelOrderModalProps) {
  function handleClose() {
    if (isLoading) {
      return;
    }

    onClose();
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 backdrop-blur-[3px]"
          onMouseDown={
            handleClose
          }
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 15,
              scale: 0.97,
            }}
            transition={{
              duration: 0.25,
            }}
            onMouseDown={(
              event
            ) =>
              event.stopPropagation()
            }
            className="relative w-full max-w-[440px] rounded-[26px] bg-white p-6 shadow-2xl sm:p-7"
          >
            <button
              type="button"
              disabled={
                isLoading
              }
              onClick={
                handleClose
              }
              className="absolute right-5 top-5 grid size-9 cursor-pointer place-items-center rounded-full text-[var(--brand-muted)] transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close"
            >
              <X
                size={17}
              />
            </button>

            <div className="grid size-12 place-items-center rounded-full bg-red-50 text-red-700">
              <TriangleAlert
                size={20}
              />
            </div>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-700">
              Cancel order
            </p>

            <h2 className="mt-2 font-serif text-3xl text-[var(--brand-text-dark)]">
              Are you sure?
            </h2>

            <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
              Once cancelled,
              this order will no
              longer be processed.
            </p>

            {error && (
              <div className="mt-5 rounded-[14px] bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
                {error}
              </div>
            )}

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={
                  isLoading
                }
                onClick={
                  handleClose
                }
                className="min-h-12 cursor-pointer rounded-full border border-[var(--brand-border)] px-5 text-xs font-semibold text-[var(--brand-text-dark)] transition hover:border-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep order
              </button>

              <button
                type="button"
                disabled={
                  isLoading
                }
                onClick={() => {
                  void onConfirm();
                }}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-red-700 px-5 text-xs font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading && (
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                  />
                )}

                {isLoading
                  ? "Cancelling..."
                  : "Cancel order"}
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
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 15,
          }}
          className="fixed bottom-24 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-[var(--brand-text-dark)] px-5 py-3 text-xs font-semibold text-white shadow-xl lg:bottom-8"
        >
          Order cancelled successfully
        </motion.div>
      )}
    </AnimatePresence>
  );
}