"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

import AuthPanel from "./auth-panel";

type Cheesecake = {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
};

type Props = {
  cheesecake: Cheesecake;
};

export default function OrderCheckout({
  cheesecake,
}: Props) {
  return (
    <section className=" mt-10 min-h-[60vh] px-4 pb-28 bg-white pt-20 sm:px-8 lg:px-12 lg:pb-16">
      <div className="mx-auto max-w-[1450px]">
        {/* Top */}
        <div className="flex items-center justify-between border-b border-[var(--brand-border)] pb-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[var(--brand-muted)] transition hover:text-[var(--brand-primary)]"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>

          <p className="hidden text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--brand-primary)] sm:block">
            Secure Checkout
          </p>
        </div>

        {/* Heading */}
        <div className="hidden  py-8 lg:py-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--brand-primary)]">
            Velvet Crust
          </p>

          <h1 className="mt-2 font-serif text-4xl leading-tight text-[var(--brand-text-dark)] sm:text-5xl">
            Complete your order.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--brand-muted)]">
            Sign in or create your account to continue with delivery
            and payment.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start xl:gap-14">
          {/* LEFT */}
          <div className="order-2 lg:order-1">
            <p className="mb-5 text-center text-sm text-[var(--brand-muted)]">Sign in to continue with {cheesecake.name}.</p>
            <AuthPanel />
          </div>

         
        </div>

        {/* Steps */}
        <div className="mt-12 hidden items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--brand-muted)] lg:flex">
          <span className="text-[var(--brand-primary)]">
            Account
          </span>

          <ChevronRight size={13} />

          <span>Delivery</span>

          <ChevronRight size={13} />

          <span>Review</span>

          <ChevronRight size={13} />

          <span>Payment</span>
        </div>
      </div>
    </section>
  );
}
