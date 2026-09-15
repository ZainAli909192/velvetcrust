import Header from "@/components/home/header";
import Footer from "@/components/home/footer";
import FinalCTA from "@/components/home/final-cta";

import StoryHero from "@/components/ourstory/story-hero";
import OurBeginning from "@/components/ourstory/our-beginning";
import OurCraft from "@/components/ourstory/our-craft";
import BrandStatement from "@/components/ourstory/brand-statement";
import WhatMatters from "@/components/ourstory/what-matters";
import StoryMoments from "@/components/ourstory/story-moments";

export default function OurStoryPage() {
  return (
    <main className="overflow-hidden bg-[var(--brand-background)]">
      <Header />
<div className="md:hidden">

      <BrandStatement />
</div>
<div className="hidden md:block">

      <StoryHero />
</div>
      <OurBeginning />
      <OurCraft />
      <WhatMatters />
      <StoryMoments />

      <FinalCTA />
      <Footer />
    </main>
  );
}