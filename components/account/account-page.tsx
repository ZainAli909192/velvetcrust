"use client";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  ArrowRight,
  Clock3,
  LogOut,
  MapPin,
  PackageCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import AuthPanel from "@/components/order/auth-panel";

import {
  useAuth,
} from "@/components/store/auth-context";

import {
  useCart,
} from "@/components/store/cart-context";

import Button from "@/components/ui/button";

type OrderItem = {
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type AccountOrder = {
  orderNumber: string;

  items:
    OrderItem[];

  itemCount: number;

  subtotal: number;
  deliveryFee: number;
  total: number;

  paymentMethod: string;
  paymentStatus: string;
  status: string;

  createdAt: string;
};

type OrdersResponse = {
  success: boolean;

  orders:
    AccountOrder[];
};

export default function AccountPage({
  next,
}: {
  next?: string;
}) {
  const router =
    useRouter();

  const {
    user,
    signOut,
    isReady,
  } = useAuth();

  const {
    totalItems,
  } = useCart();

  const [
    orders,
    setOrders,
  ] =
    useState<AccountOrder[]>(
      []
    );

  const [
    ordersLoading,
    setOrdersLoading,
  ] = useState(true);

  const [
    ordersError,
    setOrdersError,
  ] = useState("");

  const loadOrders =
    useCallback(
      async () => {
        if (!user) {
          setOrders([]);

          setOrdersLoading(
            false
          );

          return;
        }

        setOrdersLoading(
          true
        );

        setOrdersError("");

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

          setOrdersError(
            "We couldn't load your orders right now."
          );
        } finally {
          setOrdersLoading(
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

    void loadOrders();
  }, [
    isReady,
    loadOrders,
  ]);

  if (!isReady) {
    return (
      <div className="min-h-[70vh] bg-[var(--brand-background)]" />
    );
  }

  if (!user) {
    return (
      <section className="min-h-[calc(100dvh-80px)] bg-[var(--brand-background)] px-4 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto max-w-[1120px]">
          {next && (
            <p className="mx-auto mb-5 max-w-[560px] rounded-2xl bg-[var(--brand-primary-soft)]/40 px-4 py-3 text-center text-sm text-[var(--brand-text)]">
              Sign in to continue securely to checkout.
            </p>
          )}

          <AuthPanel
            checkout={
              Boolean(next)
            }
            onSuccess={() =>
              router.push(
                next ??
                  "/account"
              )
            }
          />
        </div>
      </section>
    );
  }

  const recent =
    orders[0];

  const totalSpent =
    orders.reduce(
      (
        total,
        order
      ) =>
        total +
        order.total,
      0
    );

  const metrics = [
    {
      label:
        "Total orders",

      value:
        ordersLoading
          ? "—"
          : String(
              orders.length
            ),

      icon:
        PackageCheck,
    },

    {
      label:
        "Recent order",

      value:
        ordersLoading
          ? "—"
          : recent
            ?.orderNumber ??
            "None yet",

      icon:
        Clock3,
    },

    {
      label:
        "Cart items",

      value:
        String(
          totalItems
        ),

      icon:
        ShoppingBag,
    },
  ];

  return (
    <section className="min-h-screen bg-[var(--brand-background)] px-4 pb-32 pt-9 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12">
      <div className="mx-auto max-w-[1120px]">
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
          className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]">
              My account
            </p>

            <h1 className="mt-2 font-serif text-4xl text-[var(--brand-text-dark)] sm:text-5xl">
              Welcome,{" "}
              {user.name}.
            </h1>

            <p className="mt-2 max-w-[500px] text-sm leading-6 text-[var(--brand-muted)]">
              Manage your
              orders, profile
              and delivery
              addresses.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={
              signOut
            }
            iconLeft={
              <LogOut
                size={16}
              />
            }
            className="min-h-11 self-start text-[var(--brand-muted)] hover:text-[var(--brand-primary)]"
          >
            Sign out
          </Button>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
          }}
          className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 border-y border-[var(--brand-border)] py-7 sm:grid-cols-3 sm:gap-x-8"
        >
          {metrics.map(
            ({
              label,
              value,
              icon: Icon,
            }) => (
              <Metric
                key={label}
                icon={
                  <Icon
                    size={20}
                    strokeWidth={
                      1.7
                    }
                  />
                }
                label={
                  label
                }
                value={
                  value
                }
              />
            )
          )}
        </motion.div>

        <motion.section
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
          }}
          className="mt-10"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)] sm:text-[11px]">
              Manage account
            </p>

            <h2 className="mt-1 font-serif text-2xl text-[var(--brand-text-dark)] sm:text-3xl">
              Account settings
            </h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <AccountLink
              href="/account/profile"
              icon={
                <UserRound
                  size={20}
                  strokeWidth={
                    1.7
                  }
                />
              }
              title="Profile"
              description="Manage your name, phone and account details."
            />

            <AccountLink
              href="/account/addresses"
              icon={
                <MapPin
                  size={20}
                  strokeWidth={
                    1.7
                  }
                />
              }
              title="Addresses"
              description="Add and manage your saved delivery addresses."
            />
          </div>
        </motion.section>

        <motion.section
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mt-10"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)] sm:text-[11px]">
                Order history
              </p>

              <h2 className="mt-1 font-serif text-2xl text-[var(--brand-text-dark)] sm:text-3xl">
                Recent order
              </h2>
            </div>

            {!ordersLoading &&
              orders.length >
                0 && (
                <Link
                  href="/account/orders"
                  className="group inline-flex shrink-0 items-center gap-1.5 pb-1 text-xs font-semibold text-[var(--brand-primary)] transition-opacity duration-300 hover:opacity-70 sm:text-sm"
                >
                  View all

                  <ArrowRight
                    size={
                      14
                    }
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              )}
          </div>

          {ordersLoading ? (
            <OrdersLoading />
          ) : ordersError ? (
            <OrdersError
              onRetry={
                loadOrders
              }
            />
          ) : recent ? (
            <RecentOrder
              order={
                recent
              }
            />
          ) : (
            <EmptyOrders />
          )}

          {!ordersLoading &&
            !ordersError &&
            orders.length >
              0 && (
              <div className="mt-5 flex items-center justify-between">
                <p className="text-xs text-[var(--brand-muted)]">
                  {
                    orders.length
                  }{" "}
                  {orders.length ===
                  1
                    ? "order"
                    : "orders"}
                </p>

                <p className="text-xs font-semibold text-[var(--brand-primary)] sm:text-sm">
                  AED{" "}
                  {totalSpent.toFixed(
                    2
                  )}{" "}
                  total
                </p>
              </div>
            )}
        </motion.section>
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon:
    React.ReactNode;

  label: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.25,
      }}
      className="min-w-0"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
        {icon}
      </div>

      <p className="mt-3 text-[11px] text-[var(--brand-muted)] sm:text-xs">
        {label}
      </p>

      <p className="mt-1 truncate font-serif text-xl text-[var(--brand-text-dark)] sm:text-2xl">
        {value}
      </p>
    </motion.div>
  );
}

function AccountLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;

  icon:
    React.ReactNode;

  title: string;

  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-[22px] border border-[var(--brand-border)] bg-white p-5 shadow-[0_10px_30px_rgba(81,0,0,0.025)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--brand-primary)]"
    >
      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-serif text-xl text-[var(--brand-text-dark)]">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-[var(--brand-muted)]">
          {description}
        </p>
      </div>

      <ArrowRight
        size={16}
        className="shrink-0 text-[var(--brand-primary)] transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
}

function RecentOrder({
  order,
}: {
  order:
    AccountOrder;
}) {
  const date =
    new Intl.DateTimeFormat(
      "en-AE",
      {
        dateStyle:
          "medium",
      }
    ).format(
      new Date(
        order.createdAt
      )
    );

  const cancelled =
    order.status.toLowerCase() ===
    "cancelled";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.5,
      }}
      className="mt-6 rounded-[24px] border border-[var(--brand-border)] bg-white p-5 shadow-[0_12px_35px_rgba(81,0,0,0.035)] sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-muted)]">
            Order
          </p>

          <p className="mt-1 truncate font-serif text-xl text-[var(--brand-text-dark)] sm:text-2xl">
            {
              order.orderNumber
            }
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] ${
            cancelled
              ? "bg-red-50 text-red-700"
              : "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-5 border-t border-[var(--brand-border)] pt-5 sm:flex sm:gap-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--brand-muted)]">
            Date
          </p>

          <p className="mt-1 text-sm font-medium text-[var(--brand-text-dark)]">
            {date}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--brand-muted)]">
            Items
          </p>

          <p className="mt-1 text-sm font-medium text-[var(--brand-text-dark)]">
            {
              order.itemCount
            }{" "}
            {order.itemCount ===
            1
              ? "item"
              : "items"}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--brand-muted)]">
            Payment
          </p>

          <p className="mt-1 text-sm font-medium text-[var(--brand-text-dark)]">
            {
              order.paymentStatus
            }
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--brand-border)] pt-5">
        <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--brand-muted)]">
          Ordered items
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {order.items.map(
            (
              item,
              index
            ) => (
              <span
                key={`${item.name}-${index}`}
                className="inline-flex items-center rounded-full bg-[var(--brand-primary-soft)] px-3 py-2 text-xs font-medium text-[var(--brand-primary)]"
              >
                {
                  item.name
                }

                {item.quantity >
                  1 && (
                  <span className="ml-1.5 opacity-70">
                    ×{" "}
                    {
                      item.quantity
                    }
                  </span>
                )}
              </span>
            )
          )}
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-[var(--brand-border)] pt-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--brand-muted)]">
            Order total
          </p>

          <p className="mt-1 font-serif text-xl text-[var(--brand-primary)] sm:text-2xl">
            AED{" "}
            {order.total.toFixed(
              2
            )}
          </p>
        </div>

        <Link
          href={`/account/orders/${encodeURIComponent(
            order.orderNumber
          )}`}
          className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 text-[11px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:opacity-90 sm:px-6"
        >
          View Order

          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </motion.div>
  );
}

function OrdersLoading() {
  return (
    <div className="mt-6 animate-pulse rounded-[24px] border border-[var(--brand-border)] bg-white p-6">
      <div className="h-3 w-20 rounded bg-[var(--brand-primary-soft)]" />

      <div className="mt-3 h-7 w-52 rounded bg-[var(--brand-primary-soft)]" />

      <div className="mt-6 h-px bg-[var(--brand-border)]" />

      <div className="mt-5 grid grid-cols-2 gap-5">
        <div className="h-10 rounded bg-[var(--brand-primary-soft)]" />

        <div className="h-10 rounded bg-[var(--brand-primary-soft)]" />
      </div>
    </div>
  );
}

function OrdersError({
  onRetry,
}: {
  onRetry:
    () => Promise<void>;
}) {
  return (
    <div className="mt-6 rounded-[24px] border border-red-100 bg-white px-5 py-10 text-center">
      <p className="text-sm text-red-700">
        We couldn&apos;t load your orders.
      </p>

      <Button
        type="button"
        size="sm"
        className="mt-5"
        onClick={() =>
          void onRetry()
        }
      >
        Try again
      </Button>
    </div>
  );
}

function EmptyOrders() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.5,
      }}
      className="mt-6 rounded-[24px] border border-[var(--brand-border)] bg-white px-5 py-12 text-center shadow-[0_12px_35px_rgba(81,0,0,0.03)]"
    >
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
        <ShoppingBag
          size={21}
          strokeWidth={
            1.7
          }
        />
      </div>

      <p className="mt-4 font-serif text-2xl text-[var(--brand-text-dark)]">
        No orders yet
      </p>

      <p className="mx-auto mt-2 max-w-[280px] text-sm leading-6 text-[var(--brand-muted)]">
        Your Velvet Crust orders will appear here once you place your first order.
      </p>

      <Button
        href="/#cheesecakes"
        size="sm"
        className="mt-6"
      >
        Shop cheesecakes
      </Button>
    </motion.div>
  );
}