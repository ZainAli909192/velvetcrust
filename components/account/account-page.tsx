"use client";

import { useRouter } from "next/navigation";
import {
  Clock3,
  LogOut,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";

import AuthPanel from "@/components/order/auth-panel";
import { useAuth } from "@/components/store/auth-context";
import { useCart } from "@/components/store/cart-context";
import Button from "@/components/ui/button";

export default function AccountPage({
  next,
}: {
  next?: string;
}) {
  const router = useRouter();
  const { user, orders, signOut, isReady } = useAuth();
  const { totalItems } = useCart();

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
            checkout={Boolean(next)}
            onSuccess={() =>
              router.push(next ?? "/account")
            }
          />
        </div>
      </section>
    );
  }

  const recent = orders[0];

  const totalSpent = orders.reduce(
    (total, order) => total + order.total,
    0
  );

  const metrics = [
    {
      label: "Total orders",
      value: String(orders.length),
      icon: PackageCheck,
    },
    {
      label: "Recent order",
      value: recent?.id ?? "None yet",
      icon: Clock3,
    },
    {
      label: "Cart items",
      value: String(totalItems),
      icon: ShoppingBag,
    },
  ];

  return (
    <section className="min-h-screen bg-[var(--brand-background)] px-4 pb-32 pt-9 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12">
      <div className="mx-auto max-w-[1120px]">
        {/* Heading */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]">
              My account
            </p>

            <h1 className="mt-2 font-serif text-4xl text-[var(--brand-text-dark)] sm:text-5xl">
              Welcome, {user.name}.
            </h1>

            <p className="mt-2 text-sm text-[var(--brand-muted)]">
              Manage your orders and continue where you left off.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={signOut}
            iconLeft={<LogOut size={16} />}
            className="min-h-11 self-start text-[var(--brand-muted)] hover:text-[var(--brand-primary)]"
          >
            Sign out
          </Button>
        </div>

        {/* Metrics */}
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 border-y border-[var(--brand-border)] py-7 sm:grid-cols-3 sm:gap-x-8">
          {metrics.map(
            ({ label, value, icon: Icon }) => (
              <Metric
                key={label}
                icon={<Icon size={20} />}
                label={label}
                value={value}
              />
            )
          )}
        </div>

        {/* Order history */}
        <section className="mt-10">
          <div className="flex items-start justify-between gap-4 sm:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)] sm:text-[11px]">
                Order history
              </p>

              <h2 className="mt-1 font-serif text-2xl text-[var(--brand-text-dark)]">
                Recent orders
              </h2>
            </div>

            {orders.length > 0 && (
              <span className="shrink-0 text-xs font-semibold text-[var(--brand-primary)] sm:text-sm">
                AED {totalSpent.toFixed(2)} total
              </span>
            )}
          </div>

          {recent ? (
            <RecentOrder order={recent} />
          ) : (
            <EmptyOrders />
          )}
        </section>
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
        {icon}
      </div>

      <p className="mt-3 text-[11px] text-[var(--brand-muted)] sm:text-xs">
        {label}
      </p>

      <p className="mt-1 truncate font-serif text-xl text-[var(--brand-text-dark)] sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function RecentOrder({
  order,
}: {
  order: {
    id: string;
    status: string;
    date: string;
    itemCount: number;
    total: number;
  };
}) {
  const date = new Intl.DateTimeFormat("en-AE", {
    dateStyle: "medium",
  }).format(new Date(order.date));

  return (
    <div className="mt-6 flex flex-col gap-4 border-y border-[var(--brand-border)] py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-[var(--brand-text-dark)]">
            {order.id}
          </span>

          <span className="rounded-full bg-[var(--brand-primary-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
            {order.status}
          </span>
        </div>

        <p className="mt-2 text-sm text-[var(--brand-muted)]">
          {date} · {order.itemCount}{" "}
          {order.itemCount === 1 ? "item" : "items"}
        </p>
      </div>

      <p className="text-lg font-bold tabular-nums text-[var(--brand-primary)]">
        AED {order.total.toFixed(2)}
      </p>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="mt-6 border-y border-[var(--brand-border)] py-10 text-center">
      <ShoppingBag
        size={28}
        className="mx-auto text-[var(--brand-primary)]"
      />

      <p className="mt-3 font-serif text-xl text-[var(--brand-text-dark)]">
        No orders yet
      </p>

      <p className="mt-1 text-sm text-[var(--brand-muted)]">
        Your latest order will appear here.
      </p>

      <Button
        href="/#cheesecakes"
        size="sm"
        className="mt-5"
      >
        Shop cheesecakes
      </Button>
    </div>
  );
}