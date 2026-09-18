import {
  ShoppingBag,
} from "lucide-react";

import Button from "@/components/ui/button";

export function EmptyCartState() {
  return (
    <section className="min-h-[70vh] bg-[var(--brand-background)] px-5 py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <ShoppingBag
          size={40}
          strokeWidth={1.4}
          className="text-[var(--brand-primary)]"
        />

        <h1 className="mt-5 font-serif text-4xl text-[var(--brand-text-dark)]">
          Your cart is empty.
        </h1>

        <p className="mt-3 text-sm text-[var(--brand-muted)]">
          Add an item before choosing a payment method.
        </p>

        <Button
          href="/#cheesecakes"
          size="lg"
          className="mt-7"
        >
          Browse cheesecakes
        </Button>
      </div>
    </section>
  );
}

export function MissingDeliveryState({
  href,
}: {
  href: string;
}) {
  return (
    <section className="min-h-[70vh] bg-[var(--brand-background)] px-5 py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <ShoppingBag
          size={40}
          strokeWidth={1.4}
          className="text-[var(--brand-primary)]"
        />

        <h1 className="mt-5 font-serif text-4xl text-[var(--brand-text-dark)]">
          Delivery details required.
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-[var(--brand-muted)]">
          Complete your delivery information before choosing a payment method.
        </p>

        <Button
          href={href}
          size="lg"
          className="mt-7"
        >
          Complete delivery details
        </Button>
      </div>
    </section>
  );
}