"use client";

import axios, {
  AxiosError,
} from "axios";

import Link from "next/link";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useAuth,
} from "@/components/store/auth-context";

import {
  countryPhoneCodes,
} from "@/lib/countries";

type ErrorResponse = {
  message?: string;
};

const DEFAULT_COUNTRY_CODE =
  "+971";

function splitPhoneNumber(
  value: string
) {
  const savedPhone =
    value.trim();

  if (!savedPhone) {
    return {
      countryCode:
        DEFAULT_COUNTRY_CODE,
      phone: "",
    };
  }

  if (
    !savedPhone.startsWith(
      "+"
    )
  ) {
    return {
      countryCode:
        DEFAULT_COUNTRY_CODE,

      phone:
        savedPhone.replace(
          /\D/g,
          ""
        ),
    };
  }

  const dialCodes = [
    ...new Set(
      countryPhoneCodes.map(
        (country) =>
          country.dialCode
      )
    ),
  ].sort(
    (a, b) =>
      b.length - a.length
  );

  const matchedCode =
    dialCodes.find(
      (dialCode) =>
        savedPhone.startsWith(
          dialCode
        )
    );

  if (!matchedCode) {
    return {
      countryCode:
        DEFAULT_COUNTRY_CODE,

      phone:
        savedPhone.replace(
          /\D/g,
          ""
        ),
    };
  }

  return {
    countryCode:
      matchedCode,

    phone:
      savedPhone
        .slice(
          matchedCode.length
        )
        .replace(
          /\D/g,
          ""
        ),
  };
}

function buildInternationalPhone(
  countryCode: string,
  phone: string
) {
  let nationalNumber =
    phone.replace(
      /\D/g,
      ""
    );

  if (!nationalNumber) {
    return "";
  }

  nationalNumber =
    nationalNumber.replace(
      /^0+/,
      ""
    );

  if (!nationalNumber) {
    return "";
  }

  return `${countryCode}${nationalNumber}`;
}

export default function ProfilePage() {
  const router =
    useRouter();

  const {
    user,
    isReady,
    refreshUser,
  } = useAuth();

  const [
    name,
    setName,
  ] = useState("");

  const [
    countryCode,
    setCountryCode,
  ] = useState(
    DEFAULT_COUNTRY_CODE
  );

  const [
    phone,
    setPhone,
  ] = useState("");

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    passwordLoading,
    setPasswordLoading,
  ] = useState(false);

  const [
    passwordError,
    setPasswordError,
  ] = useState("");

  const [
    passwordSuccess,
    setPasswordSuccess,
  ] = useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(
      user.name
    );

    const parsedPhone =
      splitPhoneNumber(
        user.phone ?? ""
      );

    setCountryCode(
      parsedPhone.countryCode
    );

    setPhone(
      parsedPhone.phone
    );
  }, [user]);

  useEffect(() => {
    if (
      isReady &&
      !user
    ) {
      router.replace(
        "/account"
      );
    }
  }, [
    isReady,
    user,
    router,
  ]);

  function handlePhoneChange(
    value: string
  ) {
    const numbersOnly =
      value.replace(
        /\D/g,
        ""
      );

    setPhone(
      numbersOnly.slice(
        0,
        15
      )
    );

    setError("");
    setSuccess("");
  }

  function handleCountryChange(
    value: string
  ) {
    setCountryCode(
      value
    );

    setError("");
    setSuccess("");
  }

  async function saveProfile(
    event:
      React.FormEvent
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");
    setSuccess("");

    const cleanName =
      name.trim();

    if (
      cleanName.length <
        2 ||
      cleanName.length >
        80
    ) {
      setError(
        "Name must be between 2 and 80 characters."
      );

      return;
    }

    const fullPhone =
      buildInternationalPhone(
        countryCode,
        phone
      );

    if (
      phone &&
      !fullPhone
    ) {
      setError(
        "Please enter a valid phone number."
      );

      return;
    }

    if (
      fullPhone &&
      !/^\+[1-9]\d{6,14}$/.test(
        fullPhone
      )
    ) {
      setError(
        "Please enter a valid phone number."
      );

      return;
    }

    setSaving(true);

    try {
      const response =
        await axios.patch(
          "/api/account/profile",
          {
            name:
              cleanName,

            phone:
              fullPhone,
          }
        );

      setSuccess(
        response.data
          .message ||
          "Profile updated successfully."
      );

      await refreshUser();
    } catch (error) {
      const apiError =
        error as AxiosError<ErrorResponse>;

      setError(
        apiError.response
          ?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(
    event:
      React.FormEvent
  ) {
    event.preventDefault();

    if (passwordLoading) {
      return;
    }

    setPasswordError("");
    setPasswordSuccess("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please complete all password fields."
      );

      return;
    }

    if (
      newPassword.length <
      8
    ) {
      setPasswordError(
        "New password must be at least 8 characters."
      );

      return;
    }

    if (
      newPassword.length >
      128
    ) {
      setPasswordError(
        "Password is too long."
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setPasswordError(
        "New passwords do not match."
      );

      return;
    }

    setPasswordLoading(
      true
    );

    try {
      const response =
        await axios.patch(
          "/api/account/change-password",
          {
            currentPassword,
            newPassword,
          }
        );

      setCurrentPassword(
        ""
      );

      setNewPassword("");

      setConfirmPassword(
        ""
      );

      setShowCurrentPassword(
        false
      );

      setShowNewPassword(
        false
      );

      setShowConfirmPassword(
        false
      );

      setPasswordSuccess(
        response.data
          .message ||
          "Password changed successfully."
      );

      await refreshUser();
    } catch (error) {
      const apiError =
        error as AxiosError<ErrorResponse>;

      setPasswordError(
        apiError.response
          ?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setPasswordLoading(
        false
      );
    }
  }

  if (
    !isReady ||
    !user
  ) {
    return (
      <div className="min-h-[70vh] bg-[var(--brand-background)]" />
    );
  }

  return (
    <section className="min-h-screen bg-[var(--brand-background)] px-4 pb-32 pt-9 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12">
      <div className="mx-auto max-w-[760px]">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--brand-muted)] transition hover:text-[var(--brand-primary)]"
        >
          <ArrowLeft
            size={16}
          />

          Back to account
        </Link>

        <div className="mt-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
            My account
          </p>

          <h1 className="mt-2 font-serif text-4xl text-[var(--brand-text-dark)] sm:text-5xl">
            My profile
          </h1>

          <p className="mt-3 max-w-[520px] text-sm leading-6 text-[var(--brand-muted)]">
            Keep your personal details and account security up to date.
          </p>
        </div>

        <form
          onSubmit={
            saveProfile
          }
          className="mt-9 rounded-[26px] border border-[var(--brand-border)] bg-white p-5 shadow-[0_18px_50px_rgba(81,0,0,0.04)] sm:p-7"
        >
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
              <UserRound
                size={18}
              />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                Personal details
              </p>

              <h2 className="mt-0.5 font-serif text-2xl text-[var(--brand-text-dark)]">
                Profile information
              </h2>
            </div>
          </div>

          <div className="mt-6">
            <FieldLabel
              icon={
                <UserRound
                  size={16}
                />
              }
            >
              Full name
            </FieldLabel>

            <input
              value={name}
              maxLength={80}
              autoComplete="name"
              onChange={(
                event
              ) => {
                setName(
                  event.target
                    .value
                );

                setError("");
                setSuccess("");
              }}
              className="mt-2 min-h-12 w-full rounded-[14px] border border-[var(--brand-border)] bg-white px-4 text-sm outline-none transition focus:border-[var(--brand-primary)]"
            />
          </div>

          <div className="mt-6">
            <FieldLabel
              icon={
                <Mail
                  size={16}
                />
              }
            >
              Email
            </FieldLabel>

            <div className="relative mt-2">
              <input
                value={
                  user.email
                }
                readOnly
                className="min-h-12 w-full rounded-[14px] border border-[var(--brand-border)] bg-black/[0.025] px-4 pr-11 text-sm text-[var(--brand-muted)] outline-none"
              />

              <LockKeyhole
                size={15}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--brand-muted)]"
              />
            </div>

            <p className="mt-2 text-[11px] leading-5 text-[var(--brand-muted)]">
              Email changes require verification and are currently disabled.
            </p>
          </div>

          <div className="mt-6">
            <FieldLabel
              icon={
                <Phone
                  size={16}
                />
              }
            >
              Phone
            </FieldLabel>

            <div className="mt-2 flex gap-2">
              <div className="relative w-[135px] shrink-0 sm:w-[150px]">
                <select
                  value={
                    countryCode
                  }
                  onChange={(
                    event
                  ) =>
                    handleCountryChange(
                      event.target
                        .value
                    )
                  }
                  aria-label="Country calling code"
                  className="min-h-12 w-full cursor-pointer appearance-none rounded-[14px] border border-[var(--brand-border)] bg-white py-2 pl-3 pr-8 text-sm text-[var(--brand-text-dark)] outline-none transition focus:border-[var(--brand-primary)]"
                >
                  {countryPhoneCodes.map(
                    (country) => (
                      <option
                        key={
                          country.code
                        }
                        value={
                          country.dialCode
                        }
                      >
                        {
                          country.code
                        }{" "}
                        {
                          country.dialCode
                        }
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-muted)]"
                />
              </div>

              <input
                type="tel"
                value={phone}
                maxLength={15}
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="501234567"
                onChange={(
                  event
                ) =>
                  handlePhoneChange(
                    event.target
                      .value
                  )
                }
                onKeyDown={(
                  event
                ) => {
                  if (
                    [
                      "e",
                      "E",
                      "+",
                      "-",
                      ".",
                      " ",
                    ].includes(
                      event.key
                    )
                  ) {
                    event.preventDefault();
                  }
                }}
                className="min-h-12 min-w-0 flex-1 rounded-[14px] border border-[var(--brand-border)] bg-white px-4 text-sm outline-none transition focus:border-[var(--brand-primary)]"
              />
            </div>

            <p className="mt-2 text-[11px] leading-5 text-[var(--brand-muted)]">
              Select your country code and enter numbers only.
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-[14px] bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 flex items-center gap-2 rounded-[14px] bg-green-50 px-4 py-3 text-xs text-green-700">
              <Check
                size={15}
              />

              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={
              saving
            }
            className="mt-7 inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-7 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && (
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            )}

            {saving
              ? "Saving..."
              : "Save changes"}
          </button>
        </form>

        <form
          onSubmit={
            changePassword
          }
          className="mt-6 rounded-[26px] border border-[var(--brand-border)] bg-white p-5 shadow-[0_18px_50px_rgba(81,0,0,0.04)] sm:p-7"
        >
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
              <KeyRound
                size={18}
              />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                Security
              </p>

              <h2 className="mt-0.5 font-serif text-2xl text-[var(--brand-text-dark)]">
                Change password
              </h2>
            </div>
          </div>

          <div className="mt-6">
            <PasswordField
              label="Current password"
              value={
                currentPassword
              }
              visible={
                showCurrentPassword
              }
              autoComplete="current-password"
              onChange={
                setCurrentPassword
              }
              onToggle={() =>
                setShowCurrentPassword(
                  (current) =>
                    !current
                )
              }
            />
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <PasswordField
              label="New password"
              value={
                newPassword
              }
              visible={
                showNewPassword
              }
              autoComplete="new-password"
              onChange={
                setNewPassword
              }
              onToggle={() =>
                setShowNewPassword(
                  (current) =>
                    !current
                )
              }
            />

            <PasswordField
              label="Confirm new password"
              value={
                confirmPassword
              }
              visible={
                showConfirmPassword
              }
              autoComplete="new-password"
              onChange={
                setConfirmPassword
              }
              onToggle={() =>
                setShowConfirmPassword(
                  (current) =>
                    !current
                )
              }
            />
          </div>

          <p className="mt-3 text-[11px] leading-5 text-[var(--brand-muted)]">
            Use at least 8 characters and choose a password different from your current password.
          </p>

          {passwordError && (
            <div className="mt-5 rounded-[14px] bg-red-50 px-4 py-3 text-xs text-red-700">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="mt-5 flex items-center gap-2 rounded-[14px] bg-green-50 px-4 py-3 text-xs text-green-700">
              <Check
                size={15}
              />

              {passwordSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={
              passwordLoading
            }
            className="mt-6 inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-7 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {passwordLoading && (
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            )}

            {passwordLoading
              ? "Changing..."
              : "Change password"}
          </button>
        </form>
      </div>
    </section>
  );
}

function FieldLabel({
  icon,
  children,
}: {
  icon:
    React.ReactNode;

  children:
    React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-text-dark)]">
      <span className="text-[var(--brand-primary)]">
        {icon}
      </span>

      {children}
    </label>
  );
}

function PasswordField({
  label,
  value,
  visible,
  autoComplete,
  onChange,
  onToggle,
}: {
  label: string;

  value: string;

  visible: boolean;

  autoComplete:
    | "current-password"
    | "new-password";

  onChange: (
    value: string
  ) => void;

  onToggle:
    () => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-[var(--brand-text-dark)]">
        {label}
      </label>

      <div className="relative mt-2">
        <input
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          maxLength={128}
          autoComplete={
            autoComplete
          }
          onChange={(
            event
          ) =>
            onChange(
              event.target
                .value
            )
          }
          className="min-h-12 w-full rounded-[14px] border border-[var(--brand-border)] bg-white px-4 pr-12 text-sm outline-none transition focus:border-[var(--brand-primary)]"
        />

        <button
          type="button"
          onClick={
            onToggle
          }
          aria-label={
            visible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--brand-muted)] transition hover:text-[var(--brand-primary)]"
        >
          {visible ? (
            <EyeOff
              size={17}
            />
          ) : (
            <Eye
              size={17}
            />
          )}
        </button>
      </div>
    </div>
  );
}