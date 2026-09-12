import AccountPage from "@/components/account/account-page";
import Footer from "@/components/home/footer";
import Header from "@/components/home/header";

export const metadata = { title: "My Account | Velvet Crust" };

export default async function AccountRoute({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const safeNext = next === "/checkout" ? next : undefined;

  return <><Header />
  <main className="pt-20 lg:pt-[92px]"><AccountPage next={safeNext} /></main>
  <Footer />
  
  </>;
}
