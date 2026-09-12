import CartPage from "@/components/cart/cart-page";
import Header from "@/components/home/header";

export const metadata = {
  title: "Your Cart | Velvet Crust",
};

export default function CartRoute() {
  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-[92px]">
        <CartPage />
      </main>
    </>
  );
}
