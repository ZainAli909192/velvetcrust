"use client";

import Image from "next/image";

import {
  ShoppingBag,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import type {
  OrderItem,
} from "../order-details";

export default function OrderedItems({
  items,
}: {
  items: OrderItem[];
}) {
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
      className="border-t border-[var(--brand-border)] pt-8"
    >
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
        Your order
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[var(--brand-text-dark)]">
        Ordered items
      </h2>

      <div className="mt-5 divide-y divide-[var(--brand-border)]">
        {items.map(
          (
            item,
            index
          ) => (
            <OrderItemRow
              key={`${item.productId ?? item.name}-${index}`}
              item={item}
            />
          )
        )}
      </div>
    </motion.section>
  );
}

function OrderItemRow({
  item,
}: {
  item: OrderItem;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <div className="flex min-w-0 items-center gap-4">
        {item.image ? (
          <div className="relative size-16 shrink-0 overflow-hidden rounded-[16px] bg-[var(--brand-primary-soft)]">
            <Image
              src={
                item.image
              }
              alt={
                item.name
              }
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="grid size-16 shrink-0 place-items-center rounded-[16px] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
            <ShoppingBag
              size={20}
            />
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate font-serif text-lg text-[var(--brand-text-dark)]">
            {item.name}
          </p>

          <p className="mt-1 text-xs text-[var(--brand-muted)]">
            AED{" "}
            {Number(
              item.unitPrice
            ).toFixed(2)}
            {" · "}
            Qty{" "}
            {
              item.quantity
            }
          </p>
        </div>
      </div>

      <p className="shrink-0 text-sm font-semibold text-[var(--brand-primary)]">
        AED{" "}
        {Number(
          item.totalPrice
        ).toFixed(2)}
      </p>
    </div>
  );
}