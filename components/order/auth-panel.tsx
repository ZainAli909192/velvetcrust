"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import Button from "@/components/ui/button";
import { useAuth } from "@/components/store/auth-context";

type AuthMode = "login" | "signup";

type AuthPanelProps = {
  onSuccess?: () => void;
  checkout?: boolean;
};

export default function AuthPanel({
  onSuccess,
  checkout = false,
}: AuthPanelProps) {
  const { signIn } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const email = String(data.get("email") ?? "").trim();
    const name = String(data.get("name") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirmation = String(
      data.get("confirmPassword") ?? ""
    );

    if (
      mode === "signup" &&
      password !== confirmation
    ) {
      setError(
        "Passwords do not match. Please check both fields."
      );
      return;
    }

    const fallbackName = email
      .split("@")[0]
      .replace(/[._-]/g, " ");

    signIn({
      name:
        name ||
        fallbackName ||
        "Velvet Crust Customer",
      email,
    });

    setError("");
    onSuccess?.();
  }

  function continueWithGoogle() {
    signIn({
      name: "Velvet Crust Customer",
      email: "customer@gmail.com",
    });

    onSuccess?.();
  }

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
      {/* Tabs */}
      <div className="grid grid-cols-2 rounded-full bg-[var(--brand-primary-soft)] p-1">
        <ModeButton
          active={mode === "login"}
          onClick={() => {
            setMode("login");
            setError("");
          }}
        >
          Sign in
        </ModeButton>

        <ModeButton
          active={mode === "signup"}
          onClick={() => {
            setMode("signup");
            setError("");
          }}
        >
          Create account
        </ModeButton>
      </div>

      {/* Heading */}
      <div className="mt-7">
        

       
      </div>

      {/* Form */}
      <form
        onSubmit={submit}
        className="mt-7 space-y-4"
      >
        {mode === "signup" && (
          <>
            <AuthField
              label="Full name"
              icon={<UserRound size={17} />}
            >
              <input
                required
                name="name"
                autoComplete="name"
                placeholder="Your full name"
                className="w-full bg-transparent text-base text-[var(--brand-text-dark)] outline-none placeholder:text-[var(--brand-muted)]/60"
              />
            </AuthField>

            <AuthField
              label="Mobile number"
              icon={
                <span className="text-xs font-semibold">
                  +971
                </span>
              }
            >
              <input
                required
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="50 000 0000"
                className="w-full bg-transparent text-base text-[var(--brand-text-dark)] outline-none placeholder:text-[var(--brand-muted)]/60"
              />
            </AuthField>
          </>
        )}

        <AuthField
          label="Email address"
          icon={<Mail size={17} />}
        >
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full bg-transparent text-base text-[var(--brand-text-dark)] outline-none placeholder:text-[var(--brand-muted)]/60"
          />
        </AuthField>

        <AuthField
          label="Password"
          icon={<LockKeyhole size={17} />}
        >
          <input
            required
            minLength={6}
            name="password"
            type={
              showPassword ? "text" : "password"
            }
            autoComplete={
              mode === "login"
                ? "current-password"
                : "new-password"
            }
            placeholder="At least 6 characters"
            className="w-full bg-transparent text-base text-[var(--brand-text-dark)] outline-none placeholder:text-[var(--brand-muted)]/60"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (current) => !current
              )
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--brand-muted)] transition hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
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
          <AuthField
            label="Confirm password"
            icon={<LockKeyhole size={17} />}
          >
            <input
              required
              minLength={6}
              name="confirmPassword"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              placeholder="Repeat your password"
              className="w-full bg-transparent text-base text-[var(--brand-text-dark)] outline-none placeholder:text-[var(--brand-muted)]/60"
            />
          </AuthField>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-[var(--brand-primary-soft)] px-4 py-3 text-sm text-[var(--brand-primary)]"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          iconRight={<ArrowRight size={15} />}
        >
          {mode === "login"
            ? "Sign in"
            : "Create account"}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-[var(--brand-border)]" />

        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-muted)]">
          Or continue with
        </span>

        <span className="h-px flex-1 bg-[var(--brand-border)]" />
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        fullWidth
        iconLeft={<GoogleIcon />}
        onClick={continueWithGoogle}
        className="normal-case tracking-normal"
      >
        Continue with Google
      </Button>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        min-h-11
        rounded-full
        px-3
        text-[11px]
        font-semibold
        uppercase
        tracking-[0.1em]
        transition
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--brand-primary)]

        ${
          active
            ? "bg-[var(--brand-primary)] text-white shadow-sm"
            : "text-[var(--brand-muted)] hover:text-[var(--brand-primary)]"
        }
      `}
    >
      {children}
    </button>
  );
}

function AuthField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-text-dark)]">
        {label}
      </span>

      <span
        className="
          flex
          min-h-12
          items-center
          gap-3
          rounded-2xl
          border
          border-[var(--brand-border)]
          bg-[var(--brand-background)]
          px-4
          text-[var(--brand-muted)]
          transition
          focus-within:border-[var(--brand-primary)]
          focus-within:ring-2
          focus-within:ring-[var(--brand-primary)]/15
        "
      >
        {icon}

        <span className="flex min-w-0 flex-1 items-center">
          {children}
        </span>
      </span>
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