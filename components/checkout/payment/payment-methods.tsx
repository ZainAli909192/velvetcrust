import {
  Check,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

export type PaymentMethod =
  | "card"
  | "apple_pay"
  | "google_pay"
  | "tabby"
  | "tamara";

type PaymentOption = {
  id:
    PaymentMethod;

  name:
    string;

  description:
    string;
};

const paymentMethods:
  PaymentOption[] = [
    {
      id:
        "card",

      name:
        "Credit / Debit Card",

      description:
        "Pay securely with Visa or Mastercard.",
    },

    {
      id:
        "apple_pay",

      name:
        "Apple Pay",

      description:
        "Available on supported Apple devices and browsers.",
    },

    {
      id:
        "google_pay",

      name:
        "Google Pay",

      description:
        "Available when Google Pay is supported on your device.",
    },

    {
      id:
        "tabby",

      name:
        "Tabby",

      description:
        "Split your purchase into interest-free payments.",
    },

    {
      id:
        "tamara",

      name:
        "Tamara",

      description:
        "Buy now and split your payment with Tamara.",
    },
  ];

export function getPaymentMethodName(
  method:
    PaymentMethod
) {
  return (
    paymentMethods.find(
      (item) =>
        item.id ===
        method
    )?.name ??
    "Payment"
  );
}

export default function PaymentMethods({
  value,
  onChange,
}: {
  value:
    PaymentMethod;

  onChange: (
    method:
      PaymentMethod
  ) => void;
}) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {paymentMethods.map(
          (option) => {
            const selected =
              value ===
              option.id;

            return (
              <label
                key={
                  option.id
                }
                className={`relative flex min-h-[104px] cursor-pointer items-start gap-4 rounded-[20px] border p-4 transition ${
                  selected
                    ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)]/40"
                    : "border-[var(--brand-border)] bg-white hover:border-[var(--brand-primary-light)]"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={
                    option.id
                  }
                  checked={
                    selected
                  }
                  onChange={() =>
                    onChange(
                      option.id
                    )
                  }
                  className="sr-only"
                />

                <PaymentMark
                  method={
                    option.id
                  }
                />

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[var(--brand-text-dark)]">
                    {
                      option.name
                    }
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-[var(--brand-muted)]">
                    {
                      option.description
                    }
                  </span>
                </span>

                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    selected
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                      : "border-[var(--brand-border)]"
                  }`}
                >
                  {selected && (
                    <Check
                      size={
                        12
                      }
                      strokeWidth={
                        3
                      }
                    />
                  )}
                </span>
              </label>
            );
          }
        )}
      </div>

      {(value ===
        "card" ||
        value ===
          "apple_pay" ||
        value ===
          "google_pay") && (
        <div className="mt-6 rounded-[22px] border border-[var(--brand-border)] bg-[var(--brand-background)] p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={
                20
              }
              className="mt-0.5 shrink-0 text-[var(--brand-primary)]"
            />

            <div>
              <p className="text-sm font-semibold text-[var(--brand-text-dark)]">
                Secure Stripe payment
              </p>

              <p className="mt-1 text-xs leading-5 text-[var(--brand-muted)]">
                Payment details are handled securely by Stripe. Velvet Crust does not store raw card numbers or security codes.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PaymentMark({
  method,
}: {
  method:
    PaymentMethod;
}) {
  if (
    method === "card"
  ) {
    return (
      <span className="flex h-11 min-w-14 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
        <CreditCard
          size={
            21
          }
        />
      </span>
    );
  }

  if (
    method ===
    "apple_pay"
  ) {
    return (
      <span className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black">
        <Image
          src="/images/payments/applepay.png"
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 object-contain"
        />
      </span>
    );
  }

  if (
    method ===
    "google_pay"
  ) {
    return (
      <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl border border-[var(--brand-border)] bg-white">
        <Image
          src="/images/payments/googlepay.png"
          alt=""
          width={48}
          height={40}
          className="h-10 w-12 object-contain"
        />
      </span>
    );
  }

  if (
    method ===
    "tabby"
  ) {
    return (
      <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-black">
        <Image
          src="/images/payments/tabby-logo.svg"
          alt=""
          width={48}
          height={20}
          className="h-5 w-12 object-contain"
        />
      </span>
    );
  }

  return (
    <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl border border-[var(--brand-border)] bg-white">
      <Image
        src="/images/payments/tamara.png"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 rounded-md object-contain"
      />
    </span>
  );
}
