import { notFound } from "next/navigation";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import OrderCheckout from "@/components/order/order-checkout";
import Header from "@/components/home/header";
import Footer from "@/components/home/footer";

type OrderPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function OrderPage({
  params,
}: OrderPageProps) {
  const { slug } = await params;

  await connectDB();

  const product = await Product.findOne({
    slug,
    isActive: true,
  })
    .select("_id name slug description price image")
    .lean();

  if (!product) {
    notFound();
  }

  const cheesecake = {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    image: product.image,
  };

  return (
    <>
    <Header />
      <OrderCheckout cheesecake={cheesecake} />
      <Footer />
    </>
  );
}
