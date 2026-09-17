"use client";

import Header from "./header";
import MobileHeroContent from "./mobile-hero-content";
import DesktopHeroContent from "./desktop-hero-content";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden">
      {/* Mobile video */}
      <video
        autoPlay
        muted
        loop
        controls={false}
        playsInline
        preload="auto"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          object-center
          lg:hidden
        "
      >
        <source
          src="/mob-video.mp4"
          type="video/mp4"
        />
      </video>

      {/* Mobile brand tint */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          bg-[#510000]/5
          lg:hidden
        "
      />

      {/* Mobile warm light */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[2]
          bg-[linear-gradient(to_bottom,rgba(255,247,234,0.08)_0%,rgba(255,247,234,0.05)_30%,rgba(70,18,18,0.03)_60%,rgba(45,8,8,0.12)_100%)]
          lg:hidden
        "
      />

      {/* Mobile readability glow */}
      <div
        className="
          pointer-events-none
          absolute
          -left-[20%]
          bottom-[7%]
          z-[2]
          h-[66%]
          w-[105%]
          bg-[radial-gradient(ellipse_at_left_center,rgba(255,244,229,0.24)_0%,rgba(255,238,220,0.11)_42%,transparent_73%)]
          blur-[10px]
          lg:hidden
        "
      />

      {/* Mobile bottom depth */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-[2]
          h-[35%]
          bg-gradient-to-t
          from-[#300606]/18
          via-[#510000]/5
          to-transparent
          lg:hidden
        "
      />

      {/* Desktop video */}
      <video
        autoPlay
        muted
        loop
        controls={false}
        playsInline
        preload="auto"
        className="
          absolute
          inset-0
          hidden
          h-full
          w-full
          object-cover
          object-center
          lg:block
        "
      >
        <source
          src="/images/video.mp4"
          type="video/mp4"
        />
      </video>

      {/* Desktop overlay */}
      <div
        className="
          absolute
          inset-0
          z-[1]
          hidden
          bg-gradient-to-r
          from-[#FFF7EA]/95
          via-[#FFF7EA]/55
          to-black/10
          lg:block
        "
      />

      <Header />

      <MobileHeroContent />

      <DesktopHeroContent />
    </section>
  );
}