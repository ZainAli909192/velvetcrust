"use client";

import axios from "axios";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";
import {
  FormEvent,
  useMemo,
  useState,
} from "react";
import { motion } from "framer-motion";

type Props = {
  email: string;
  resetToken: string;
  onSuccess: () => void;
};

export default function NewPasswordStep({
  email,
  resetToken,
  onSuccess,
}: Props) {
  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirm,
    setShowConfirm,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const requirements =
    useMemo(
      () => [
        {
          label:
            "8–72 characters",
          valid:
            password.length >= 8 &&
            password.length <=
              72,
        },
        {
          label:
            "Uppercase letter",
          valid:
            /[A-Z]/.test(
              password
            ),
        },
        {
          label:
            "Lowercase letter",
          valid:
            /[a-z]/.test(
              password
            ),
        },
        {
          label: "Number",
          valid:
            /\d/.test(
              password
            ),
        },
      ],
      [password]
    );

  const validPassword =
    requirements.every(
      (item) => item.valid
    );

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setError("");

    if (!validPassword) {
      setError(
        "Your password does not meet all requirements."
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "/api/auth/reset-password",
        {
          email,
          resetToken,
          password,
          confirmPassword,
        }
      );

      onSuccess();
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        setError(
          error.response?.data
            ?.message ??
            "Unable to reset your password."
        );
      } else {
        setError(
          "Unable to reset your password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
        <LockKeyhole
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
        New password
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
        Create a new password.
      </h1>

      <p
        className="
          mt-3
          text-sm
          leading-6
          text-[#806A64]
        "
      >
        Choose a secure password
        for your Velvet Crust
        account.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8"
      >
        <PasswordField
          id="new-password"
          label="New password"
          value={password}
          show={showPassword}
          onChange={(value) => {
            setPassword(value);

            if (error) {
              setError("");
            }
          }}
          onToggle={() =>
            setShowPassword(
              (current) =>
                !current
            )
          }
        />

        <div
          className="
            mt-4
            grid
            grid-cols-2
            gap-x-3
            gap-y-2
          "
        >
          {requirements.map(
            (requirement) => (
              <Requirement
                key={
                  requirement.label
                }
                label={
                  requirement.label
                }
                valid={
                  requirement.valid
                }
              />
            )
          )}
        </div>

        <div className="mt-6">
          <PasswordField
            id="confirm-password"
            label="Confirm password"
            value={
              confirmPassword
            }
            show={showConfirm}
            onChange={(value) => {
              setConfirmPassword(
                value
              );

              if (error) {
                setError("");
              }
            }}
            onToggle={() =>
              setShowConfirm(
                (current) =>
                  !current
              )
            }
          />
        </div>

        {confirmPassword &&
          password ===
            confirmPassword && (
            <motion.p
              initial={{
                opacity: 0,
                y: -3,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                mt-2
                flex
                items-center
                gap-1.5
                text-xs
                font-medium
                text-[#57715C]
              "
            >
              <Check
                size={14}
              />
              Passwords match
            </motion.p>
          )}

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              mt-4
              rounded-[14px]
              bg-[#F7E7E2]
              px-4
              py-3
              text-xs
              font-medium
              leading-5
              text-[#921F24]
            "
          >
            {error}
          </motion.div>
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
            ? "Updating..."
            : "Reset password"}

          {!loading && (
            <ArrowRight
              size={16}
            />
          )}
        </motion.button>
      </form>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  show,
  onChange,
  onToggle,
}: {
  id: string;
  label: string;
  value: string;
  show: boolean;
  onChange: (
    value: string
  ) => void;
  onToggle: () => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="
          text-[11px]
          font-semibold
          uppercase
          tracking-[0.16em]
          text-[#321716]
        "
      >
        {label}
      </label>

      <div
        className="
          mt-2
          flex
          min-h-[58px]
          items-center
          rounded-[18px]
          border
          border-[#E9D4C7]
          bg-[#FFF9F2]
          px-4
          transition
          focus-within:border-[#8A2529]/50
          focus-within:ring-4
          focus-within:ring-[#8A2529]/[0.05]
        "
      >
        <LockKeyhole
          size={18}
          strokeWidth={1.5}
          className="
            shrink-0
            text-[#947B73]
          "
        />

        <input
          id={id}
          type={
            show
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          autoComplete={
            id ===
            "new-password"
              ? "new-password"
              : "new-password"
          }
          className="
            min-w-0
            flex-1
            bg-transparent
            px-3
            text-[15px]
            text-[#321716]
            outline-none
          "
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            show
              ? "Hide password"
              : "Show password"
          }
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            text-[#7A2025]
            transition-colors
            hover:bg-[#F5E8E2]
          "
        >
          {show ? (
            <EyeOff
              size={18}
              strokeWidth={1.5}
            />
          ) : (
            <Eye
              size={18}
              strokeWidth={1.5}
            />
          )}
        </button>
      </div>
    </div>
  );
}

function Requirement({
  label,
  valid,
}: {
  label: string;
  valid: boolean;
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-2
        text-[11px]
        transition-colors

        ${
          valid
            ? "text-[#57715C]"
            : "text-[#9B8881]"
        }
      `}
    >
      <span
        className={`
          flex
          h-4
          w-4
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          transition-all

          ${
            valid
              ? `
                border-[#6E8974]
                bg-[#6E8974]
                text-white
              `
              : `
                border-[#CDBAB1]
                text-transparent
              `
          }
        `}
      >
        <Check
          size={10}
          strokeWidth={2.5}
        />
      </span>

      {label}
    </div>
  );
}