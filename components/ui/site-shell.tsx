"use client";

import SiteLoader from "@/components/ui/site-loader";
import MobileBottomNav from "@/components/home/mobile-bottom-nav";

import { CartProvider } from "@/components/store/cart-context";
import { AuthProvider } from "@/components/store/auth-context";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ConnectMenu } from "./connect-menu";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <SiteLoader />
<ConnectMenu />
          {children}

          <MobileBottomNav />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
