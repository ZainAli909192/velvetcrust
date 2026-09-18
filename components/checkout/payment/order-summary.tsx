import Image from "next/image";

import {
  useCart,
} from "@/components/store/cart-context";

export default function OrderSummary({
  items,
  subtotal,
  totalItems,
}: {
  items: ReturnType<
    typeof useCart
  >["items"];

  subtotal: number;
  totalItems: number;
}) {
  return (
    <aside className="rounded-[28px] border border-[var(--brand-border)] bg-white p-6 lg:sticky lg:top-[120px]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--brand-primary)]">
        Order summary ·{" "}
        {totalItems}{" "}
        {totalItems === 1
          ? "item"
          : "items"}
      </p>

      <div className="mt-5 max-h-[330px] space-y-4 overflow-auto pr-1">
        {items.map(
          (item) => (
            <div
              key={item.id}
              className="flex gap-3 border-b border-[var(--brand-border)] pb-4 last:border-0"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[var(--brand-primary-soft)]">
                <Image
                  src={
                    item.image
                  }
                  alt={
                    item.name
                  }
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-base text-[var(--brand-text-dark)]">
                  {item.name}
                </p>

                <p className="mt-1 text-xs text-[var(--brand-muted)]">
                  Qty{" "}
                  {item.quantity}
                </p>
              </div>

              <p className="text-sm font-semibold text-[var(--brand-text-dark)]">
                AED{" "}
                {(
                  item.price *
                  item.quantity
                ).toFixed(2)}
              </p>
            </div>
          )
        )}
      </div>

      <div className="mt-5 space-y-3 border-t border-[var(--brand-border)] pt-5 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--brand-muted)]">
            Subtotal
          </span>

          <span>
            AED{" "}
            {subtotal.toFixed(
              2
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[var(--brand-muted)]">
            Delivery
          </span>

          <span className="text-[var(--brand-muted)]">
            Confirmed by phone
          </span>
        </div>

        <div className="flex justify-between border-t border-[var(--brand-border)] pt-4">
          <span className="font-serif text-xl">
            Total
          </span>

          <span className="text-xl font-bold text-[var(--brand-primary)]">
            AED{" "}
            {subtotal.toFixed(
              2
            )}
          </span>
        </div>
      </div>
    </aside>
  );
}