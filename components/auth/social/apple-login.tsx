"use client";

import Image from "next/image";

import {
  useState,
} from "react";

import {
  LoaderCircle,
} from "lucide-react";

import {
  useAuth,
} from "@/components/store/auth-context";

export default function AppleLogin() {
  const {
    isAuthLoading,
  } = useAuth();

  const [
    isAppleLoading,
    setIsAppleLoading,
  ] = useState(false);

  const handleAppleLogin =
    async () => {
      if (
        isAuthLoading ||
        isAppleLoading
      ) {
        return;
      }

      setIsAppleLoading(true);

      try {
        window.location.assign(
          "/api/auth/apple/start"
        );
      } catch (error) {
        console.error(
          "Apple login error:",
          error
        );

        setIsAppleLoading(false);
      }
    };

  return (
    <button
      type="button"
      disabled={
        isAuthLoading ||
        isAppleLoading
      }
      onClick={() => {
        void handleAppleLogin();
      }}
      className="
        flex
        min-h-[46px]
        min-w-0
        w-full
        items-center
        justify-center
        gap-2
        rounded-full
        border
        border-[#D7D7D7]
        bg-white
        px-3
        text-xs
        font-medium
        text-[#1F1F1F]
        transition
        hover:bg-[#FAFAFA]
        disabled:cursor-not-allowed
        disabled:opacity-60
hover:cursor-pointer
        sm:text-sm
      "
    >
      {isAppleLoading ? (
        <LoaderCircle
          size={17}
          className="animate-spin"
        />
      ) : (
        <Image
          src="/images/payments/apple.png"
          alt=""
          width={20}
          height={20}
          className="
            size-5
            shrink-0
            object-contain
          "
        />
      )}

      <span className="truncate">
        Apple
      </span>
    </button>
  );
}