"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  MapPin,
  PackageCheck,
  ShoppingBag,
  X,
  XCircle,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/components/store/auth-context";

import CancelOrderModal, {
  CancellationSuccess,
} from "./cancel-order-modal";

type OrderItem = {
  id?: string;
  name?: string;
  title?: string;
  productName?: string;
  quantity?: number;
  qty?: number;
  price?: number;
  image?: string;
};

type OrderData = {
  id: string;
  status: string;
  date: string;
  itemCount: number;
  total: number;

  items?: readonly OrderItem[];

  subtotal?: number;
  deliveryFee?: number;

  paymentMethod?: string;

  address?: string;
  deliveryAddress?: string;

  customerName?: string;
  phone?: string;
};

const viewport = {
  once: false,
  amount: 0.15,
};

export default function OrderDetails({
  orderId,
}: {
  orderId: string;
}) {
  const {
    user,
    orders,
    isReady,
    cancelOrder,
  } = useAuth();

  const [cancelOpen, setCancelOpen] =
    useState(false);

  const [cancelSuccess, setCancelSuccess] =
    useState(false);

  const order = useMemo(() => {
    return orders.find(
      (item) => item.id === orderId
    ) as OrderData | undefined;
  }, [orders, orderId]);

  if (!isReady) {
    return <OrderSkeleton />;
  }

  if (!user) {
    return <SignInRequired />;
  }

  if (!order) {
    return <OrderNotFound />;
  }

  const currentStatus = order.status;

  const cancelled =
    currentStatus.toLowerCase() ===
    "cancelled";

  const canCancel =
    currentStatus.toLowerCase() ===
    "confirmed";

  const formattedDate =
    new Intl.DateTimeFormat("en-AE", {
      dateStyle: "long",
    }).format(new Date(order.date));

  const deliveryFee =
    order.deliveryFee ?? 0;

  const subtotal =
    order.subtotal ??
    Math.max(
      0,
      order.total - deliveryFee
    );

  const deliveryAddress =
    order.deliveryAddress ??
    order.address;

  function handleCancelOrder() {
    const success = cancelOrder(
      orderId
    );

    if (!success) {
      return false;
    }

    setCancelOpen(false);
    setCancelSuccess(true);

    window.setTimeout(() => {
      setCancelSuccess(false);
    }, 3000);

    return true;
  }

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
            transition={{
              duration: 0.45,
            }}
          >
            <Link
              href="/account"
              className="
                group
                inline-flex
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
                className="transition-transform group-hover:-translate-x-1"
              />

              Back to account
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
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-7"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]">
                  Order details
                </p>

                <h1 className="mt-2 font-serif text-[38px] leading-none text-[var(--brand-text-dark)] sm:text-5xl">
                  {order.id}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <StatusBadge
                    status={
                      currentStatus
                    }
                  />

                  <span className="text-xs text-[var(--brand-muted)]">
                    Placed {formattedDate}
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
                  onClick={() =>
                    setCancelOpen(true)
                  }
                  className="
                    inline-flex
                    min-h-11
                    w-fit
                    cursor-pointer
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-red-200
                    px-5
                    text-xs
                    font-semibold
                    text-red-700
                    transition-colors
                    duration-300

                    hover:border-red-300
                    hover:bg-red-50
                  "
                >
                  <XCircle size={16} />

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
            transition={{
              duration: 0.7,
            }}
            className="mt-8 h-px origin-left bg-[var(--brand-border)]"
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
            <div className="space-y-8">
              <OrderProgress
                status={
                  currentStatus
                }
              />

              <OrderedItems
                items={
                  order.items ?? []
                }
                itemCount={
                  order.itemCount
                }
              />

              <DeliveryDetails
                name={
                  order.customerName ??
                  user.name
                }
                phone={order.phone}
                address={
                  deliveryAddress
                }
              />

              <PaymentDetails
                paymentMethod={
                  order.paymentMethod
                }
              />
            </div>

            <div>
              <OrderSummary
                subtotal={subtotal}
                deliveryFee={
                  deliveryFee
                }
                total={order.total}
                cancelled={
                  cancelled
                }
              />
            </div>
          </div>
        </div>
      </main>

      <CancelOrderModal
        orderId={order.id}
        open={cancelOpen}
        onClose={() =>
          setCancelOpen(false)
        }
        onConfirm={
          handleCancelOrder
        }
      />

      <CancellationSuccess
        show={cancelSuccess}
      />
    </>
  );
}

function OrderProgress({
  status,
}: {
  status: string;
}) {
  const normalized =
    status.toLowerCase();

  const cancelled =
    normalized === "cancelled";

  const steps = [
    {
      title: "Confirmed",
      icon: Check,
    },
    {
      title: "Processing",
      icon: Clock3,
    },
    {
      title: "Delivered",
      icon: PackageCheck,
    },
  ];

  const activeIndex =
    normalized === "delivered"
      ? 2
      : normalized === "processing"
        ? 1
        : 0;

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={viewport}
      transition={{
        duration: 0.55,
      }}
    >
      <SectionHeading
        eyebrow="Order status"
        title={
          cancelled
            ? "Order cancelled"
            : "Your order journey"
        }
      />

      {cancelled ? (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="
            mt-5
            flex
            items-center
            gap-4
            rounded-[22px]
            border
            border-red-100
            bg-red-50/60
            p-5
          "
        >
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-red-100 text-red-700">
            <X size={18} />
          </div>

          <div>
            <p className="font-semibold text-red-800">
              This order is cancelled
            </p>

            <p className="mt-1 text-xs leading-5 text-red-700/70">
              No further processing will
              take place.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="mt-6 grid grid-cols-3">
          {steps.map(
            (
              {
                title,
                icon: Icon,
              },
              index
            ) => {
              const active =
                index <= activeIndex;

              return (
                <div
                  key={title}
                  className="relative"
                >
                  {index <
                    steps.length -
                      1 && (
                    <div
                      className={`
                        absolute
                        left-1/2
                        top-5
                        h-px
                        w-full

                        ${
                          index <
                          activeIndex
                            ? "bg-[var(--brand-primary)]"
                            : "bg-[var(--brand-border)]"
                        }
                      `}
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      animate={{
                        scale: active
                          ? 1
                          : 0.9,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className={`
                        grid
                        size-10
                        place-items-center
                        rounded-full
                        border

                        ${
                          active
                            ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                            : "border-[var(--brand-border)] bg-[var(--brand-background)] text-[var(--brand-muted)]"
                        }
                      `}
                    >
                      <Icon
                        size={16}
                        strokeWidth={
                          1.8
                        }
                      />
                    </motion.div>

                    <p
                      className={`
                        mt-3
                        text-center
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.06em]

                        sm:text-[10px]
                        sm:tracking-[0.08em]

                        ${
                          active
                            ? "text-[var(--brand-primary)]"
                            : "text-[var(--brand-muted)]"
                        }
                      `}
                    >
                      {title}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </motion.section>
  );
}

function OrderedItems({
  items,
  itemCount,
}: {
  items: readonly OrderItem[];
  itemCount: number;
}) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        x: -25,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={viewport}
      transition={{
        duration: 0.55,
      }}
      className="border-t border-[var(--brand-border)] pt-8"
    >
      <SectionHeading
        eyebrow="Your order"
        title="Ordered items"
      />

      {items.length > 0 ? (
        <div className="mt-5 divide-y divide-[var(--brand-border)]">
          {items.map(
            (item, index) => (
              <OrderItemRow
                key={
                  item.id ??
                  `${getItemName(
                    item
                  )}-${index}`
                }
                item={item}
              />
            )
          )}
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-4 rounded-[20px] border border-[var(--brand-border)] bg-white p-5">
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
            <ShoppingBag
              size={18}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-[var(--brand-text-dark)]">
              {itemCount}{" "}
              {itemCount === 1
                ? "item"
                : "items"}
            </p>

            <p className="mt-1 text-xs text-[var(--brand-muted)]">
              Product details are not
              available for this order.
            </p>
          </div>
        </div>
      )}
    </motion.section>
  );
}

function OrderItemRow({
  item,
}: {
  item: OrderItem;
}) {
  const name =
    getItemName(item);

  const quantity =
    item.quantity ??
    item.qty ??
    1;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={viewport}
      transition={{
        duration: 0.4,
      }}
      className="flex items-center justify-between gap-4 py-5"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-[16px] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
          <ShoppingBag
            size={20}
            strokeWidth={1.5}
          />
        </div>

        <div className="min-w-0">
          <p className="truncate font-serif text-lg text-[var(--brand-text-dark)]">
            {name}
          </p>

          <p className="mt-1 text-xs text-[var(--brand-muted)]">
            Quantity {quantity}
          </p>
        </div>
      </div>

      {typeof item.price ===
        "number" && (
        <p className="shrink-0 text-sm font-semibold text-[var(--brand-primary)]">
          AED{" "}
          {(
            item.price *
            quantity
          ).toFixed(2)}
        </p>
      )}
    </motion.div>
  );
}

function DeliveryDetails({
  name,
  phone,
  address,
}: {
  name?: string;
  phone?: string;
  address?: string;
}) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        x: 25,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={viewport}
      transition={{
        duration: 0.55,
      }}
      className="border-t border-[var(--brand-border)] pt-8"
    >
      <SectionHeading
        eyebrow="Delivery"
        title="Delivery details"
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <InfoItem
          icon={
            <MapPin size={18} />
          }
          label="Delivery address"
          value={
            address ??
            "Address unavailable"
          }
        />

        <InfoItem
          icon={
            <CalendarDays
              size={18}
            />
          }
          label="Customer"
          value={
            [name, phone]
              .filter(Boolean)
              .join(" · ") ||
            "Customer details"
          }
        />
      </div>
    </motion.section>
  );
}

function PaymentDetails({
  paymentMethod,
}: {
  paymentMethod?: string;
}) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={viewport}
      transition={{
        duration: 0.55,
      }}
      className="border-t border-[var(--brand-border)] pt-8"
    >
      <SectionHeading
        eyebrow="Payment"
        title="Payment details"
      />

      <div className="mt-5">
        <InfoItem
          icon={
            <CreditCard
              size={18}
            />
          }
          label="Payment method"
          value={
            paymentMethod ??
            "Payment information unavailable"
          }
        />
      </div>
    </motion.section>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4 rounded-[20px] border border-[var(--brand-border)] bg-white p-5">
      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">
          {label}
        </p>

        <p className="mt-1.5 break-words text-sm leading-6 text-[var(--brand-text-dark)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function OrderSummary({
  subtotal,
  deliveryFee,
  total,
  cancelled,
}: {
  subtotal: number;
  deliveryFee: number;
  total: number;
  cancelled: boolean;
}) {
  return (
    <motion.aside
      initial={{
        opacity: 0,
        x: 30,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        scale: 1,
      }}
      viewport={viewport}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        rounded-[26px]
        border
        border-[var(--brand-border)]
        bg-white
        p-6
        shadow-[0_18px_50px_rgba(81,0,0,0.04)]

        lg:sticky
        lg:top-8
      "
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
        Summary
      </p>

      <h2 className="mt-2 font-serif text-2xl text-[var(--brand-text-dark)]">
        Order total
      </h2>

      <div className="mt-6 space-y-4">
        <SummaryRow
          label="Subtotal"
          value={subtotal}
        />

        <SummaryRow
          label="Delivery"
          value={deliveryFee}
        />
      </div>

      <div className="mt-6 border-t border-[var(--brand-border)] pt-5">
        <div className="flex items-end justify-between gap-4">
          <span className="text-sm font-medium text-[var(--brand-text-dark)]">
            Total
          </span>

          <span className="font-serif text-3xl text-[var(--brand-primary)]">
            AED {total.toFixed(2)}
          </span>
        </div>
      </div>

      <motion.div
        layout
        className={`
          mt-6
          flex
          items-center
          gap-3
          rounded-[16px]
          px-4
          py-3

          ${
            cancelled
              ? "bg-red-50 text-red-700"
              : "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"
          }
        `}
      >
        {cancelled ? (
          <XCircle size={17} />
        ) : (
          <PackageCheck
            size={17}
          />
        )}

        <p className="text-xs font-medium">
          {cancelled
            ? "Order cancelled"
            : "Order received successfully"}
        </p>
      </motion.div>

      <Link
        href="/#cheesecakes"
        className="
          group
          mt-6
          flex
          min-h-12
          w-full
          items-center
          justify-between
          rounded-full
          border
          border-[var(--brand-border)]
          px-5
          text-xs
          font-semibold
          text-[var(--brand-primary)]
          transition

          hover:border-[var(--brand-primary)]
        "
      >
        Order again

        <ChevronRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </motion.aside>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-[var(--brand-muted)]">
        {label}
      </span>

      <span className="text-sm font-medium text-[var(--brand-text-dark)]">
        AED {value.toFixed(2)}
      </span>
    </div>
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
    <motion.span
      key={status}
      initial={{
        opacity: 0,
        scale: 0.85,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
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
    </motion.span>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
        {eyebrow}
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[var(--brand-text-dark)]">
        {title}
      </h2>
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--brand-background)] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-[1120px] animate-pulse">
        <div className="h-4 w-28 rounded-full bg-black/5" />

        <div className="mt-7 h-12 w-64 rounded-xl bg-black/5" />

        <div className="mt-10 h-px bg-black/5" />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="h-[400px] rounded-[24px] bg-black/5" />

          <div className="h-[330px] rounded-[24px] bg-black/5" />
        </div>
      </div>
    </div>
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
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.94,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="max-w-[430px] text-center"
      >
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
          <ShoppingBag
            size={22}
          />
        </div>

        <h1 className="mt-5 font-serif text-3xl text-[var(--brand-text-dark)]">
          Order not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
          We couldn&apos;t find this
          order in your account.
        </p>

        <Link
          href="/account"
          className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--brand-primary)] px-7 text-xs font-semibold text-white"
        >
          <ArrowLeft size={15} />

          Back to account
        </Link>
      </motion.div>
    </div>
  );
}

function getItemName(
  item: OrderItem
) {
  return (
    item.name ??
    item.title ??
    item.productName ??
    "Velvet Crust Cheesecake"
  );
}