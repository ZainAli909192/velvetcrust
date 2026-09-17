"use client";

import Image from "next/image";
import Script from "next/script";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useAuth,
} from "@/components/store/auth-context";

type GoogleLoginProps = {
  onSuccess?: () => void;
};

export default function GoogleLogin({
  onSuccess,
}: GoogleLoginProps) {
  const {
    googleLogin,
    isAuthLoading,
  } = useAuth();

  const googleButtonRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [
    isGoogleReady,
    setIsGoogleReady,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const handleCredential =
    useCallback(
      async (
        response: GoogleCredentialResponse
      ) => {
        if (
          !response.credential
        ) {
          setError(
            "Google sign in could not be completed."
          );

          return;
        }

        setError("");

        const result =
          await googleLogin(
            response.credential
          );

        if (
          !result.success
        ) {
          setError(
            result.message ||
              "Unable to sign in with Google."
          );

          return;
        }

        onSuccess?.();
      },
      [
        googleLogin,
        onSuccess,
      ]
    );

  const initializeGoogle =
    useCallback(() => {
      const clientId =
        process.env
          .NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      if (!clientId) {
        console.error(
          "GOOGLE_CLIENT_ID is not configured."
        );

        setIsGoogleReady(
          false
        );

        return;
      }

      if (
        !window.google
          ?.accounts?.id
      ) {
        return;
      }

      window.google.accounts.id.initialize(
        {
          client_id:
            clientId,

          callback: (
            response
          ) => {
            void handleCredential(
              response
            );
          },

          auto_select:
            false,

          cancel_on_tap_outside:
            true,
        }
      );

      setIsGoogleReady(
        true
      );

      setError("");
    }, [
      handleCredential,
    ]);

  useEffect(() => {
    if (
      !isGoogleReady ||
      !googleButtonRef.current ||
      !window.google
        ?.accounts?.id
    ) {
      return;
    }

    googleButtonRef.current.innerHTML =
      "";

    window.google.accounts.id.renderButton(
      googleButtonRef.current,
      {
        type:
          "standard",

        theme:
          "outline",

        size:
          "large",

        text:
          "continue_with",

        shape:
          "pill",

        width:
          240,
      }
    );
  }, [
    isGoogleReady,
  ]);

  return (
    <div className="min-w-0">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          initializeGoogle();
        }}
        onError={() => {
          setIsGoogleReady(
            false
          );

          setError(
            "Google sign in could not be loaded."
          );
        }}
      />

      <div
        className="
          relative
          h-[46px]
          w-full
          overflow-hidden
          rounded-full
        "
      >
        <button
          type="button"
          disabled={
            !isGoogleReady ||
            isAuthLoading
          }
          className="
            flex
            h-[46px]
            w-full
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-[#D7DCE2]
            bg-white
            px-3
            text-xs
            font-medium
            text-[#1F1F1F]
            transition

            hover:bg-[#FAFAFA]

            disabled:cursor-not-allowed
            disabled:opacity-70

            sm:text-sm
          "
        >
          <Image
            src="/images/payments/google.png"
            alt=""
            width={20}
            height={20}
            className="
              size-5
              shrink-0
              object-contain
            "
          />

          <span>
            Google
          </span>
        </button>

        {isGoogleReady && (
          <div
            ref={
              googleButtonRef
            }
            className="
              absolute
              inset-0
              z-10
              overflow-hidden
              opacity-0
            "
          />
        )}
      </div>

      {error && (
        <p
          className="
            mt-2
            text-center
            text-[10px]
            font-medium
            text-[#A42C2C]
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}
