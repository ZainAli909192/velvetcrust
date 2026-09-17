"use client";

import {
  Check,
  Clock3,
  PackageCheck,
  X,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

const steps = [
  {
    title: "Confirmed",
    icon: Check,
  },
  {
    title: "Processing",
    icon: Clock3,
  },
  {
    title: "Delivered",
    icon: PackageCheck,
  },
];

export default function OrderProgress({
  status,
}: {
  status: string;
}) {
  const normalized =
    status.toLowerCase();

  const cancelled =
    normalized ===
    "cancelled";

  const pending =
    normalized ===
    "pending";

  const activeIndex =
    normalized ===
    "delivered"
      ? 2
      : normalized ===
          "processing"
        ? 1
        : normalized ===
            "confirmed"
          ? 0
          : -1;

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
    >
      <SectionHeading
        eyebrow="Order status"
        title={
          cancelled
            ? "Order cancelled"
            : pending
              ? "Order received"
              : "Your order journey"
        }
      />

      {cancelled ? (
        <div className="mt-5 flex items-center gap-4 rounded-[22px] border border-red-100 bg-red-50/60 p-5">
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-red-100 text-red-700">
            <X size={18} />
          </div>

          <div>
            <p className="font-semibold text-red-800">
              This order is cancelled
            </p>

            <p className="mt-1 text-xs leading-5 text-red-700/70">
              No further processing will take place.
            </p>
          </div>
        </div>
      ) : pending ? (
        <div className="mt-5 flex items-center gap-4 rounded-[22px] border border-[var(--brand-border)] bg-white p-5">
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
            <Clock3
              size={18}
            />
          </div>

          <div>
            <p className="font-semibold text-[var(--brand-text-dark)]">
              Order received
            </p>

            <p className="mt-1 text-xs leading-5 text-[var(--brand-muted)]">
              Your order is awaiting confirmation.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-3">
          {steps.map(
            (
              {
                title,
                icon: Icon,
              },
              index
            ) => {
              const active =
                index <=
                activeIndex;

              return (
                <div
                  key={title}
                  className="relative"
                >
                  {index <
                    steps.length -
                      1 && (
                    <div
                      className={`
                        absolute
                        left-1/2
                        top-5
                        h-px
                        w-full

                        ${
                          index <
                          activeIndex
                            ? "bg-[var(--brand-primary)]"
                            : "bg-[var(--brand-border)]"
                        }
                      `}
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`
                        grid
                        size-10
                        place-items-center
                        rounded-full
                        border

                        ${
                          active
                            ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                            : "border-[var(--brand-border)] bg-[var(--brand-background)] text-[var(--brand-muted)]"
                        }
                      `}
                    >
                      <Icon
                        size={16}
                        strokeWidth={
                          1.8
                        }
                      />
                    </div>

                    <p
                      className={`
                        mt-3
                        text-center
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.06em]

                        sm:text-[10px]

                        ${
                          active
                            ? "text-[var(--brand-primary)]"
                            : "text-[var(--brand-muted)]"
                        }
                      `}
                    >
                      {title}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </motion.section>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
        {eyebrow}
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[var(--brand-text-dark)]">
        {title}
      </h2>
    </div>
  );
}