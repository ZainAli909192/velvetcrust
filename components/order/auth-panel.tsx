"use client";

import { useState } from "react";

import AuthForm from "@/components/auth/auth-form";
import SocialAuth from "@/components/auth/social/social-auth";

type AuthMode =
  | "login"
  | "signup";

type AuthPanelProps = {
  onSuccess?: () => void;
  checkout?: boolean;
};

export default function AuthPanel({
  onSuccess,
  checkout = false,
}: AuthPanelProps) {
  const [mode, setMode] =
    useState<AuthMode>("login");

  const handleModeChange = (
    nextMode: AuthMode
  ) => {
    setMode(nextMode);
  };

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[560px]
        bg-transparent

        lg:rounded-[28px]
        lg:border
        lg:border-[var(--brand-border)]
        lg:bg-white
        lg:p-8
        lg:shadow-[0_18px_50px_rgba(50,23,22,0.06)]
      "
    >
      <div
        className="
          grid
          grid-cols-2
          rounded-full
          bg-[var(--brand-primary-soft)]
          p-1
        "
      >
        <button
          type="button"
          onClick={() =>
            handleModeChange(
              "login"
            )
          }
          className={`
            min-h-[48px]
            rounded-full
            px-3
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.12em]
            transition-all
            duration-300

            ${
              mode === "login"
                ? `
                  bg-white
                  text-[var(--brand-primary)]
                  shadow-[0_3px_10px_rgba(50,23,22,0.08)]
                `
                : `
                  bg-transparent
                  text-[var(--brand-text-dark)]
                  hover:bg-white/40
                `
            }
          `}
        >
          Sign in
        </button>

        <button
          type="button"
          onClick={() =>
            handleModeChange(
              "signup"
            )
          }
          className={`
            min-h-[48px]
            rounded-full
            px-3
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.12em]
            transition-all
            duration-300

            ${
              mode === "signup"
                ? `
                  bg-white
                  text-[var(--brand-primary)]
                  shadow-[0_3px_10px_rgba(50,23,22,0.08)]
                `
                : `
                  bg-transparent
                  text-[var(--brand-text-dark)]
                  hover:bg-white/40
                `
            }
          `}
        >
          Create account
        </button>
      </div>

      <div className="mt-7">
       

      

        {checkout && (
          <p
            className="
              mt-3
              max-w-md
              text-sm
              leading-6
              text-[var(--brand-muted)]
            "
          >
            Sign in or create an
            account to continue with
            your order.
          </p>
        )}
      </div>

      <div className="mt-7">
        <SocialAuth
          onSuccess={onSuccess}
        />
      </div>

      <div
        className="
          my-6
          flex
          items-center
          gap-3

          sm:gap-4
        "
      >
        <span
          className="
            h-px
            flex-1
            bg-[var(--brand-border)]
          "
        />

        <span
          className="
            shrink-0
            whitespace-nowrap
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-[var(--brand-muted)]

            sm:text-[10px]
            sm:tracking-[0.16em]
          "
        >
          Or continue with email
        </span>

        <span
          className="
            h-px
            flex-1
            bg-[var(--brand-border)]
          "
        />
      </div>

      <AuthForm
        mode={mode}
        onSuccess={onSuccess}
      />
    </div>
  );
}