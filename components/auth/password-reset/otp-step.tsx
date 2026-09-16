"use client";

import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  MailCheck,
} from "lucide-react";
import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useAnimationControls,
} from "framer-motion";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

type Props = {
  email: string;
  onBack: () => void;
  onSuccess: (
    resetToken: string
  ) => void;
};

export default function OtpStep({
  email,
  onBack,
  onSuccess,
}: Props) {
  const [digits, setDigits] =
    useState<string[]>(
      Array(OTP_LENGTH).fill("")
    );

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [seconds, setSeconds] =
    useState(RESEND_SECONDS);

  const inputsRef =
    useRef<
      Array<HTMLInputElement | null>
    >([]);

  const controls =
    useAnimationControls();

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setSeconds(
          (current) =>
            current - 1
        );
      }, 1000);

    return () =>
      window.clearInterval(
        timer
      );
  }, [seconds]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (
    index: number,
    value: string
  ) => {
    const numeric =
      value.replace(/\D/g, "");

    if (!numeric) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    const next = [...digits];

    next[index] =
      numeric.slice(-1);

    setDigits(next);
    setError("");

    if (
      index <
      OTP_LENGTH - 1
    ) {
      inputsRef.current[
        index + 1
      ]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key ===
        "Backspace" &&
      !digits[index] &&
      index > 0
    ) {
      inputsRef.current[
        index - 1
      ]?.focus();
    }

    if (
      event.key ===
        "ArrowLeft" &&
      index > 0
    ) {
      inputsRef.current[
        index - 1
      ]?.focus();
    }

    if (
      event.key ===
        "ArrowRight" &&
      index <
        OTP_LENGTH - 1
    ) {
      inputsRef.current[
        index + 1
      ]?.focus();
    }
  };

  const handlePaste = (
    event: ClipboardEvent
  ) => {
    event.preventDefault();

    const pasted =
      event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(
          0,
          OTP_LENGTH
        );

    if (!pasted) return;

    const next =
      Array(OTP_LENGTH).fill("");

    pasted
      .split("")
      .forEach(
        (digit, index) => {
          next[index] =
            digit;
        }
      );

    setDigits(next);
    setError("");

    const focusIndex =
      Math.min(
        pasted.length,
        OTP_LENGTH
      ) - 1;

    inputsRef.current[
      focusIndex
    ]?.focus();
  };

  const shake = async () => {
    await controls.start({
      x: [
        0,
        -7,
        7,
        -5,
        5,
        0,
      ],
      transition: {
        duration: 0.35,
      },
    });
  };

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    const otp =
      digits.join("");

    if (
      otp.length !==
      OTP_LENGTH
    ) {
      setError(
        "Enter the complete 6-digit code."
      );

      await shake();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await axios.post(
          "/api/auth/verify-reset-otp",
          {
            email,
            otp,
          }
        );

      const resetToken =
        response.data
          ?.resetToken;

      if (!resetToken) {
        setError(
          "Unable to verify the code."
        );

        await shake();
        return;
      }

      onSuccess(resetToken);
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        setError(
          error.response?.data
            ?.message ??
            "Incorrect verification code."
        );
      } else {
        setError(
          "Unable to verify the code."
        );
      }

      await shake();
    } finally {
      setLoading(false);
    }
  };

  const handleResend =
    async () => {
      if (
        seconds > 0 ||
        resending
      ) {
        return;
      }

      try {
        setResending(true);
        setError("");

        await axios.post(
          "/api/auth/forgot-password",
          {
            email,
          }
        );

        setDigits(
          Array(
            OTP_LENGTH
          ).fill("")
        );

        setSeconds(
          RESEND_SECONDS
        );

        window.setTimeout(
          () => {
            inputsRef.current[
              0
            ]?.focus();
          },
          50
        );
      } catch (error) {
        if (
          axios.isAxiosError(
            error
          )
        ) {
          setError(
            error.response?.data
              ?.message ??
              "Unable to resend the code."
          );
        } else {
          setError(
            "Unable to resend the code."
          );
        }
      } finally {
        setResending(false);
      }
    };

  const maskedEmail =
    maskEmail(email);

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="
          mb-7
          inline-flex
          items-center
          gap-2
          text-xs
          font-medium
          text-[#806A64]
          transition-colors
          hover:text-[#721C20]
        "
      >
        <ArrowLeft size={15} />
        Change email
      </button>

      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-[#F5E8E2]
          text-[#721C20]
        "
      >
        <MailCheck
          size={21}
          strokeWidth={1.5}
        />
      </div>

      <p
        className="
          mt-5
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.23em]
          text-[#721C20]
        "
      >
        Verification
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
        Check your email.
      </h1>

      <p
        className="
          mt-3
          text-sm
          leading-6
          text-[#806A64]
        "
      >
        We sent a 6-digit code
        to{" "}
        <span
          className="
            font-medium
            text-[#4B302D]
          "
        >
          {maskedEmail}
        </span>
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8"
      >
        <motion.div
          animate={controls}
          onPaste={handlePaste}
          className="
            grid
            grid-cols-6
            gap-2
            sm:gap-3
          "
        >
          {digits.map(
            (digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputsRef.current[
                    index
                  ] = element;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete={
                  index === 0
                    ? "one-time-code"
                    : "off"
                }
                maxLength={1}
                value={digit}
                onChange={(
                  event
                ) =>
                  handleChange(
                    index,
                    event.target
                      .value
                  )
                }
                onKeyDown={(
                  event
                ) =>
                  handleKeyDown(
                    index,
                    event
                  )
                }
                aria-label={`Digit ${
                  index + 1
                }`}
                className={`
                  aspect-square
                  min-w-0
                  rounded-[14px]
                  border
                  bg-[#FFF9F2]
                  text-center
                  font-serif
                  text-[24px]
                  text-[#321716]
                  outline-none
                  transition-all
                  duration-200

                  sm:rounded-[17px]
                  sm:text-[28px]

                  ${
                    error
                      ? `
                        border-[#A62C31]/45
                      `
                      : `
                        border-[#E9D4C7]
                        focus:border-[#8A2529]/55
                        focus:ring-4
                        focus:ring-[#8A2529]/[0.06]
                      `
                  }
                `}
              />
            )
          )}
        </motion.div>

        {error && (
          <motion.p
            initial={{
              opacity: 0,
              y: -4,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              mt-3
              text-xs
              font-medium
              text-[#9B2025]
            "
          >
            {error}
          </motion.p>
        )}

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
            mt-6
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
            hover:bg-[#61171B]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading
            ? "Verifying..."
            : "Verify code"}

          {!loading && (
            <ArrowRight
              size={16}
            />
          )}
        </motion.button>
      </form>

      <div
        className="
          mt-6
          flex
          items-center
          justify-center
          gap-1.5
          text-xs
          text-[#806A64]
        "
      >
        <span>
          Didn&apos;t receive it?
        </span>

        <button
          type="button"
          onClick={
            handleResend
          }
          disabled={
            seconds > 0 ||
            resending
          }
          className="
            font-semibold
            text-[#721C20]
            disabled:cursor-default
            disabled:text-[#A9948D]
          "
        >
          {resending
            ? "Sending..."
            : seconds > 0
              ? `Resend in ${formatTime(
                  seconds
                )}`
              : "Resend code"}
        </button>
      </div>
    </div>
  );
}

function maskEmail(
  email: string
) {
  const [
    local = "",
    domain = "",
  ] = email.split("@");

  if (!domain) {
    return email;
  }

  const visible =
    local.slice(0, 2);

  return `${visible}${"*".repeat(
    Math.max(
      local.length - 2,
      3
    )
  )}@${domain}`;
}

function formatTime(
  seconds: number
) {
  const minutes =
    Math.floor(
      seconds / 60
    );

  const remaining =
    seconds % 60;

  return `${String(
    minutes
  ).padStart(
    2,
    "0"
  )}:${String(
    remaining
  ).padStart(
    2,
    "0"
  )}`;
}