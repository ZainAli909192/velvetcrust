import CylinderCarousel from "@/components/ui/cylinder-carousel";

const moments = [
  {
    title: "Birthdays",
    subtitle: "Sweeter Days",
    image: "/images/moments/birthday.png",
  },
  {
    title: "Celebrations",
    subtitle: "Made Sweeter",
    image: "/images/moments/celebrations.png",
  },
  {
    title: "Gifting",
    subtitle: "A Sweet Gesture",
    image: "/images/moments/gifting.png",
  },
  {
    title: "Just Because",
    subtitle: "Life Is Sweeter",
    image: "/images/moments/just-because.png",
  },
];

const momentImages = moments.map((moment) => ({
  src: moment.image,
  alt: moment.title,
  title: moment.title,
  subtitle: moment.subtitle,
}));

export default function MomentsSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--brand-background)] py-12 lg:py-24">
      <div className="mx-auto max-w-[1450px]">
        {/* Heading */}
        <div className="px-5 text-center sm:px-8">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--brand-primary)] sm:text-xs">
            Made for Your Moments
          </p>

          <h2 className="mt-3 font-serif text-[32px] leading-[1.02] text-[var(--brand-text-dark)] sm:text-5xl lg:text-6xl">
            Sweet moments,
            <br />
            made even sweeter.
          </h2>
        </div>

        {/* MOBILE CYLINDER */}
        <div className="mt-1 lg:hidden">
          <CylinderCarousel
            images={momentImages}
            cardWidth={145}
            cardHeight={210}
            duration={24}
            showContent
            className="!min-h-[320px]"
          />
        </div>

        {/* DESKTOP CYLINDER */}
        <div className="mt-6 hidden lg:block">
          <CylinderCarousel
            images={momentImages}
            cardWidth={280}
            cardHeight={380}
            duration={30}
            showContent
          />
        </div>
      </div>
    </section>
  );
}