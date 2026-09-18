import AddressesPage from "@/components/account/addresses-page";

import Footer from "@/components/home/footer";
import Header from "@/components/home/header";

export const metadata = {
  title:
    "My Addresses | Velvet Crust",
};

export default function AddressesRoute() {
  return (
    <>
      <Header />

      <main className="pt-20 lg:pt-[92px]">
        <AddressesPage />
      </main>

      <Footer />
    </>
  );
}