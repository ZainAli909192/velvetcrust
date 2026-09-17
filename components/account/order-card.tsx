"use client";

import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  Package,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import OrderStatus from "./order-status";

type Order = {
  orderNumber: string;

  items: Array<{
    name: string;
    image: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;

  itemCount: number;

  subtotal: number;
  deliveryFee: number;
  total: number;

  paymentMethod: string;
  paymentStatus: string;
  status: string;

  createdAt: string;
};

export default function OrderCard({
  order,
  index,
}: {
  order: Order;
  index: number;
}) {
  const createdAt =
    new Date(
      order.createdAt
    );

  const isValidDate =
    !Number.isNaN(
      createdAt.getTime()
    );

  const date =
    isValidDate
      ? new Intl.DateTimeFormat(
          "en-AE",
          {
            dateStyle:
              "medium",
          }
        ).format(
          createdAt
        )
      : "Date unavailable";

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 25,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: false,
        amount: 0.2,
      }}
      transition={{
        duration: 0.5,
        delay:
          index * 0.05,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="
        rounded-[24px]
        border
        border-[var(--brand-border)]
        bg-white
        p-5
        shadow-[0_12px_35px_rgba(81,0,0,0.035)]

        sm:p-6
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--brand-muted)]">
            Order
          </p>

          <h2 className="mt-1 truncate font-serif text-xl text-[var(--brand-text-dark)]">
            {order.orderNumber}
          </h2>
        </div>

        <OrderStatus
          status={
            order.status
          }
        />
      </div>

      <div
        className="
          mt-6
          grid
          grid-cols-2
          gap-4
          border-y
          border-[var(--brand-border)]
          py-4

          sm:grid-cols-3
        "
      >
        <div className="flex items-center gap-2">
          <CalendarDays
            size={16}
            className="shrink-0 text-[var(--brand-primary)]"
          />

          <span className="text-xs text-[var(--brand-muted)]">
            {date}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Package
            size={16}
            className="shrink-0 text-[var(--brand-primary)]"
          />

          <span className="text-xs text-[var(--brand-muted)]">
            {order.itemCount}{" "}
            {order.itemCount ===
            1
              ? "item"
              : "items"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CreditCard
            size={16}
            className="shrink-0 text-[var(--brand-primary)]"
          />

          <span className="text-xs capitalize text-[var(--brand-muted)]">
            {
              order.paymentStatus
            }
          </span>
        </div>
      </div>

      {order.items.length >
        0 && (
        <div className="mt-5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--brand-muted)]">
            Items
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {order.items.map(
              (
                item,
                itemIndex
              ) => (
                <span
                  key={`${order.orderNumber}-${item.name}-${itemIndex}`}
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    bg-[var(--brand-primary-soft)]
                    px-3
                    py-1.5
                    text-[10px]
                    font-medium
                    text-[var(--brand-primary)]
                  "
                >
                  {item.name}

                  {item.quantity >
                    1 && (
                    <span className="ml-1 opacity-70">
                      ×{" "}
                      {
                        item.quantity
                      }
                    </span>
                  )}
                </span>
              )
            )}
          </div>
        </div>
      )}

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--brand-muted)]">
            Total
          </p>

          <p className="mt-1 font-serif text-xl text-[var(--brand-primary)]">
            AED{" "}
            {Number(
              order.total
            ).toFixed(2)}
          </p>
        </div>

        <Link
          href={`/account/orders/${encodeURIComponent(
            order.orderNumber
          )}`}
          className="
            inline-flex
            min-h-11
            shrink-0
            items-center
            gap-2
            rounded-full
            bg-[var(--brand-primary)]
            px-5
            text-xs
            font-semibold
            text-white
            transition
            duration-300

            hover:-translate-y-0.5
            hover:opacity-90
          "
        >
          View Order

          <ArrowRight
            size={15}
          />
        </Link>
      </div>
    </motion.article>
  );
}