"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  House,
  Heart,
  UserRound,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "@/components/store/cart-context";

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
    activeIcon: UserRound,
  },
  {
    label: "Cart",
    href: "/cart",
    icon: ShoppingBag,
    activeIcon: ShoppingBag,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <nav
      className="
        fixed
        bottom-4
        left-1/2
        z-[500]
        w-[calc(100%-28px)]
        max-w-[520px]
        -translate-x-1/2
        rounded-[26px]
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
              : pathname.startsWith(
                  item.href
                );

          const Icon = isActive
            ? item.activeIcon
            : item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="
                relative
                flex
                min-h-[60px]
                flex-col
                items-center
                justify-center
                gap-1
              "
            >
              {/* Active Background */}

              <span
                className={`
                  absolute
                  inset-x-1
                  inset-y-0
                  rounded-[18px]
                  transition-all
                  duration-300

                  ${
                    isActive
                      ? "bg-[var(--brand-primary-soft)]"
                      : "bg-transparent"
                  }
                `}
              />

              {/* Icon */}

              <div className="relative z-10">
                <Icon
                  size={22}
                  strokeWidth={
                    isActive ? 2.4 : 1.7
                  }
                  fill={
                    isActive
                      ? "currentColor"
                      : "none"
                  }
                  className={
                    isActive
                      ? "text-[var(--brand-primary)]"
                      : "text-[var(--brand-muted)]"
                  }
                />

                {/* Cart Count */}

                {item.href === "/cart" &&
                  totalItems > 0 && (
                    <span
                      className="
                        absolute
                        -right-3
                        -top-2
                        flex
                        h-[17px]
                        min-w-[17px]
                        items-center
                        justify-center
                        rounded-full
                        bg-[var(--brand-primary)]
                        px-1
                        text-[8px]
                        font-bold
                        text-white
                      "
                    >
                      {totalItems > 99
                        ? "99+"
                        : totalItems}
                    </span>
                  )}
              </div>

              {/* Label */}

              <span
                className={`
                  relative
                  z-10
                  text-[10px]
                  font-semibold

                  ${
                    isActive
                      ? "text-[var(--brand-primary)]"
                      : "text-[var(--brand-muted)]"
                  }
                `}
              >
                {item.label}
              </span>

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
