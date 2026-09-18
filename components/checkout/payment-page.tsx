"use client";

import axios from "axios";
import Link from "next/link";

import {
  useSearchParams,
} from "next/navigation";

import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  Elements,
} from "@stripe/react-stripe-js";

import {
  loadStripe,
} from "@stripe/stripe-js";

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

import PaymentMethods, {
  getPaymentMethodName,
  type PaymentMethod,
} from "@/components/checkout/payment/payment-methods";

import OrderSummary from "@/components/checkout/payment/order-summary";

import PaymentSuccess from "@/components/checkout/payment/payment-success";

import StripePaymentForm from "@/components/checkout/payment/stripe-payment-form";

import {
  EmptyCartState,
  MissingDeliveryState,
} from "@/components/checkout/payment/payment-state";

const publishableKey =
  process.env
    .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const stripePromise =
  publishableKey
    ? loadStripe(
        publishableKey
      )
    : null;

type CreateOrderResponse = {
  success: boolean;
  message?: string;
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

    guestAccessToken?: string;
  };
};

type CreateIntentResponse = {
  success: boolean;
  message?: string;

  clientSecret?: string;
  paymentIntentId?: string;
};

type StripePaymentMethod =
  | "card"
  | "apple_pay"
  | "google_pay";

type PreparedPayment = {
  orderId: string;
  orderNumber: string;

  paymentMethod:
    StripePaymentMethod;

  clientSecret: string;
};

function isStripeMethod(
  method: PaymentMethod
): method is StripePaymentMethod {
  return (
    method === "card" ||
    method === "apple_pay" ||
    method === "google_pay"
  );
}

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

  const returnedClientSecret =
    searchParams.get(
      "payment_intent_client_secret"
    );

  const returnedOrderNumber =
    searchParams.get("order") || "";

  const returnedMethod =
    searchParams.get("method");

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
  ] =
    useState(false);

  const [
    isPlacingOrder,
    setIsPlacingOrder,
  ] =
    useState(false);

  const [
    orderNumber,
    setOrderNumber,
  ] =
    useState("");

  const [
    orderError,
    setOrderError,
  ] =
    useState("");

  const [
    preparedPayment,
    setPreparedPayment,
  ] =
    useState<PreparedPayment | null>(
      null
    );

  const [
    isRecoveringReturn,
    setIsRecoveringReturn,
  ] = useState(
    Boolean(returnedClientSecret)
  );

  const [
    isPaymentProcessing,
    setIsPaymentProcessing,
  ] = useState(false);

  const guestAccessTokenRef =
    useRef<string | null>(null);

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

  function handleMethodChange(
    nextMethod: PaymentMethod
  ) {
    if (
      preparedPayment ||
      isPlacingOrder
    ) {
      return;
    }

    setMethod(
      nextMethod
    );

    setOrderError("");
  }

  async function createOrder() {
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
          "Unable to create order."
      );
    }

    const order = response.data.order;

    if (order.guestAccessToken) {
      guestAccessTokenRef.current =
        order.guestAccessToken;
    } else if (
      order.checkoutType === "guest" &&
      guestAccessTokenRef.current
    ) {
      order.guestAccessToken =
        guestAccessTokenRef.current;
    }

    return order;
  }

  async function createStripeIntent(
    order:
      CreateOrderResponse["order"]
  ) {
    const response =
      await axios.post<CreateIntentResponse>(
        "/api/payments/stripe/create-intent",
        {
          orderId:
            order.id,

          ...(order.checkoutType ===
            "guest"
            ? {
                guestAccessToken:
                  order.guestAccessToken,
              }
            : {}),
        }
      );

    if (
      !response.data.success ||
      !response.data.clientSecret
    ) {
      throw new Error(
        response.data.message ||
          "Unable to initialize payment."
      );
    }

    return response.data.clientSecret;
  }

  async function placeOrder(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      isPlacingOrder ||
      preparedPayment
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

    if (
      !isStripeMethod(
        method
      )
    ) {
      setOrderError(
        `${getPaymentMethodName(
          method
        )} checkout is not connected yet.`
      );

      return;
    }

    if (
      !stripePromise
    ) {
      setOrderError(
        "Stripe is not configured. Please add your Stripe publishable key."
      );

      return;
    }

    setOrderError("");
    setIsPlacingOrder(
      true
    );

    try {
      const order =
        await createOrder();

      if (
        order.checkoutType ===
          "guest" &&
        !order.guestAccessToken
      ) {
        throw new Error(
          "Unable to authorize guest payment. Please restart checkout."
        );
      }

      const clientSecret =
        await createStripeIntent(
          order
        );

      setOrderNumber(
        order.orderNumber
      );

      setPreparedPayment({
        orderId:
          order.id,

        orderNumber:
          order.orderNumber,

        paymentMethod:
          method,

        clientSecret,
      });

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
            "Unable to prepare your payment. Please try again."
        );
      } else if (
        error instanceof Error
      ) {
        setOrderError(
          error.message
        );
      } else {
        setOrderError(
          "Unable to prepare your payment. Please try again."
        );
      }
    } finally {
      setIsPlacingOrder(
        false
      );
    }
  }

  function handlePaymentSuccess() {
    clearCart();
    clearCheckout();

    setCompleted(
      true
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    if (!returnedClientSecret) {
      return;
    }

    let active = true;

    async function recoverPayment() {
      try {
        const stripe =
          await stripePromise;

        if (!stripe) {
          throw new Error(
            "Stripe is not configured on this deployment."
          );
        }

        const { paymentIntent, error } =
          await stripe.retrievePaymentIntent(
            returnedClientSecret!
          );

        if (!active) {
          return;
        }

        if (
          paymentIntent?.status ===
          "succeeded"
        ) {
          setOrderNumber(
            returnedOrderNumber
          );
          clearCart();
          clearCheckout();
          setCompleted(true);
          window.history.replaceState(
            null,
            "",
            "/checkout/payment"
          );
        } else if (paymentIntent) {
          setOrderNumber(
            returnedOrderNumber
          );
          setPreparedPayment({
            orderId: "",
            orderNumber:
              returnedOrderNumber,
            paymentMethod:
              returnedMethod ===
                "apple_pay" ||
              returnedMethod ===
                "google_pay"
                ? returnedMethod
                : "card",
            clientSecret:
              returnedClientSecret!,
          });
          setIsPaymentProcessing(
            paymentIntent.status ===
              "processing"
          );
          if (
            paymentIntent.status ===
            "processing"
          ) {
            setOrderError(
              "Your payment is processing. Please wait for confirmation before trying again."
            );
          }
        } else {
          setOrderError(
            error?.message ||
              "Unable to verify your payment. Please contact support before trying again."
          );
        }
      } catch (error) {
        if (active) {
          setOrderError(
            error instanceof Error
              ? error.message
              : "Unable to verify your payment. Please contact support before trying again."
          );
        }
      } finally {
        if (active) {
          setIsRecoveringReturn(false);
        }
      }
    }

    void recoverPayment();

    return () => {
      active = false;
    };
  }, [
    returnedClientSecret,
    returnedOrderNumber,
    returnedMethod,
    clearCart,
    clearCheckout,
  ]);

  if (
    !isReady ||
    !isCheckoutReady ||
    isRecoveringReturn
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
      <PaymentSuccess
        orderNumber={
          orderNumber
        }
      />
    );
  }

  if (
    items.length === 0
  ) {
    return (
      <EmptyCartState />
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

  const backToDetailsHref =
    isGuest
      ? "/checkout?mode=guest"
      : "/checkout";

  if (
    !hasDeliveryDetails
  ) {
    return (
      <MissingDeliveryState
        href={
          backToDetailsHref
        }
      />
    );
  }

  const selectedName =
    getPaymentMethodName(
      method
    );

  return (
    <section className="min-h-screen bg-[var(--brand-background)] px-4 pb-32 pt-8 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12">
      <div className="mx-auto max-w-[1300px]">
        {!preparedPayment && (
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
        )}

        <div className="mt-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--brand-primary)]">
            Step 3 of 3 · Secure payment
          </p>

          <h1 className="mt-2 font-serif text-4xl text-[var(--brand-text-dark)] sm:text-5xl">
            {preparedPayment
              ? "Complete your payment."
              : "Choose how to pay."}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--brand-muted)]">
            {preparedPayment
              ? `Order ${preparedPayment.orderNumber} is ready for secure payment.`
              : "Select a payment option to finish your order."}
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_390px] lg:items-start">
          <div className="rounded-[28px] border border-[var(--brand-border)] bg-white p-5 sm:p-7">
            {!preparedPayment ? (
              <form
                onSubmit={
                  placeOrder
                }
              >
                <h2 className="font-serif text-2xl text-[var(--brand-text-dark)]">
                  Payment method
                </h2>

                <div className="mt-6">
                  <PaymentMethods
                    value={
                      method
                    }
                    onChange={
                      handleMethodChange
                    }
                  />
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[var(--brand-primary-soft)]/40 p-4 text-[var(--brand-muted)]">
                  <ShieldCheck
                    className="mt-0.5 shrink-0 text-[var(--brand-primary)]"
                    size={18}
                  />

                  <p className="text-xs leading-5">
                    Your order is created as pending first. Payment is processed securely and confirmed server-side.
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
                    ? "Preparing secure payment..."
                    : `Continue with ${selectedName}`}
                </Button>
              </form>
            ) : (
              <>
                {orderError && (
                  <div
                    role="alert"
                    className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                  >
                    {orderError}
                  </div>
                )}
                {isPaymentProcessing ? null : stripePromise ? (
                  <Elements
                    stripe={
                      stripePromise
                    }
                    options={{
                      clientSecret:
                        preparedPayment.clientSecret,

                      appearance: {
                        variables: {
                          borderRadius:
                            "14px",
                        },
                      },
                    }}
                  >
                    <StripePaymentForm
                      method={
                        preparedPayment.paymentMethod
                      }
                      clientSecret={
                        preparedPayment.clientSecret
                      }
                      orderNumber={
                        preparedPayment.orderNumber
                      }
                      isGuest={
                        isGuest
                      }
                      onSuccess={
                        handlePaymentSuccess
                      }
                    />
                  </Elements>
                ) : (
                  <div
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    Stripe is not configured.
                  </div>
                )}
              </>
            )}
          </div>

          <OrderSummary
            items={
              items
            }
            subtotal={
              subtotal
            }
            totalItems={
              totalItems
            }
          />
        </div>
      </div>
    </section>
  );
}
