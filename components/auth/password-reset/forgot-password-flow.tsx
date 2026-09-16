"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { useState } from "react";

import EmailStep from "./email-step";
import OtpStep from "./otp-step";
import NewPasswordStep from "./new-password-step";

type Step =
  | "email"
  | "otp"
  | "password"
  | "success";

export default function ForgotPasswordFlow() {
  const [step, setStep] =
    useState<Step>("email");

  const [email, setEmail] =
    useState("");

  const [resetToken, setResetToken] =
    useState("");

  const goToOtp = (
    submittedEmail: string
  ) => {
    setEmail(submittedEmail);
    setStep("otp");
  };

  const goToPassword = (
    token: string
  ) => {
    setResetToken(token);
    setStep("password");
  };

  return (
    <div className="w-full">
      <AnimatePresence
        mode="wait"
        initial={false}
      >
        {step === "email" && (
          <motion.div
            key="email"
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -12,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <EmailStep
              onSuccess={goToOtp}
            />
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div
            key="otp"
            initial={{
              opacity: 0,
              x: 24,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -24,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <OtpStep
              email={email}
              onBack={() =>
                setStep("email")
              }
              onSuccess={
                goToPassword
              }
            />
          </motion.div>
        )}

        {step === "password" && (
          <motion.div
            key="password"
            initial={{
              opacity: 0,
              x: 24,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              y: -15,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <NewPasswordStep
              email={email}
              resetToken={
                resetToken
              }
              onSuccess={() =>
                setStep("success")
              }
            />
          </motion.div>
        )}

        {step === "success" && (
          <SuccessStep />
        )}
      </AnimatePresence>
    </div>
  );
}

function SuccessStep() {
  return (
    <motion.div
      key="success"
      initial={{
        opacity: 0,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="py-8 text-center sm:py-12"
    >
      <motion.div
        initial={{
          scale: 0,
          rotate: -12,
        }}
        animate={{
          scale: 1,
          rotate: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 14,
          delay: 0.1,
        }}
        className="
          mx-auto
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-[#F5E8E2]
          text-[#721C20]
        "
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M5 12.5L9.3 17L19 7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      <p
        className="
          mt-7
          text-[11px]
          font-semibold
          uppercase
          tracking-[0.24em]
          text-[#721C20]
        "
      >
        All done
      </p>

      <h2
        className="
          mt-3
          font-serif
          text-[34px]
          leading-tight
          text-[#321716]
          sm:text-[42px]
        "
      >
        Password updated.
      </h2>

      <p
        className="
          mx-auto
          mt-3
          max-w-[360px]
          text-sm
          leading-6
          text-[#806A64]
        "
      >
        Your new password is ready.
        You can now sign in.
      </p>

      <motion.a
        href="/account"
        whileHover={{
          y: -2,
        }}
        whileTap={{
          scale: 0.98,
        }}
        className="
          mt-7
          inline-flex
          min-h-13
          items-center
          justify-center
          rounded-full
          bg-[#7B2025]
          px-9
          text-[12px]
          font-semibold
          uppercase
          tracking-[0.16em]
          text-white
          transition-colors
          hover:bg-[#61171B]
        "
      >
        Sign in
      </motion.a>
    </motion.div>
  );
}