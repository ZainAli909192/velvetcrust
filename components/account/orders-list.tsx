"use client";

import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import OrderCard from "./order-card";
import Button from "@/components/ui/button";

type Order = {
  id: string;
  status: string;
  date: string;
  itemCount: number;
  total: number;
};

export default function OrdersList({
  orders,
}: {
  orders: Order[];
}) {
  if (!orders.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-20 text-center"
      >
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
          <ShoppingBag size={23} />
        </div>

        <h2 className="mt-5 font-serif text-2xl text-[var(--brand-text-dark)]">
          No orders yet
        </h2>

        <p className="mx-auto mt-2 max-w-[300px] text-sm leading-6 text-[var(--brand-muted)]">
          Your Velvet Crust orders will appear here.
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

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {orders.map((order, index) => (
        <OrderCard
          key={order.id}
          order={order}
          index={index}
        />
      ))}
    </div>
  );
}