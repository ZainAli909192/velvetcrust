"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import axios from "axios";

import {
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  useAuth,
} from "@/components/store/auth-context";

import OrdersList, {
  type AccountOrder,
} from "@/components/account/orders-list";

import Button from "@/components/ui/button";

type OrdersResponse = {
  success: boolean;
  orders?: AccountOrder[];
  message?: string;
};

export default function OrdersPage() {
  const router =
    useRouter();

  const {
    user,
    isReady,
  } = useAuth();

  const [
    orders,
    setOrders,
  ] =
    useState<AccountOrder[]>(
      []
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const loadOrders =
    useCallback(
      async () => {
        if (!user) {
          return;
        }

        setIsLoading(
          true
        );

        setError("");

        try {
          const response =
            await axios.get<OrdersResponse>(
              "/api/orders"
            );

          if (
            !response.data
              .success
          ) {
            throw new Error(
              response.data
                .message ||
                "Unable to load orders."
            );
          }

          setOrders(
            response.data
              .orders ?? []
          );
        } catch (error) {
          console.error(
            "Load orders error:",
            error
          );

          setOrders([]);

          setError(
            "We couldn't load your orders right now."
          );
        } finally {
          setIsLoading(
            false
          );
        }
      },
      [user]
    );

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!user) {
      router.replace(
        "/account"
      );

      return;
    }

    void loadOrders();
  }, [
    isReady,
    user,
    router,
    loadOrders,
  ]);

  if (
    !isReady ||
    (
      user &&
      isLoading
    )
  ) {
    return (
      <OrdersLoading />
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[var(--brand-background)] px-4 pb-32 pt-8 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12">
      <div className="mx-auto max-w-[1120px]">
        <motion.button
          type="button"
          onClick={() =>
            router.back()
          }
          initial={{
            opacity: 0,
            x: -15,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          whileTap={{
            scale: 0.96,
          }}
          className="
            inline-flex
            cursor-pointer
            items-center
            gap-2
            text-xs
            font-semibold
            text-[var(--brand-muted)]
            transition-colors

            hover:text-[var(--brand-primary)]
          "
        >
          <ArrowLeft
            size={16}
          />

          Back
        </motion.button>

        <motion.div
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
          className="mb-8 mt-7"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]">
            My account
          </p>

          <div className="mt-2 flex items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl text-[var(--brand-text-dark)] sm:text-5xl">
                My Orders
              </h1>

              <p className="mt-2 text-sm text-[var(--brand-muted)]">
                View and manage your Velvet Crust orders.
              </p>
            </div>

            {orders.length >
              0 && (
              <p className="shrink-0 text-xs font-medium text-[var(--brand-muted)]">
                {
                  orders.length
                }{" "}
                {orders.length ===
                1
                  ? "order"
                  : "orders"}
              </p>
            )}
          </div>
        </motion.div>

        {error ? (
          <div className="rounded-[24px] border border-red-100 bg-white px-5 py-12 text-center">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <Button
              type="button"
              size="sm"
              className="mt-5"
              iconLeft={
                <RefreshCw
                  size={15}
                />
              }
              onClick={() => {
                void loadOrders();
              }}
            >
              Try again
            </Button>
          </div>
        ) : (
          <OrdersList
            orders={
              orders
            }
          />
        )}
      </div>
    </main>
  );
}

function OrdersLoading() {
  return (
    <main className="min-h-screen bg-[var(--brand-background)] px-4 pb-32 pt-8 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12">
      <div className="mx-auto max-w-[1120px]">
        <div className="h-4 w-16 animate-pulse rounded bg-[var(--brand-primary-soft)]" />

        <div className="mb-8 mt-7">
          <div className="h-3 w-24 animate-pulse rounded bg-[var(--brand-primary-soft)]" />

          <div className="mt-3 h-11 w-52 animate-pulse rounded bg-[var(--brand-primary-soft)]" />

          <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-[var(--brand-primary-soft)]" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({
            length: 4,
          }).map(
            (
              _,
              index
            ) => (
              <div
                key={
                  index
                }
                className="animate-pulse rounded-[24px] border border-[var(--brand-border)] bg-white p-5 sm:p-6"
              >
                <div className="flex justify-between gap-5">
                  <div>
                    <div className="h-3 w-14 rounded bg-[var(--brand-primary-soft)]" />

                    <div className="mt-3 h-7 w-44 rounded bg-[var(--brand-primary-soft)]" />
                  </div>

                  <div className="h-7 w-20 rounded-full bg-[var(--brand-primary-soft)]" />
                </div>

                <div className="mt-6 h-px bg-[var(--brand-border)]" />

                <div className="mt-5 flex gap-5">
                  <div className="h-10 w-24 rounded bg-[var(--brand-primary-soft)]" />

                  <div className="h-10 w-24 rounded bg-[var(--brand-primary-soft)]" />
                </div>

                <div className="mt-6 h-12 rounded-full bg-[var(--brand-primary-soft)]" />
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}