import CylinderCarousel from "@/components/ui/cylinder-carousel";

const galleryImages = [
  {
    src: "/images/cheesecakes/blueberry1.png",
    alt: "Velvet Crust cheesecake",
  },
  {
    src: "/images/cheesecakes/classic.png",
    alt: "Blueberry cheesecake",
  },
  {
    src: "/images/cheesecakes/blueberry1.png",
    alt: "Lotus cheesecake",
  },
  {
    src: "/images/gallery/gallery-4.webp",
    alt: "Chocolate cheesecake",
  },
  {
    src: "/images/gallery/gallery-5.webp",
    alt: "Cheesecake packaging",
  },
  {
    src: "/images/gallery/gallery-6.webp",
    alt: "Fresh cheesecake slice",
  },
  {
    src: "/images/gallery/gallery-7.webp",
    alt: "Strawberry cheesecake",
  },
  {
    src: "/images/gallery/gallery-8.webp",
    alt: "Velvet Crust dessert",
  },
];

export default function SweetGallery() {
  return (
    <section className="relative overflow-hidden bg-[var(--brand-background)] py-16 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        {/* Heading */}
        <div className="px-5 text-center sm:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--brand-primary)] sm:text-xs">
            Sweet Gallery
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-[34px] leading-[1.05] text-[var(--brand-text-dark)] sm:text-5xl lg:text-6xl">
            Made to be admired.
            <br />
            Made to be enjoyed.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--brand-muted)]">
            A glimpse into our world of handcrafted cheesecakes.
          </p>
        </div>

        {/* Cylinder */}
        <div className="mt-4 lg:mt-8">
          <CylinderCarousel
            images={galleryImages}
            cardWidth={240}
            cardHeight={330}
            duration={32}
          />
        </div>
      </div>
    </section>
  );
}