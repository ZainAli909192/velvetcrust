"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useSearchParams,
} from "next/navigation";

import axios from "axios";

import {
  type FormEvent,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import {
  useCart,
} from "@/components/store/cart-context";

import {
  useAuth,
} from "@/components/store/auth-context";

import {
  useCheckout,
} from "@/components/store/checkout-context";

import Button from "@/components/ui/button";
import AuthPanel from "@/components/order/auth-panel";

type PaymentMethod =
  | "card"
  | "tabby"
  | "tamara";

type CreateOrderResponse = {
  success: boolean;
  message: string;
  duplicate?: boolean;

  order: {
    id: string;

    orderNumber: string;

    checkoutType:
      | "guest"
      | "customer";

    subtotal: number;
    deliveryFee: number;
    total: number;

    paymentMethod:
      PaymentMethod;

    paymentStatus: string;
    status: string;
    createdAt: string;
  };
};

const paymentMethods: Array<{
  id: PaymentMethod;
  name: string;
  description: string;
  mark: string;
}> = [
  {
    id: "card",

    name:
      "Credit or debit card",

    description:
      "Visa, Mastercard and other major cards.",

    mark: "CARD",
  },

  {
    id: "tabby",

    name: "Tabby",

    description:
      "Split your purchase into interest-free payments.",

    mark: "tabby",
  },

  {
    id: "tamara",

    name: "Tamara",

    description:
      "Buy now and split your payment with Tamara.",

    mark: "tamara",
  },
];

export default function PaymentPage() {
  const {
    items,
    subtotal,
    totalItems,
    clearCart,
  } = useCart();

  const {
    user,
    isReady,
  } = useAuth();

  const {
    details,
    isCheckoutReady,
    clearCheckout,
  } = useCheckout();

  const searchParams =
    useSearchParams();

  const isGuest =
    searchParams.get(
      "mode"
    ) === "guest";

  const [
    method,
    setMethod,
  ] =
    useState<PaymentMethod>(
      "card"
    );

  const [
    completed,
    setCompleted,
  ] = useState(false);

  const [
    isPlacingOrder,
    setIsPlacingOrder,
  ] = useState(false);

  const [
    orderNumber,
    setOrderNumber,
  ] = useState("");

  const [
    orderError,
    setOrderError,
  ] = useState("");

  const idempotencyKeyRef =
    useRef<string | null>(
      null
    );

  function getIdempotencyKey() {
    if (
      idempotencyKeyRef.current
    ) {
      return idempotencyKeyRef.current;
    }

    const key =
      crypto.randomUUID();

    idempotencyKeyRef.current =
      key;

    return key;
  }

  async function placeOrder(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      isPlacingOrder
    ) {
      return;
    }

    if (
      items.length === 0
    ) {
      setOrderError(
        "Your cart is empty."
      );

      return;
    }

    setOrderError("");
    setIsPlacingOrder(
      true
    );

    try {
      const response =
        await axios.post<CreateOrderResponse>(
          "/api/orders",

          {
            items:
              items.map(
                (item) => ({
                  productId:
                    item.id,

                  quantity:
                    item.quantity,
                })
              ),

            customerDetails: {
              fullName:
                details.fullName,

              email:
                details.email,

              phone:
                details.phone,
            },

            deliveryAddress: {
              emirate:
                details.emirate,

              area:
                details.area,

              addressLine:
                details.addressLine,

              building:
                details.building,

              apartment:
                details.apartment,

              notes:
                details.notes,
            },

            paymentMethod:
              method,
          },

          {
            headers: {
              "Idempotency-Key":
                getIdempotencyKey(),
            },
          }
        );

      if (
        !response.data.success ||
        !response.data.order
      ) {
        throw new Error(
          response.data.message ||
            "Unable to place order."
        );
      }

      setOrderNumber(
        response.data.order
          .orderNumber
      );

      clearCart();
      clearCheckout();

      setCompleted(
        true
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      if (
        axios.isAxiosError(
          error
        )
      ) {
        const data =
          error.response
            ?.data as
            | {
                message?: string;
              }
            | undefined;

        setOrderError(
          data?.message ||
            "Unable to place your order. Please try again."
        );
      } else if (
        error instanceof Error
      ) {
        setOrderError(
          error.message
        );
      } else {
        setOrderError(
          "Unable to place your order. Please try again."
        );
      }
    } finally {
      setIsPlacingOrder(
        false
      );
    }
  }

  if (
    !isReady ||
    !isCheckoutReady
  ) {
    return (
      <div className="min-h-[70vh] bg-[var(--brand-background)]" />
    );
  }

  if (
    !user &&
    !isGuest
  ) {
    return (
      <section className="min-h-[calc(100dvh-80px)] bg-[var(--brand-background)] px-4 py-10 sm:px-8 lg:py-14">
        <AuthPanel checkout />
      </section>
    );
  }

  if (completed) {
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

  if (
    items.length === 0
  ) {
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

  const hasDeliveryDetails =
    Boolean(
      details.fullName &&
        details.email &&
        details.phone &&
        details.emirate &&
        details.area &&
        details.addressLine
    );

  if (
    !hasDeliveryDetails
  ) {
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
            Complete your delivery information before choosing
            a payment method.
          </p>

          <Button
            href={
              isGuest
                ? "/checkout?mode=guest"
                : "/checkout"
            }
            size="lg"
            className="mt-7"
          >
            Complete delivery details
          </Button>
        </div>
      </section>
    );
  }

  const selectedName =
    paymentMethods.find(
      (item) =>
        item.id === method
    )?.name ?? "payment";

  const backToDetailsHref =
    isGuest
      ? "/checkout?mode=guest"
      : "/checkout";

  return (
    <section className="min-h-screen bg-[var(--brand-background)] px-4 pb-32 pt-8 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12">
      <div className="mx-auto max-w-[1300px]">
        <Link
          href={
            backToDetailsHref
          }
          className="inline-flex items-center gap-2 text-sm text-[var(--brand-muted)] transition hover:text-[var(--brand-primary)]"
        >
          <ArrowLeft
            size={16}
          />

          Back to details
        </Link>

        <div className="mt-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--brand-primary)]">
            Step 3 of 3 · Secure payment
          </p>

          <h1 className="mt-2 font-serif text-4xl text-[var(--brand-text-dark)] sm:text-5xl">
            Choose how to pay.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--brand-muted)]">
            Select a payment option to finish your order.
          </p>
        </div>

        <form
          onSubmit={
            placeOrder
          }
          className="mt-10 grid gap-8 lg:grid-cols-[1fr_390px] lg:items-start"
        >
          <div className="rounded-[28px] border border-[var(--brand-border)] bg-white p-5 sm:p-7">
            <h2 className="font-serif text-2xl text-[var(--brand-text-dark)]">
              Payment method
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {paymentMethods.map(
                (option) => {
                  const selected =
                    method ===
                    option.id;

                  return (
                    <label
                      key={
                        option.id
                      }
                      className={`relative flex cursor-pointer items-start gap-4 rounded-[20px] border p-4 transition ${
                        selected
                          ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)]/40"
                          : "border-[var(--brand-border)] hover:border-[var(--brand-primary-light)]"
                      }`}
                    >
                      <input
                        className="sr-only"
                        type="radio"
                        name="paymentMethod"
                        value={
                          option.id
                        }
                        checked={
                          selected
                        }
                        onChange={() =>
                          setMethod(
                            option.id
                          )
                        }
                      />

                      <span
                        className={`flex h-10 min-w-14 items-center justify-center rounded-xl px-2 text-xs font-bold ${
                          option.id ===
                          "tabby"
                            ? "bg-[#3fefc6] text-black"
                            : option.id ===
                                "tamara"
                              ? "bg-[#ffcac8] text-black"
                              : "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"
                        }`}
                      >
                        {option.id ===
                        "card" ? (
                          <CreditCard
                            size={20}
                          />
                        ) : (
                          option.mark
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-[var(--brand-text-dark)]">
                          {
                            option.name
                          }
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-[var(--brand-muted)]">
                          {
                            option.description
                          }
                        </span>
                      </span>

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                            : "border-[var(--brand-border)]"
                        }`}
                      >
                        {selected && (
                          <Check
                            size={12}
                          />
                        )}
                      </span>
                    </label>
                  );
                }
              )}
            </div>

            {method ===
              "card" && (
              <div className="mt-6 rounded-[22px] border border-[var(--brand-border)] bg-[var(--brand-background)] p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-[var(--brand-primary)]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-[var(--brand-text-dark)]">
                      Secure card payment
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--brand-muted)]">
                      Card fields will be provided by the payment gateway.
                      Velvet Crust will not store raw card numbers or CVC
                      details.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[var(--brand-primary-soft)]/40 p-4 text-[var(--brand-muted)]">
              <ShieldCheck
                className="mt-0.5 shrink-0 text-[var(--brand-primary)]"
                size={18}
              />

              <p className="text-xs leading-5">
                Your order will be created securely before payment
                processing. Payment confirmation will be verified by
                the selected payment provider.
              </p>
            </div>

            {orderError && (
              <div
                role="alert"
                className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {orderError}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={
                isPlacingOrder
              }
              iconLeft={
                <LockKeyhole
                  size={15}
                />
              }
              className="mt-6"
            >
              {isPlacingOrder
                ? "Placing order..."
                : `Place order with ${selectedName}`}
            </Button>
          </div>

          <OrderSummary
            items={items}
            subtotal={
              subtotal
            }
            totalItems={
              totalItems
            }
          />
        </form>
      </div>
    </section>
  );
}

function OrderSummary({
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
              key={
                item.id
              }
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
                  {
                    item.name
                  }
                </p>

                <p className="mt-1 text-xs text-[var(--brand-muted)]">
                  Qty{" "}
                  {
                    item.quantity
                  }
                </p>
              </div>

              <p className="text-sm font-semibold text-[var(--brand-text-dark)]">
                AED{" "}
                {(
                  item.price *
                  item.quantity
                ).toFixed(
                  2
                )}
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