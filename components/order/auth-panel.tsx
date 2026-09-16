"use client";

import {
  FormEvent,
  ReactNode,
  useState,
} from "react";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
  X,
} from "lucide-react";

import Button from "@/components/ui/button";
import { useAuth } from "@/components/store/auth-context";

type AuthMode = "login" | "signup";

type AuthPanelProps = {
  onSuccess?: () => void;
  checkout?: boolean;
};

type FormErrors = {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const uaePhoneRegex =
  /^(?:\+971|971|0)?5[024568]\d{7}$/;

export default function AuthPanel({
  onSuccess,
  checkout = false,
}: AuthPanelProps) {
  const {
    login,
    register,
    isAuthLoading,
  } = useAuth();

  const [mode, setMode] =
    useState<AuthMode>("login");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [password, setPassword] =
    useState("");

  const validateSignup = (
    name: string,
    phone: string,
    email: string,
    passwordValue: string,
    confirmPassword: string
  ) => {
    const nextErrors: FormErrors = {};

    if (!name) {
      nextErrors.name =
        "Please enter your full name.";
    } else if (name.length < 2) {
      nextErrors.name =
        "Name must contain at least 2 characters.";
    }

    const cleanPhone =
      phone.replace(/[\s()-]/g, "");

    if (!cleanPhone) {
      nextErrors.phone =
        "Please enter your mobile number.";
    } else if (
      !uaePhoneRegex.test(cleanPhone)
    ) {
      nextErrors.phone =
        "Enter a valid UAE mobile number, for example 50 123 4567.";
    }

    if (!email) {
      nextErrors.email =
        "Please enter your email address.";
    } else if (
      !emailRegex.test(email)
    ) {
      nextErrors.email =
        "Enter a valid email address, for example name@example.com.";
    }

    if (!passwordValue) {
      nextErrors.password =
        "Please create a password.";
    } else if (
      !isPasswordValid(passwordValue)
    ) {
      nextErrors.password =
        "Your password does not meet all requirements.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      passwordValue !== confirmPassword
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
    }

    return nextErrors;
  };

  const validateLogin = (
    email: string,
    passwordValue: string
  ) => {
    const nextErrors: FormErrors = {};

    if (!email) {
      nextErrors.email =
        "Please enter your email address.";
    } else if (
      !emailRegex.test(email)
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!passwordValue) {
      nextErrors.password =
        "Please enter your password.";
    }

    return nextErrors;
  };

  const submit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isAuthLoading) {
      return;
    }

    setErrors({});

    const form =
      event.currentTarget;

    const data =
      new FormData(form);

    const name = String(
      data.get("name") ?? ""
    ).trim();

    const phone = String(
      data.get("phone") ?? ""
    ).trim();

    const email = String(
      data.get("email") ?? ""
    )
      .trim()
      .toLowerCase();

    const passwordValue = String(
      data.get("password") ?? ""
    );

    const confirmPassword = String(
      data.get("confirmPassword") ?? ""
    );

    const validationErrors =
      mode === "signup"
        ? validateSignup(
            name,
            phone,
            email,
            passwordValue,
            confirmPassword
          )
        : validateLogin(
            email,
            passwordValue
          );

    if (
      Object.keys(validationErrors)
        .length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    if (mode === "login") {
      const result =
        await login({
          email,
          password: passwordValue,
        });

      if (!result.success) {
        setErrors({
          form:
            result.message ||
            "Email or password is incorrect.",
        });

        return;
      }

      form.reset();
      setPassword("");
      setErrors({});

      onSuccess?.();

      return;
    }

    const result =
      await register({
        name,
        phone,
        email,
        password: passwordValue,
      });

    if (!result.success) {
      setErrors({
        form:
          result.message ||
          "We couldn't create your account. Please try again.",
      });

      return;
    }

    form.reset();
    setPassword("");
    setErrors({});

    onSuccess?.();
  };

  const changeMode = (
    nextMode: AuthMode
  ) => {
    if (isAuthLoading) {
      return;
    }

    setMode(nextMode);
    setErrors({});
    setPassword("");
    setShowPassword(false);
  };

  const clearError = (
    field: keyof FormErrors
  ) => {
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));
  };

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[560px]
        bg-white

        lg:rounded-[28px]
        lg:border
        lg:border-[var(--brand-border)]
        lg:p-8
        lg:shadow-[0_18px_50px_rgba(50,23,22,0.06)]
      "
    >
      <div className="grid grid-cols-2 rounded-full bg-[var(--brand-primary-soft)] p-1">
        <ModeButton
          active={mode === "login"}
          disabled={isAuthLoading}
          onClick={() =>
            changeMode("login")
          }
        >
          Sign in
        </ModeButton>

        <ModeButton
          active={mode === "signup"}
          disabled={isAuthLoading}
          onClick={() =>
            changeMode("signup")
          }
        >
          Create account
        </ModeButton>
      </div>

      <div className="mt-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
          {checkout
            ? "Account required"
            : mode === "login"
              ? "Welcome back"
              : "Join Velvet Crust"}
        </p>

        <h1 className="mt-2 font-serif text-3xl text-[var(--brand-text-dark)]">
          {mode === "login"
            ? "Sign in to your account."
            : "Create your account."}
        </h1>
      </div>

      <form
        onSubmit={submit}
        noValidate
        className="mt-7 space-y-4"
      >
        {mode === "signup" && (
          <>
            <AuthField
              label="Full name"
              error={errors.name}
              icon={
                <UserRound size={17} />
              }
            >
              <input
                name="name"
                autoComplete="name"
                disabled={isAuthLoading}
                placeholder="Your full name"
                onChange={() =>
                  clearError("name")
                }
                className={inputClass}
              />
            </AuthField>

            <AuthField
              label="Mobile number"
              error={errors.phone}
              icon={
                <span className="text-xs font-semibold">
                  +971
                </span>
              }
            >
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                disabled={isAuthLoading}
                placeholder="50 123 4567"
                onChange={() =>
                  clearError("phone")
                }
                className={inputClass}
              />
            </AuthField>
          </>
        )}

        <AuthField
          label="Email address"
          error={errors.email}
          icon={<Mail size={17} />}
        >
          <input
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            disabled={isAuthLoading}
            placeholder="you@example.com"
            onChange={() =>
              clearError("email")
            }
            className={inputClass}
          />
        </AuthField>

        <div>
          <AuthField
            label="Password"
            error={errors.password}
            icon={
              <LockKeyhole size={17} />
            }
          >
            <input
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete={
                mode === "login"
                  ? "current-password"
                  : "new-password"
              }
              disabled={isAuthLoading}
              placeholder={
                mode === "login"
                  ? "Your password"
                  : "Create a secure password"
              }
              value={password}
              onChange={(event) => {
                setPassword(
                  event.target.value
                );

                clearError(
                  "password"
                );
              }}
              className={inputClass}
            />

            <button
              type="button"
              disabled={isAuthLoading}
              onClick={() =>
                setShowPassword(
                  (current) =>
                    !current
                )
              }
              className="
                grid
                size-10
                shrink-0
                place-items-center
                rounded-full
                text-[var(--brand-muted)]
                transition
                hover:bg-[var(--brand-primary-soft)]
                hover:text-[var(--brand-primary)]
              "
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </AuthField>

          {mode === "signup" && (
            <PasswordRequirements
              password={password}
            />
          )}
        </div>

        {mode === "signup" && (
          <AuthField
            label="Confirm password"
            error={
              errors.confirmPassword
            }
            icon={
              <LockKeyhole size={17} />
            }
          >
            <input
              name="confirmPassword"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              disabled={isAuthLoading}
              placeholder="Repeat your password"
              onChange={() =>
                clearError(
                  "confirmPassword"
                )
              }
              className={inputClass}
            />
          </AuthField>
        )}

        {errors.form && (
          <div
            role="alert"
            className="
              rounded-2xl
              border
              border-[#A42C2C]/15
              bg-[#A42C2C]/[0.06]
              px-4
              py-3.5
            "
          >
            <p className="text-sm font-medium text-[#8A1F24]">
              {errors.form}
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isAuthLoading}
          iconRight={
            isAuthLoading ? (
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            ) : (
              <ArrowRight size={15} />
            )
          }
        >
          {isAuthLoading
            ? mode === "login"
              ? "Signing in..."
              : "Creating account..."
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-[var(--brand-border)]" />

        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-muted)]">
          Or continue with
        </span>

        <span className="h-px flex-1 bg-[var(--brand-border)]" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        fullWidth
        disabled
        iconLeft={<GoogleIcon />}
        className="normal-case tracking-normal opacity-60"
      >
        Continue with Google
      </Button>

      <p className="mt-2 text-center text-[10px] text-[var(--brand-muted)]">
        Google sign in coming soon
      </p>
    </div>
  );
}

const inputClass = `
  w-full
  bg-transparent
  text-base
  text-[var(--brand-text-dark)]
  outline-none
  placeholder:text-[var(--brand-muted)]/60
  disabled:cursor-not-allowed
`;

function isPasswordValid(
  password: string
) {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  );
}

function PasswordRequirements({
  password,
}: {
  password: string;
}) {
  const requirements = [
    {
      label: "8+ characters",
      valid: password.length >= 8,
    },
    {
      label: "Uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "Lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "Number",
      valid: /\d/.test(password),
    },
  ];

  return (
    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 px-1">
      {requirements.map(
        (requirement) => (
          <div
            key={
              requirement.label
            }
            className={`
              flex
              items-center
              gap-1.5
              text-[11px]
              transition-colors
              duration-200

              ${
                requirement.valid
                  ? "text-emerald-700"
                  : "text-[var(--brand-muted)]"
              }
            `}
          >
            <span
              className={`
                grid
                size-4
                shrink-0
                place-items-center
                rounded-full

                ${
                  requirement.valid
                    ? "bg-emerald-50"
                    : "bg-[var(--brand-primary-soft)]"
                }
              `}
            >
              {requirement.valid ? (
                <Check
                  size={10}
                  strokeWidth={2.5}
                />
              ) : (
                <span className="size-1 rounded-full bg-current opacity-50" />
              )}
            </span>

            {requirement.label}
          </div>
        )
      )}
    </div>
  );
}

function ModeButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className={`
        min-h-11
        rounded-full
        px-3
        text-[11px]
        font-semibold
        uppercase
        tracking-[0.1em]
        transition-all
        duration-300

        ${
          active
            ? `
              bg-[var(--brand-primary)]
              text-white
              shadow-sm
              hover:bg-[var(--brand-primary-dark)]
              hover:text-white
            `
            : `
              bg-transparent
              text-[var(--brand-text-dark)]
              hover:bg-[var(--brand-primary)]/10
              hover:text-[var(--brand-primary)]
            `
        }
      `}
    >
      {children}
    </Button>
  );
}

function AuthField({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-text-dark)]">
        {label}
      </span>

      <span
        className={`
          flex
          min-h-12
          items-center
          gap-3
          rounded-2xl
          border
          bg-[var(--brand-background)]
          px-4
          text-[var(--brand-muted)]
          transition
          duration-200

          focus-within:ring-2

          ${
            error
              ? `
                border-[#A42C2C]
                focus-within:border-[#A42C2C]
                focus-within:ring-[#A42C2C]/10
              `
              : `
                border-[var(--brand-border)]
                focus-within:border-[var(--brand-primary)]
                focus-within:ring-[var(--brand-primary)]/15
              `
          }
        `}
      >
        {icon}

        <span className="flex min-w-0 flex-1 items-center">
          {children}
        </span>
      </span>

      {error && (
        <span
          role="alert"
          className="
            mt-2
            flex
            items-center
            gap-1.5
            px-1
            text-[11px]
            font-medium
            leading-5
            text-[#A42C2C]
          "
        >
          <X
            size={12}
            strokeWidth={2.4}
            className="shrink-0"
          />

          {error}
        </span>
      )}
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.22c0-.72-.06-1.25-.2-1.8H12v3.48h5.37c-.11.87-.7 2.18-2 3.06l-.02.12 2.9 2.2.2.02c1.83-1.65 2.9-4.08 2.9-7.08Z"
      />
      <path
        fill="#34A853"
        d="M12 21.5c2.62 0 4.82-.84 6.43-2.2l-3.06-2.34c-.82.55-1.93.94-3.37.94-2.57 0-4.75-1.7-5.53-4.05l-.11.01-3.02 2.28-.04.1C4.9 19.35 8.2 21.5 12 21.5Z"
      />
      <path
        fill="#FBBC05"
        d="M6.47 13.85A5.53 5.53 0 0 1 6.17 12c0-.64.11-1.26.29-1.85v-.12L3.4 7.72l-.1.05A9.3 9.3 0 0 0 2.5 12c0 1.52.37 2.95 1.03 4.23l2.94-2.38Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.1c1.82 0 3.05.77 3.75 1.4l2.75-2.62C16.8 3.33 14.62 2.5 12 2.5c-3.8 0-7.1 2.14-8.7 5.27l3.16 2.38C7.25 7.8 9.43 6.1 12 6.1Z"
      />
    </svg>
  );
}