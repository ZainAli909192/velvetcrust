"use client";

import Link from "next/link";

import {
  ChevronRight,
  CreditCard,
  PackageCheck,
  XCircle,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

export default function OrderSummary({
  subtotal,
  deliveryFee,
  total,
  paymentMethod,
  paymentStatus,
  status,
}: {
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
}) {
  const cancelled =
    status.toLowerCase() ===
    "cancelled";

  return (
    <motion.aside
      initial={{
        opacity: 0,
        x: 30,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.6,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="
        rounded-[26px]
        border
        border-[var(--brand-border)]
        bg-white
        p-6
        shadow-[0_18px_50px_rgba(81,0,0,0.04)]

        lg:sticky
        lg:top-8
      "
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
        Summary
      </p>

      <h2 className="mt-2 font-serif text-2xl text-[var(--brand-text-dark)]">
        Order total
      </h2>

      <div className="mt-6 space-y-4">
        <SummaryRow
          label="Subtotal"
          value={
            subtotal
          }
        />

        <SummaryRow
          label="Delivery"
          value={
            deliveryFee
          }
        />
      </div>

      <div className="mt-6 border-t border-[var(--brand-border)] pt-5">
        <div className="flex items-end justify-between gap-4">
          <span className="text-sm font-medium text-[var(--brand-text-dark)]">
            Total
          </span>

          <span className="font-serif text-3xl text-[var(--brand-primary)]">
            AED{" "}
            {Number(
              total
            ).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-6 border-t border-[var(--brand-border)] pt-5">
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
            <CreditCard
              size={16}
            />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">
              Payment
            </p>

            <p className="mt-1 text-sm font-medium capitalize text-[var(--brand-text-dark)]">
              {formatPaymentMethod(
                paymentMethod
              )}
            </p>

            <p className="mt-1 text-xs capitalize text-[var(--brand-muted)]">
              {
                paymentStatus
              }
            </p>
          </div>
        </div>
      </div>

      <div
        className={`
          mt-6
          flex
          items-center
          gap-3
          rounded-[16px]
          px-4
          py-3

          ${
            cancelled
              ? "bg-red-50 text-red-700"
              : "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"
          }
        `}
      >
        {cancelled ? (
          <XCircle
            size={17}
          />
        ) : (
          <PackageCheck
            size={17}
          />
        )}

        <p className="text-xs font-medium">
          {cancelled
            ? "Order cancelled"
            : "Order received successfully"}
        </p>
      </div>

      <Link
        href="/#cheesecakes"
        className="
          group
          mt-6
          flex
          min-h-12
          w-full
          items-center
          justify-between
          rounded-full
          border
          border-[var(--brand-border)]
          px-5
          text-xs
          font-semibold
          text-[var(--brand-primary)]
          transition

          hover:border-[var(--brand-primary)]
        "
      >
        Order again

        <ChevronRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </motion.aside>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-[var(--brand-muted)]">
        {label}
      </span>

      <span className="text-sm font-medium text-[var(--brand-text-dark)]">
        AED{" "}
        {Number(
          value
        ).toFixed(2)}
      </span>
    </div>
  );
}

function formatPaymentMethod(
  method: string
) {
  switch (
    method.toLowerCase()
  ) {
    case "card":
      return "Credit / Debit Card";

    case "tabby":
      return "Tabby";

    case "tamara":
      return "Tamara";

    default:
      return method;
  }
}