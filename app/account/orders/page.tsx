"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "@/components/store/auth-context";
import OrdersList from "@/components/account/orders-list";

export default function OrdersPage() {
  const router = useRouter();

  const {
    user,
    orders,
    isReady,
  } = useAuth();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[var(--brand-background)]" />
    );
  }

  if (!user) {
    router.replace("/account");
    return null;
  }

  return (
    <main className="min-h-screen bg-[var(--brand-background)] px-4 pb-32 pt-8 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12">
      <div className="mx-auto max-w-[1120px]">

        <motion.button
          type="button"
          onClick={() => router.back()}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ scale: 0.96 }}
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
          <ArrowLeft size={16} />

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
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-8 mt-7"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]">
            My account
          </p>

          <h1 className="mt-2 font-serif text-4xl text-[var(--brand-text-dark)] sm:text-5xl">
            My Orders
          </h1>

          <p className="mt-2 text-sm text-[var(--brand-muted)]">
            View and manage your Velvet Crust orders.
          </p>
        </motion.div>

        <OrdersList orders={orders} />
      </div>
    </main>
  );
}