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

import {
  useRouter,
} from "next/navigation";

import {
  useAuth,
} from "@/components/store/auth-context";

type AuthMode =
  | "login"
  | "signup";

type AuthFormProps = {
  mode: AuthMode;
  onSuccess?: () => void;
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

export default function AuthForm({
  mode,
  onSuccess,
}: AuthFormProps) {
  const router = useRouter();

  const {
    login,
    register,
    isAuthLoading,
  } = useAuth();

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const clearError = (
    field: keyof FormErrors
  ) => {
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));
  };

  const validateLogin = (
    email: string,
    passwordValue: string
  ) => {
    const nextErrors: FormErrors =
      {};

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

  const validateSignup = (
    name: string,
    phone: string,
    email: string,
    passwordValue: string,
    confirmPassword: string
  ) => {
    const nextErrors: FormErrors =
      {};

    if (!name) {
      nextErrors.name =
        "Please enter your full name.";
    } else if (
      name.length < 2
    ) {
      nextErrors.name =
        "Name must contain at least 2 characters.";
    }

    const cleanPhone =
      phone.replace(
        /[\s()-]/g,
        ""
      );

    if (!cleanPhone) {
      nextErrors.phone =
        "Please enter your mobile number.";
    } else if (
      !uaePhoneRegex.test(
        cleanPhone
      )
    ) {
      nextErrors.phone =
        "Enter a valid UAE mobile number.";
    }

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
        "Please create a password.";
    } else if (
      !isPasswordValid(
        passwordValue
      )
    ) {
      nextErrors.password =
        "Your password does not meet all requirements.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      passwordValue !==
      confirmPassword
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
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

    const passwordValue =
      String(
        data.get("password") ??
          ""
      );

    const confirmPassword =
      String(
        data.get(
          "confirmPassword"
        ) ?? ""
      );

    const validationErrors =
      mode === "login"
        ? validateLogin(
            email,
            passwordValue
          )
        : validateSignup(
            name,
            phone,
            email,
            passwordValue,
            confirmPassword
          );

    if (
      Object.keys(
        validationErrors
      ).length > 0
    ) {
      setErrors(
        validationErrors
      );

      return;
    }

    if (mode === "login") {
      const result =
        await login({
          email,
          password:
            passwordValue,
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
        password:
          passwordValue,
      });

    if (!result.success) {
      setErrors({
        form:
          result.message ||
          "Unable to create your account.",
      });

      return;
    }

    form.reset();
    setPassword("");
    setErrors({});

    onSuccess?.();
  };

  return (
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
              <UserRound
                size={17}
              />
            }
          >
            <input
              name="name"
              autoComplete="name"
              disabled={
                isAuthLoading
              }
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
              disabled={
                isAuthLoading
              }
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
        icon={
          <Mail size={17} />
        }
      >
        <input
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          disabled={
            isAuthLoading
          }
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
            <LockKeyhole
              size={17}
            />
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
            disabled={
              isAuthLoading
            }
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
            disabled={
              isAuthLoading
            }
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

        {mode === "login" && (
          <div className="mt-2 flex justify-end px-1">
            <button
              type="button"
              disabled={
                isAuthLoading
              }
              onClick={() =>
                router.push(
                  "/forgot-password"
                )
              }
              className="
                text-[11px]
                font-semibold
                tracking-[0.04em]
                text-[var(--brand-primary)]
                transition
                hover:underline
                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              Forgot password?
            </button>
          </div>
        )}

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
            <LockKeyhole
              size={17}
            />
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
            disabled={
              isAuthLoading
            }
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
          <p
            className="
              text-sm
              font-medium
              text-[#8A1F24]
            "
          >
            {errors.form}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={
          isAuthLoading
        }
        className="
          flex
          min-h-[52px]
          w-full
          items-center
          justify-center
          gap-3
          rounded-full
          bg-[var(--brand-primary)]
          px-6
          text-[12px]
          font-semibold
          uppercase
          tracking-[0.14em]
          text-white
          transition
          hover:opacity-95
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {isAuthLoading ? (
          <>
            <LoaderCircle
              size={16}
              className="animate-spin"
            />

            {mode === "login"
              ? "Signing in..."
              : "Creating account..."}
          </>
        ) : (
          <>
            {mode === "login"
              ? "Sign in"
              : "Create account"}

            <ArrowRight
              size={16}
            />
          </>
        )}
      </button>
    </form>
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
      valid:
        password.length >= 8,
    },
    {
      label: "Uppercase",
      valid:
        /[A-Z]/.test(password),
    },
    {
      label: "Lowercase",
      valid:
        /[a-z]/.test(password),
    },
    {
      label: "Number",
      valid:
        /\d/.test(password),
    },
  ];

  return (
    <div
      className="
        mt-3
        grid
        grid-cols-2
        gap-x-4
        gap-y-2
        px-1
      "
    >
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
                />
              ) : (
                <span
                  className="
                    size-1
                    rounded-full
                    bg-current
                    opacity-50
                  "
                />
              )}
            </span>

            {requirement.label}
          </div>
        )
      )}
    </div>
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
      <span
        className="
          mb-2
          block
          text-[11px]
          font-semibold
          uppercase
          tracking-[0.12em]
          text-[var(--brand-text-dark)]
        "
      >
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
          focus-within:ring-2

          ${
            error
              ? `
                border-[#A42C2C]
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

        <span
          className="
            flex
            min-w-0
            flex-1
            items-center
          "
        >
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
            text-[#A42C2C]
          "
        >
          <X
            size={12}
          />

          {error}
        </span>
      )}
    </label>
  );
}