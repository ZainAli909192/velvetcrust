"use client";

import {
  Check,
  ChefHat,
  Clock3,
  PackageCheck,
  Truck,
  X,
} from "lucide-react";

type Props = {
  status: string;
};

const statusConfig = {
  Pending: {
    icon: Clock3,
    label: "Pending",
  },
  Confirmed: {
    icon: Check,
    label: "Confirmed",
  },
  Preparing: {
    icon: ChefHat,
    label: "Preparing",
  },
  "Out for delivery": {
    icon: Truck,
    label: "Out for delivery",
  },
  Delivered: {
    icon: PackageCheck,
    label: "Delivered",
  },
  Cancelled: {
    icon: X,
    label: "Cancelled",
  },
};

export default function OrderStatus({ status }: Props) {
  const config =
    statusConfig[status as keyof typeof statusConfig] ??
    statusConfig.Pending;

  const Icon = config.icon;

  const cancelled = status === "Cancelled";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-3
        py-1.5
        text-[10px]
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
      <Icon size={13} strokeWidth={1.8} />

      {config.label}
    </span>
  );
}