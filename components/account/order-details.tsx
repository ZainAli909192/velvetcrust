"use client";

import axios, {
  AxiosError,
} from "axios";

import Link from "next/link";

import {
  ArrowLeft,
  ShoppingBag,
  XCircle,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "@/components/store/auth-context";

import CancelOrderModal, {
  CancellationSuccess,
} from "./cancel-order-modal";

import OrderProgress from "./order-details/order-progress";
import OrderedItems from "./order-details/ordered-items";
import DeliveryDetails from "./order-details/delivery-details";
import OrderSummary from "./order-details/order-summary";

export type OrderItem = {
  productId?: string;
  name: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type CustomerDetails = {
  fullName: string;
  email: string;
  phone: string;
};

export type DeliveryAddress = {
  emirate: string;
  area: string;
  addressLine: string;
  building?: string;
  apartment?: string;
  notes?: string;
};

export type OrderData = {
  orderNumber: string;

  items: OrderItem[];

  itemCount: number;

  customerDetails:
    CustomerDetails;

  deliveryAddress:
    DeliveryAddress;

  subtotal: number;
  deliveryFee: number;
  total: number;

  paymentMethod:
    string;

  paymentStatus:
    string;

  status: string;

  cancelledAt?:
    string | null;

  deliveredAt?:
    string | null;

  createdAt: string;
};

type OrderResponse = {
  success: boolean;
  order?: OrderData;
  message?: string;
};

type CancelResponse = {
  success: boolean;

  message?: string;

  order?: {
    orderNumber: string;
    status: string;

    cancelledAt?:
      string | null;
  };
};

export default function OrderDetails({
  orderNumber,
}: {
  orderNumber: string;
}) {
  const {
    user,
    isReady,
  } = useAuth();

  const [
    order,
    setOrder,
  ] =
    useState<OrderData | null>(
      null
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    notFound,
    setNotFound,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    cancelOpen,
    setCancelOpen,
  ] = useState(false);

  const [
    isCancelling,
    setIsCancelling,
  ] = useState(false);

  const [
    cancelError,
    setCancelError,
  ] = useState("");

  const [
    cancelSuccess,
    setCancelSuccess,
  ] = useState(false);

  const loadOrder =
    useCallback(
      async () => {
        if (!user) {
          return;
        }

        setIsLoading(
          true
        );

        setNotFound(
          false
        );

        setError("");

        try {
          const response =
            await axios.get<OrderResponse>(
              `/api/orders/${encodeURIComponent(
                orderNumber
              )}`
            );

          if (
            !response.data
              .success ||
            !response.data
              .order
          ) {
            throw new Error(
              response.data
                .message ||
                "Unable to load order."
            );
          }

          setOrder(
            response.data.order
          );
        } catch (error) {
          const axiosError =
            error as AxiosError<OrderResponse>;

          if (
            axiosError
              .response
              ?.status === 404
          ) {
            setNotFound(
              true
            );

            setOrder(null);

            return;
          }

          console.error(
            "Load order error:",
            error
          );

          setOrder(null);

          setError(
            "We couldn't load this order right now."
          );
        } finally {
          setIsLoading(
            false
          );
        }
      },
      [
        user,
        orderNumber,
      ]
    );

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!user) {
      setIsLoading(
        false
      );

      return;
    }

    void loadOrder();
  }, [
    isReady,
    user,
    loadOrder,
  ]);

  async function handleCancelOrder() {
    if (
      !order ||
      isCancelling
    ) {
      return;
    }

    setIsCancelling(
      true
    );

    setCancelError(
      ""
    );

    try {
      const response =
        await axios.patch<CancelResponse>(
          `/api/orders/${encodeURIComponent(
            order.orderNumber
          )}/cancel`
        );

      if (
        !response.data
          .success ||
        !response.data
          .order
      ) {
        setCancelError(
          response.data
            .message ||
            "Unable to cancel order."
        );

        return;
      }

      setOrder(
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,

            status:
              response.data
                .order
                ?.status ??
              "Cancelled",

            cancelledAt:
              response.data
                .order
                ?.cancelledAt ??
              new Date().toISOString(),
          };
        }
      );

      setCancelOpen(
        false
      );

      setCancelSuccess(
        true
      );

      window.setTimeout(
        () => {
          setCancelSuccess(
            false
          );
        },
        3000
      );
    } catch (error) {
      const axiosError =
        error as AxiosError<CancelResponse>;

      const message =
        axiosError.response
          ?.data?.message ||
        "Unable to cancel order. Please try again.";

      setCancelError(
        message
      );

      if (
  axiosError
    .response
    ?.status === 409
) {
  setCancelOpen(
    false
  );

  setCancelError(
    ""
  );

  await loadOrder();

  return;
}
    } finally {
      setIsCancelling(
        false
      );
    }
  }

  if (
    !isReady ||
    isLoading
  ) {
    return (
      <OrderSkeleton />
    );
  }

  if (!user) {
    return (
      <SignInRequired />
    );
  }

  if (notFound) {
    return (
      <OrderNotFound />
    );
  }

  if (
    error ||
    !order
  ) {
    return (
      <OrderError
        onRetry={() => {
          void loadOrder();
        }}
      />
    );
  }

  const normalizedStatus =
    order.status.toLowerCase();

  const canCancel =
    normalizedStatus ===
      "pending" ||
    normalizedStatus ===
      "confirmed";

  const createdAt =
    new Date(
      order.createdAt
    );

  const formattedDate =
    Number.isNaN(
      createdAt.getTime()
    )
      ? "Date unavailable"
      : new Intl.DateTimeFormat(
          "en-AE",
          {
            dateStyle:
              "long",
          }
        ).format(
          createdAt
        );

  return (
    <>
      <main className="min-h-screen bg-[var(--brand-background)] px-4 pb-32 pt-8 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12">
        <div className="mx-auto max-w-[1120px]">
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            <Link
              href="/account/orders"
              className="group inline-flex items-center gap-2 text-xs font-semibold text-[var(--brand-muted)] transition-colors hover:text-[var(--brand-primary)]"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />

              Back to orders
            </Link>
          </motion.div>

          <motion.header
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="mt-7"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]">
                  Order details
                </p>

                <h1 className="mt-2 break-words font-serif text-[34px] leading-none text-[var(--brand-text-dark)] sm:text-5xl">
                  {
                    order.orderNumber
                  }
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <StatusBadge
                    status={
                      order.status
                    }
                  />

                  <span className="text-xs text-[var(--brand-muted)]">
                    Placed{" "}
                    {
                      formattedDate
                    }
                  </span>
                </div>
              </div>

              {canCancel && (
                <motion.button
                  type="button"
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={() => {
                    setCancelError(
                      ""
                    );

                    setCancelOpen(
                      true
                    );
                  }}
                  className="inline-flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-full border border-red-200 px-5 text-xs font-semibold text-red-700 transition-colors duration-300 hover:border-red-300 hover:bg-red-50"
                >
                  <XCircle
                    size={16}
                  />

                  Cancel order
                </motion.button>
              )}
            </div>
          </motion.header>

          <motion.div
            initial={{
              opacity: 0,
              scaleX: 0,
            }}
            animate={{
              opacity: 1,
              scaleX: 1,
            }}
            className="mt-8 h-px origin-left bg-[var(--brand-border)]"
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
            <div className="space-y-8">
              <OrderProgress
                status={
                  order.status
                }
              />

              <OrderedItems
                items={
                  order.items
                }
              />

              <DeliveryDetails
                customer={
                  order.customerDetails
                }
                address={
                  order.deliveryAddress
                }
              />
            </div>

            <OrderSummary
              subtotal={
                order.subtotal
              }
              deliveryFee={
                order.deliveryFee
              }
              total={
                order.total
              }
              paymentMethod={
                order.paymentMethod
              }
              paymentStatus={
                order.paymentStatus
              }
              status={
                order.status
              }
            />
          </div>
        </div>
      </main>

      <CancelOrderModal
        open={
          cancelOpen
        }
        isLoading={
          isCancelling
        }
        error={
          cancelError
        }
        onClose={() => {
          if (
            isCancelling
          ) {
            return;
          }

          setCancelOpen(
            false
          );

          setCancelError(
            ""
          );
        }}
        onConfirm={
          handleCancelOrder
        }
      />

      <CancellationSuccess
        show={
          cancelSuccess
        }
      />
    </>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const cancelled =
    status.toLowerCase() ===
    "cancelled";

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-1.5
        text-[9px]
        font-semibold
        uppercase
        tracking-[0.1em]

        ${
          cancelled
            ? "bg-red-50 text-red-700"
            : "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"
        }
      `}
    >
      {status}
    </span>
  );
}

function OrderSkeleton() {
  return (
    <main className="min-h-screen bg-[var(--brand-background)] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-[1120px] animate-pulse">
        <div className="h-4 w-28 rounded-full bg-black/5" />

        <div className="mt-7 h-12 w-64 rounded-xl bg-black/5" />

        <div className="mt-10 h-px bg-black/5" />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="h-32 rounded-[24px] bg-black/5" />

            <div className="h-64 rounded-[24px] bg-black/5" />

            <div className="h-48 rounded-[24px] bg-black/5" />
          </div>

          <div className="h-[390px] rounded-[24px] bg-black/5" />
        </div>
      </div>
    </main>
  );
}

function SignInRequired() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-[var(--brand-background)] px-5">
      <div className="max-w-[400px] text-center">
        <ShoppingBag
          size={30}
          className="mx-auto text-[var(--brand-primary)]"
        />

        <h1 className="mt-5 font-serif text-3xl text-[var(--brand-text-dark)]">
          Sign in to view your order
        </h1>

        <Link
          href="/account"
          className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[var(--brand-primary)] px-7 text-xs font-semibold text-white"
        >
          Go to account
        </Link>
      </div>
    </div>
  );
}

function OrderNotFound() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-[var(--brand-background)] px-5">
      <div className="max-w-[430px] text-center">
        <ShoppingBag
          size={30}
          className="mx-auto text-[var(--brand-primary)]"
        />

        <h1 className="mt-5 font-serif text-3xl text-[var(--brand-text-dark)]">
          Order not found
        </h1>

        <p className="mt-2 text-sm text-[var(--brand-muted)]">
          We couldn&apos;t find this order in your account.
        </p>

        <Link
          href="/account/orders"
          className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[var(--brand-primary)] px-7 text-xs font-semibold text-white"
        >
          Back to orders
        </Link>
      </div>
    </div>
  );
}

function OrderError({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-[var(--brand-background)] px-5">
      <div className="text-center">
        <h1 className="font-serif text-3xl text-[var(--brand-text-dark)]">
          Unable to load order
        </h1>

        <button
          type="button"
          onClick={
            onRetry
          }
          className="mt-6 min-h-12 cursor-pointer rounded-full bg-[var(--brand-primary)] px-7 text-xs font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}