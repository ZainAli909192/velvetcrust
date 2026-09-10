"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/our-story" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  return (
    <header className="absolute left-0 top-0 z-50 w-full">
      <div className="mx-auto flex h-24 w-full items-center justify-between px-5 sm:px-8 lg:h-32 lg:px-16 xl:px-24">
        {/* Logo */}
        <Link href="/" className="relative z-50">
          <Image
            src="/images/logo2.png"
            alt="Velvet Crust"
            width={150}
            height={150}
            priority
            className="h-[82px] w-[82px] rounded-[35%] object-contain sm:h-[95px] sm:w-[95px] lg:h-[130px] lg:w-[130px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-12 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium uppercase tracking-[0.12em] text-[var(--brand-text)] transition hover:text-[var(--brand-primary)]"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/order"
            className="flex items-center gap-3 rounded-full bg-[var(--brand-primary)] px-7 py-4 text-sm font-medium uppercase tracking-[0.12em] text-white transition hover:bg-[var(--brand-primary-dark)]"
          >
            Order Now
            <ArrowRight size={16} />
          </Link>
        </nav>

        {/* Mobile Order Button */}
        <Link
          href="/order"
          className="flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.13em] text-white lg:hidden"
        >
          Order Now
          <ArrowRight size={14} />
        </Link>
      </div>
    </header>
  );
}