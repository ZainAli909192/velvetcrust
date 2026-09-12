import { notFound } from "next/navigation";

import { cheesecakes } from "@/data/cheesecakes";
import OrderCheckout from "@/components/order/order-checkout";
import Header from "@/components/home/header";

type OrderPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function OrderPage({
  params,
}: OrderPageProps) {
  const { slug } = await params;

  const cheesecake = cheesecakes.find(
    (item) => item.slug === slug
  );

  if (!cheesecake) {
    notFound();
  }

  return (
    <>
    <Header />
      <OrderCheckout cheesecake={cheesecake} />
    </>
  );
}