import Header from "@/components/home/header";
import Footer from "@/components/home/footer";
// import CollaborationHero from "@/components/collaborate/collaboration-hero";
import CollaborationForm from "@/components/collaborate/collaboration-form";

export default function CollaboratePage() {
  return (
    <main className="overflow-hidden bg-[#FFF9F2]">
      <Header />

      {/* <CollaborationHero /> */}

      <CollaborationForm />

      <Footer />
    </main>
  );
}