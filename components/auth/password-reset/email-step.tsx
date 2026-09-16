"use client";

import axios from "axios";
import {
  ArrowRight,
  Mail,
} from "lucide-react";
import {
  FormEvent,
  useState,
} from "react";
import { motion } from "framer-motion";

import { api } from "@/lib/api/client";

type Props = {
  onSuccess: (
    email: string
  ) => void;
};

export default function EmailStep({
  onSuccess,
}: Props) {
  const [email, setEmail] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const validateEmail = (
    value: string
  ) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    if (!normalizedEmail) {
      setError(
        "Enter your email address."
      );

      return;
    }

    if (
      !validateEmail(
        normalizedEmail
      )
    ) {
      setError(
        "Enter a valid email address."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post(
          "/api/auth/forgot-password",
          {
            email:
              normalizedEmail,
          }
        );

      if (
        response.data?.success !==
        true
      ) {
        setError(
          response.data?.message ??
            "Unable to send the verification code."
        );

        return;
      }

      onSuccess(
        normalizedEmail
      );
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        const message =
          error.response?.data
            ?.message;

        setError(
          typeof message ===
            "string"
            ? message
            : "Unable to send the verification code."
        );

        return;
      }

      setError(
        "Unable to send the verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.23em]
            text-[#721C20]
          "
        >
          Account recovery
        </p>

        <h1
          className="
            mt-3
            font-serif
            text-[36px]
            leading-[1.05]
            text-[#321716]

            sm:text-[44px]
          "
        >
          Forgot password?
        </h1>

        <p
          className="
            mt-3
            max-w-[430px]
            text-sm
            leading-6
            text-[#806A64]
          "
        >
          Enter the email
          associated with your
          account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8"
        noValidate
      >
        <label
          htmlFor="reset-email"
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-[#321716]
          "
        >
          Email address
        </label>

        <div
          className={`
            mt-2
            flex
            min-h-[58px]
            items-center
            rounded-[18px]
            border
            bg-[#FFF9F2]
            px-4
            transition-all
            duration-300
            focus-within:ring-4

            ${
              error
                ? `
                  border-[#A62C31]/50
                  focus-within:border-[#A62C31]/60
                  focus-within:ring-[#A62C31]/[0.05]
                `
                : `
                  border-[#E9D4C7]
                  focus-within:border-[#8A2529]/50
                  focus-within:ring-[#8A2529]/[0.05]
                `
            }
          `}
        >
          <Mail
            size={19}
            strokeWidth={1.5}
            className={`
              shrink-0
              transition-colors

              ${
                error
                  ? "text-[#A62C31]"
                  : "text-[#947B73]"
              }
            `}
          />

          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(
                event.target.value
              );

              if (error) {
                setError("");
              }
            }}
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@example.com"
            disabled={loading}
            className="
              min-w-0
              flex-1
              bg-transparent
              px-3
              text-[15px]
              text-[#321716]
              outline-none
              placeholder:text-[#A9948D]
              disabled:cursor-not-allowed
            "
          />
        </div>

        <div
          className="
            min-h-[30px]
            pt-2
          "
        >
          {error && (
            <motion.p
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              role="alert"
              className="
                text-xs
                font-medium
                leading-5
                text-[#9B2025]
              "
            >
              {error}
            </motion.p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={
            loading
              ? undefined
              : {
                  y: -2,
                }
          }
          whileTap={
            loading
              ? undefined
              : {
                  scale: 0.985,
                }
          }
          className="
            flex
            min-h-[54px]
            w-full
            items-center
            justify-center
            gap-3
            rounded-full
            bg-[#7B2025]
            px-6

            text-[11px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-white

            transition-colors
            duration-300

            hover:bg-[#61171B]

            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? (
            <>
              <span
                className="
                  h-4
                  w-4
                  animate-spin
                  rounded-full
                  border-2
                  border-white/30
                  border-t-white
                "
              />

              Sending...
            </>
          ) : (
            <>
              Send code

              <ArrowRight
                size={16}
              />
            </>
          )}
        </motion.button>

        <a
          href="/account"
          className="
            mt-5
            block
            text-center
            text-xs
            font-medium
            text-[#806A64]
            transition-colors
            hover:text-[#721C20]
          "
        >
          Back to sign in
        </a>
      </form>
    </div>
  );
}