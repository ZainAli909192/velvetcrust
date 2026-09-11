"use client";

import SiteLoader from "@/components/ui/site-loader";
import MobileBottomNav from "@/components/home/mobile-bottom-nav";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteLoader />

      {children}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </>
  );
}