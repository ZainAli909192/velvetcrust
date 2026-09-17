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
        <CheckoutPage />
      </main>
    </>
  );
}