import {
  CheckCircle2,
} from "lucide-react";

import Button from "@/components/ui/button";

export default function PaymentSuccess({
  orderNumber,
}: {
  orderNumber: string;
}) {
  return (
    <section className="min-h-[70vh] bg-[var(--brand-background)] px-5 py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
          <CheckCircle2
            size={36}
            strokeWidth={1.6}
          />
        </div>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--brand-primary)]">
          Order received
        </p>

        <h1 className="mt-2 font-serif text-4xl text-[var(--brand-text-dark)] sm:text-5xl">
          Thank you.
        </h1>

        {orderNumber && (
          <div className="mt-5 rounded-2xl bg-[var(--brand-primary-soft)] px-6 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-muted)]">
              Order number
            </p>

            <p className="mt-1 font-semibold text-[var(--brand-primary)]">
              {orderNumber}
            </p>
          </div>
        )}

        <p className="mt-5 max-w-md text-sm leading-7 text-[var(--brand-muted)]">
          Your Velvet Crust order has been received successfully.
          We&apos;ll send your order details to your email shortly.
        </p>

        <Button
          href="/#cheesecakes"
          size="lg"
          className="mt-8"
        >
          Continue shopping
        </Button>
      </div>
    </section>
  );
}