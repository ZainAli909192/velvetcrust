"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  House,
  Heart,
  Mail,
  UserRound,
  CircleUserRound,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    activeIcon: House,
  },
  {
    label: "Our Story",
    href: "/our-story",
    icon: Heart,
    activeIcon: Heart,
  },
    {
    label: "Account",
    href: "/account",
    icon: UserRound,
    activeIcon: CircleUserRound,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: Mail,
    activeIcon: Mail,
  },

];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed
        bottom-4
        left-1/2
        z-[100]
        w-[calc(100%-28px)]
        max-w-[460px]
        -translate-x-1/2
        rounded-[24px]
        border
        border-[var(--brand-border)]
        bg-[var(--brand-cream)]/95
        px-2
        py-2
        shadow-[0_12px_40px_rgba(64,18,20,0.16)]
        backdrop-blur-xl
        lg:hidden
      "
    >
      <div className="grid grid-cols-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex min-h-[58px] flex-col items-center justify-center gap-1"
            >
              {/* Active background */}
              <span
                className={`absolute inset-x-2 inset-y-0 rounded-[18px] transition-all duration-300 ${
                  isActive
                    ? "bg-[var(--brand-primary-soft)]"
                    : "bg-transparent"
                }`}
              />

              {/* Icon */}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.4 : 1.7}
                fill={isActive ? "currentColor" : "none"}
                className={`relative z-10 transition-all duration-300 ${
                  isActive
                    ? "text-[var(--brand-primary)]"
                    : "text-[var(--brand-muted)]"
                }`}
              />

              {/* Label */}
              <span
                className={`relative z-10 text-[10px] font-semibold tracking-[0.03em] transition-colors ${
                  isActive
                    ? "text-[var(--brand-primary)]"
                    : "text-[var(--brand-muted)]"
                }`}
              >
                {item.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <span className="absolute -bottom-0.5 left-1/2 z-10 h-[3px] w-5 -translate-x-1/2 rounded-full bg-[var(--brand-primary)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}