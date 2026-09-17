import { Suspense } from "react";
import CheckoutPage from "@/components/checkout/checkout-page";
import Header from "@/components/home/header";

export const metadata = {
  title: "Checkout | Velvet Crust",
};

export default function CheckoutRoute() {
  return (
    <>
      <Header />

      <main className="pt-20 lg:pt-[92px]">
        <Suspense fallback={<div className="min-h-[70vh] bg-[var(--brand-background)]" />}>
          <CheckoutPage />
        </Suspense>
      </main>
    </>
  );
}
