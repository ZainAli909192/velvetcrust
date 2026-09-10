import type { Metadata } from "next";
import "./globals.css";
import MobileBottomNav from "@/components/home/mobile-bottom-nav";

export const metadata: Metadata = {
  title: "Velvet Crust",
  description: "Homemade cheesecakes crafted with love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        <MobileBottomNav />
      </body>
    </html>
  );
}