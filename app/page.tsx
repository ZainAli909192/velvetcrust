// export default function Home() {
//   return (
//     <main className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-[#f3e7d8]">
      
//       {/* Desktop */}
//       <div
//         className="hidden h-full w-full bg-center bg-no-repeat lg:block"
//         style={{
//           backgroundImage: "url('/commingsoon.png')",
//           backgroundSize: "contain",
//         }}
//       />

//       {/* Mobile + Tablet */}
//       <div
//         className="block h-full w-full bg-center bg-no-repeat lg:hidden"
//         style={{
//           backgroundImage: "url('/mobilecommingsoon.png')",
//           backgroundSize: "contain",
//         }}
//       />
      
//     </main>
//   );
// }
import Hero from "@/components/home/hero";
import CheesecakesSection from "@/components/home/cheesecakes-section";
import MomentsSection from "@/components/home/moments-section";
import FinalCTA from "@/components/home/final-cta";
import Footer from "@/components/home/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <CheesecakesSection />
      <MomentsSection />
      {/* <SweetGallery /> */}
      <FinalCTA />
      <Footer />
    </main>
  );
}
