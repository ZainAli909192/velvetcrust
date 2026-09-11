"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  BookOpen,
  UserRound,
  ShoppingBag,
} from "lucide-react";

const links = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Our Story",
    href: "/our-story",
    icon: BookOpen,
  },
  {
    label: "Account",
    href: "/account",
    icon: UserRound,
  },
  {
    label: "Cart",
    href: "/cart",
    icon: ShoppingBag,
  },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Check initial position
    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      id="home"
      className={`
        fixed
        left-0
        top-0
        z-50
        w-full
        transition-all
        duration-500

        ${
          scrolled
            ? `
              bg-[var(--brand-background)]/95
              shadow-[0_8px_30px_rgba(50,23,22,0.08)]
              backdrop-blur-xl
            `
            : "bg-transparent"
        }
      `}
    >
      <div
        className={`
          mx-auto
          flex
          w-full
          items-center
          justify-between
          px-5
          transition-all
          duration-500

          sm:px-8
          lg:px-16
          xl:px-24

          ${
            scrolled
              ? "h-20 lg:h-[92px]"
              : "h-24 lg:h-32"
          }
        `}
      >
        {/* Logo */}
        <Link href="/" className="relative z-50 mt-2">
          <Image
            src="/images/logo.png"
            alt="Velvet Crust"
            width={150}
            height={150}
            priority
            className={`
              rounded-[35%]
              object-contain
              transition-all
              duration-500

              ${
                scrolled
                  ? `
                    h-[68px]
                    w-[68px]
                    sm:h-[72px]
                    sm:w-[72px]
                    lg:h-[82px]
                    lg:w-[82px]
                  `
                  : `
                    h-[82px]
                    w-[82px]
                    sm:h-[95px]
                    sm:w-[95px]
                    lg:h-[130px]
                    lg:w-[130px]
                  `
              }
            `}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-3 lg:flex">
          {links.map((link) => {
            const Icon = link.icon;

            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  group
                  relative
                  flex
                  items-center
                  gap-2
                  rounded-full
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  uppercase
                  tracking-[0.11em]
                  transition-all
                  duration-300

                  ${
                    isActive
                      ? scrolled
                        ? `
                          bg-[var(--brand-primary-soft)]
                          text-[var(--brand-primary)]
                        `
                        : `
                          bg-[var(--brand-cream)]
                          text-[var(--brand-primary)]
                        `
                      : scrolled
                        ? `
                          text-[var(--brand-text)]
                          hover:bg-[var(--brand-primary-soft)]
                          hover:text-[var(--brand-primary)]
                        `
                        : `
                          text-white
                          hover:bg-white/10
                          hover:text-white
                        `
                  }
                `}
              >
                <Icon
                  size={17}
                  strokeWidth={isActive ? 2.3 : 1.7}
                  className="
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />

                <span>{link.label}</span>

                {/* Active Indicator */}
                {isActive && (
                  <span
                    className="
                      absolute
                      -bottom-1
                      left-1/2
                      h-[3px]
                      w-5
                      -translate-x-1/2
                      rounded-full
                      bg-[var(--brand-primary)]
                    "
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}