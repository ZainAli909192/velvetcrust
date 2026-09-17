import { Suspense } from "react";
import PaymentPage from "@/components/checkout/payment-page";
import Header from "@/components/home/header";

export const metadata = {
  title: "Payment | Velvet Crust",
};

export default function PaymentRoute() {
  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-[92px]">
        <Suspense fallback={<div className="min-h-[70vh] bg-[var(--brand-background)]" />}>
          <PaymentPage />
        </Suspense>
      </main>
    </>
  );
}
