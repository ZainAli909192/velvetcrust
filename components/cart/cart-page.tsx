"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import Button from "@/components/ui/button";
import GuestCheckoutModal from "@/components/checkout/guest-checkout-modal";

import { useCart } from "@/components/store/cart-context";
import { useAuth } from "@/components/store/auth-context";

export default function CartPage() {
  const router = useRouter();

  const { user } = useAuth();

  const {
    items,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [guestModalOpen, setGuestModalOpen] =
    useState(false);

  function handleCheckout() {
    if (user) {
      router.push("/checkout");
      return;
    }

    setGuestModalOpen(true);
  }

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] bg-[var(--brand-background)] px-5 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
            <ShoppingBag
              size={30}
              strokeWidth={1.5}
            />
          </div>

          <h1 className="mt-6 font-serif text-4xl text-[var(--brand-text-dark)]">
            Your Cart Is Empty.
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--brand-muted)]">
            Your next slice of happiness is waiting.
          </p>

          <Button
            href="/#cheesecakes"
            variant="primary"
            size="lg"
            iconRight={<ArrowRight size={16} />}
            className="mt-7"
          >
            View Cheesecakes
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-[var(--brand-background)] px-4 pb-32 pt-8 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12">
        <div className="mx-auto max-w-[1300px]">
          <Link
            href="/#cheesecakes"
            className="inline-flex items-center gap-2 text-sm text-[var(--brand-muted)] transition hover:text-[var(--brand-primary)]"
          >
            <ArrowLeft size={16} />

            Continue Shopping
          </Link>

          <div className="mt-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              Velvet Crust
            </p>

            <h1 className="mt-2 font-serif text-4xl text-[var(--brand-text-dark)] sm:text-5xl">
              Your Cart
            </h1>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_390px]">
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="
                    grid
                    grid-cols-[100px_1fr]
                    gap-4
                    rounded-[24px]
                    border
                    border-[var(--brand-border)]
                    bg-white
                    p-4

                    sm:grid-cols-[150px_1fr]
                    sm:p-5
                  "
                >
                  <div className="relative aspect-square overflow-hidden rounded-[18px] bg-[var(--brand-primary-soft)]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                      sizes="150px"
                    />
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <h2 className="font-serif text-lg text-[var(--brand-text-dark)] sm:text-2xl">
                        {item.name}
                      </h2>

                      <p className="mt-1 hidden text-sm text-[var(--brand-muted)] sm:block">
                        {item.description}
                      </p>

                      <p className="mt-2 font-semibold text-[var(--brand-primary)]">
                        AED {item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-[var(--brand-border)]">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                          className="h-9 w-9"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </Button>

                        <span className="min-w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                          className="h-9 w-9"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </Button>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeItem(item.id)
                        }
                        iconLeft={<Trash2 size={14} />}
                        className="px-3 text-[var(--brand-muted)]"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </article>
              ))}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-[var(--brand-muted)] underline underline-offset-4"
              >
                Clear Cart
              </Button>
            </div>

            <aside className="lg:sticky lg:top-[120px] lg:self-start">
              <div className="rounded-[28px] border border-[var(--brand-border)] bg-white p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--brand-primary)]">
                  Order Summary
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--brand-muted)]">
                      Subtotal
                    </span>

                    <span className="font-semibold text-[var(--brand-text-dark)]">
                      AED {subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--brand-muted)]">
                      Delivery
                    </span>

                    <span className="text-[var(--brand-muted)]">
                      Calculated next
                    </span>
                  </div>

                  <div className="border-t border-[var(--brand-border)] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xl text-[var(--brand-text-dark)]">
                        Total
                      </span>

                      <span className="text-xl font-bold text-[var(--brand-primary)]">
                        AED {subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleCheckout}
                  variant="primary"
                  size="lg"
                  fullWidth
                  iconRight={<ArrowRight size={16} />}
                  className="mt-7"
                >
                  Continue to Checkout
                </Button>

                <p className="mt-4 text-center text-[10px] leading-5 text-[var(--brand-muted)]">
                  Sign in or continue as guest to
                  complete your order.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <GuestCheckoutModal
        open={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
      />
    </>
  );
}