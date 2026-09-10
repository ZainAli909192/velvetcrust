import Header from "./header";
import { ArrowRight, CakeSlice, ChefHat, Leaf } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="relative min-h-[100dvh] w-full overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/herobg.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFF7EA]/95 via-[#FFF7EA]/55 to-black/10" />

      {/* Header */}
      <Header />

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-[100dvh] items-center px-6 pb-12 pt-32 sm:px-10 lg:px-16 xl:px-24">
        <div className="w-full max-w-[700px]">
          {/* Eyebrow */}
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px w-10 bg-[#6E2527]" />

            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#6E2527] sm:text-sm">
              Homemade Cheesecakes
            </p>

            <span className="hidden h-px w-10 bg-[#6E2527] sm:block" />
          </div>

          {/* Heading */}
          <h1 className="font-serif text-[54px] font-medium leading-[0.92] tracking-[-0.03em] text-[#55191D] sm:text-6xl lg:text-[82px] xl:text-[94px]">
            A Slice
            <br />
            of Happiness
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-[510px] font-serif text-lg leading-8 text-[#513632] sm:text-xl">
            Crafted with premium ingredients, baked with love, and made
            for life&apos;s sweet moments.
          </p>

          {/* CTA */}
          <a
            href="/order"
            className=" hidden  mt-8 md:inline-flex items-center gap-4 rounded-full bg-[#861417] px-8 py-4 text-sm font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[#681014]"
          >
            Order Now
            <ArrowRight size={17} />
          </a>

          {/* Features */}
          <div className="mt-10 grid max-w-[520px] grid-cols-3 gap-3 sm:gap-7">
            <Feature
              icon={<Leaf size={27} strokeWidth={1.5} />}
              title="Premium"
              subtitle="Ingredients"
            />

            <Feature
              icon={<ChefHat size={28} strokeWidth={1.5} />}
              title="Homemade"
              subtitle="With Love"
            />

            <Feature
              icon={<CakeSlice size={28} strokeWidth={1.5} />}
              title="For Every"
              subtitle="Occasion"
            />
          </div>
        </div>
      </div>

      {/* Scroll */}
      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-4 lg:flex">
        <span className="h-px w-12 bg-[#6E2527]/50" />

        <span className="text-[10px] uppercase tracking-[0.3em] text-[#572326]">
          Scroll to Explore
        </span>

        <span className="h-px w-12 bg-[#6E2527]/50" />
      </div>
    </section>
  );
}

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

function Feature({ icon, title, subtitle }: FeatureProps) {
  return (
    <div className="flex flex-col items-center text-center text-[#682124] sm:items-start sm:text-left">
      {icon}

      <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.14em] sm:text-xs">
        {title}
      </p>

      <p className="text-[10px] uppercase tracking-[0.12em] sm:text-xs">
        {subtitle}
      </p>
    </div>
  );
}