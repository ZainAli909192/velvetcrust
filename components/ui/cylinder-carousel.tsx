"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface CarouselImage {
  src: string;
  alt?: string;

  // Optional content
  title?: string;
  subtitle?: string;
  href?: string;
  buttonLabel?: string;
}

interface CylinderCarouselProps {
  images: CarouselImage[];
  cardWidth?: number;
  cardHeight?: number;
  duration?: number;
  className?: string;

  showContent?: boolean;
}

export default function CylinderCarousel({
  images,
  cardWidth = 240,
  cardHeight = 320,
  duration = 28,
  className = "",
  showContent = false,
}: CylinderCarouselProps) {
  const items = useMemo(() => {
    if (images.length >= 8) return images;

    const repeated: CarouselImage[] = [];

    while (repeated.length < 8) {
      repeated.push(...images);
    }

    return repeated.slice(0, 8);
  }, [images]);

  const count = items.length;

  const radius =
    cardWidth / (2 * Math.tan(Math.PI / count)) + 30;

  return (
    <div
      className={`relative flex min-h-[430px] w-full items-center justify-center overflow-hidden md:min-h-[560px] ${className}`}
      style={{
        perspective: "1200px",
      }}
    >
      {/* Left Fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[15%] bg-gradient-to-r from-[var(--brand-background)] to-transparent" />

      {/* Right Fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[15%] bg-gradient-to-l from-[var(--brand-background)] to-transparent" />

      {/* Cylinder */}
      <div
        className="relative"
        style={{
          width: cardWidth,
          height: cardHeight,
          transformStyle: "preserve-3d",
          animation: `velvetCylinder ${duration}s linear infinite`,
        }}
      >
        {items.map((item, index) => {
          const angle = (360 / count) * index;

          return (
            <div
              key={`${item.src}-${index}`}
              className="absolute inset-0 overflow-hidden rounded-[26px] shadow-[0_20px_55px_rgba(72,25,28,0.15)]"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              {/* Image */}
              <img
                src={item.src}
                alt={item.alt ?? `Carousel image ${index + 1}`}
                className="h-full w-full object-cover"
              />

              {/* Moment Content */}
              {showContent && (
                <>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
                    {item.title && (
                      <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/75">
                        {item.title}
                      </p>
                    )}

                    {item.subtitle && (
                      <h3 className="mt-1 font-serif text-2xl leading-tight text-white sm:text-3xl">
                        {item.subtitle}
                      </h3>
                    )}

                    {item.href && (
                      <Link
                        href={item.href}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[9px] font-semibold text-[var(--brand-primary)] transition hover:bg-white sm:text-[10px]"
                      >
                        {item.buttonLabel ?? "Order Now"}

                        <ArrowRight size={13} />
                      </Link>
                    )}
                  </div>
                </>
              )}

              {/* Border */}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/20" />
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes velvetCylinder {
          from {
            transform: rotateY(0deg);
          }

          to {
            transform: rotateY(-360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          div[style*="velvetCylinder"] {
            animation-play-state: paused !important;
          }
        }
      `}</style>
    </div>
  );
}