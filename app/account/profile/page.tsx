import ProfilePage from "@/components/account/profile-page";

import Footer from "@/components/home/footer";
import Header from "@/components/home/header";

export const metadata = {
  title:
    "My Profile | Velvet Crust",
};

export default function ProfileRoute() {
  return (
    <>
      <Header />

      <main className="pt-20 lg:pt-[92px]">
        <ProfilePage />
      </main>

      <Footer />
    </>
  );
}