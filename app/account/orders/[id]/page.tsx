import OrderDetails from "@/components/account/order-details";
import Footer from "@/components/home/footer";
import Header from "@/components/home/header";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  return (
    <>
    <Header />
    <OrderDetails
      orderId={decodeURIComponent(id)}
      />
    <Footer />
      </>
  );
}