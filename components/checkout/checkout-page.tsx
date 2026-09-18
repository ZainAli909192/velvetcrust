"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  type FormEvent,
  type InputHTMLAttributes,
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Plus,
  ShoppingBag,
} from "lucide-react";

import Button from "@/components/ui/button";
import AuthPanel from "@/components/order/auth-panel";

import {
  useCart,
} from "@/components/store/cart-context";

import {
  useAuth,
} from "@/components/store/auth-context";

import {
  useCheckout,
} from "@/components/store/checkout-context";

const emirates = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

type SavedAddress = {
  id: string;
  label: string;
  emirate: string;
  area: string;
  addressLine: string;
  building?: string;
  apartment?: string;
  notes?: string;
  isDefault: boolean;
};

type AddressesResponse = {
  success: boolean;
  addresses: SavedAddress[];
};

const MANUAL_ADDRESS =
  "manual";

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    totalItems,
  } = useCart();

  const {
    user,
    isReady,
  } = useAuth();

  const {
    details,
    saveDetails,
    isCheckoutReady,
  } = useCheckout();

  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const isGuest =
    searchParams.get(
      "mode"
    ) === "guest";

  const [
    addresses,
    setAddresses,
  ] =
    useState<
      SavedAddress[]
    >([]);

  const [
    addressesLoading,
    setAddressesLoading,
  ] = useState(false);

  const [
    addressesError,
    setAddressesError,
  ] = useState("");

  const [
    selectedAddressId,
    setSelectedAddressId,
  ] =
    useState<string>(
      MANUAL_ADDRESS
    );

  const [
    addressesReady,
    setAddressesReady,
  ] = useState(false);

  useEffect(() => {
    if (
      !isReady ||
      !user ||
      isGuest
    ) {
      setAddresses([]);
      setSelectedAddressId(
        MANUAL_ADDRESS
      );
      setAddressesReady(
        true
      );

      return;
    }

    let active = true;

    async function loadAddresses() {
      setAddressesLoading(
        true
      );

      setAddressesError("");

      try {
        const response =
          await axios.get<AddressesResponse>(
            "/api/account/addresses"
          );

        if (!active) {
          return;
        }

        const savedAddresses =
          response.data
            .addresses ?? [];

        setAddresses(
          savedAddresses
        );

        if (
          savedAddresses.length ===
          0
        ) {
          setSelectedAddressId(
            MANUAL_ADDRESS
          );

          return;
        }

        const defaultAddress =
          savedAddresses.find(
            (address) =>
              address.isDefault
          );

        setSelectedAddressId(
          defaultAddress?.id ??
            savedAddresses[0].id
        );
      } catch (error) {
        console.error(
          "Load checkout addresses error:",
          error
        );

        if (!active) {
          return;
        }

        setAddresses([]);

        setSelectedAddressId(
          MANUAL_ADDRESS
        );

        setAddressesError(
          "Saved addresses could not be loaded. You can enter an address manually."
        );
      } finally {
        if (active) {
          setAddressesLoading(
            false
          );

          setAddressesReady(
            true
          );
        }
      }
    }

    void loadAddresses();

    return () => {
      active = false;
    };
  }, [
    isReady,
    user,
    isGuest,
  ]);

  const selectedAddress =
    addresses.find(
      (address) =>
        address.id ===
        selectedAddressId
    );

  const usingSavedAddress =
    Boolean(
      user &&
        !isGuest &&
        selectedAddress
    );

  function continueToPayment(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData =
      new FormData(
        event.currentTarget
      );

    const fullName =
      String(
        formData.get(
          "fullName"
        ) ?? ""
      ).trim();

    const email =
      String(
        formData.get(
          "email"
        ) ?? ""
      ).trim();

    const phone =
      String(
        formData.get(
          "phone"
        ) ?? ""
      ).trim();

    if (
      usingSavedAddress &&
      selectedAddress
    ) {
      saveDetails({
        fullName,
        email,
        phone,

        emirate:
          selectedAddress.emirate,

        area:
          selectedAddress.area,

        addressLine:
          selectedAddress.addressLine,

        building:
          selectedAddress.building ??
          "",

        apartment:
          selectedAddress.apartment ??
          "",

        notes:
          selectedAddress.notes ??
          "",
      });
    } else {
      saveDetails({
        fullName,
        email,
        phone,

        emirate:
          String(
            formData.get(
              "emirate"
            ) ?? ""
          ).trim(),

        area:
          String(
            formData.get(
              "area"
            ) ?? ""
          ).trim(),

        addressLine:
          String(
            formData.get(
              "addressLine"
            ) ?? ""
          ).trim(),

        building:
          String(
            formData.get(
              "building"
            ) ?? ""
          ).trim(),

        apartment:
          String(
            formData.get(
              "apartment"
            ) ?? ""
          ).trim(),

        notes:
          String(
            formData.get(
              "notes"
            ) ?? ""
          ).trim(),
      });
    }

    router.push(
      isGuest
        ? "/checkout/payment?mode=guest"
        : "/checkout/payment"
    );
  }

  if (
    !isReady ||
    !isCheckoutReady ||
    (user &&
      !isGuest &&
      !addressesReady)
  ) {
    return (
      <div className="min-h-[70vh] bg-[var(--brand-background)]" />
    );
  }

  if (
    !user &&
    !isGuest
  ) {
    return (
      <section className="min-h-[calc(100dvh-80px)] bg-[var(--brand-background)] px-4 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto max-w-[1120px]">
          <div className="mx-auto mb-5 max-w-[560px] text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]">
              Step 1 of 3 · Account
            </p>
          </div>

          <AuthPanel checkout />
        </div>
      </section>
    );
  }

  if (
    items.length === 0
  ) {
    return (
      <section className="min-h-[70vh] bg-[var(--brand-background)] px-5 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <ShoppingBag
            className="text-[var(--brand-primary)]"
            size={40}
            strokeWidth={1.4}
          />

          <h1 className="mt-5 font-serif text-4xl text-[var(--brand-text-dark)]">
            Nothing to check out yet.
          </h1>

          <p className="mt-3 text-sm text-[var(--brand-muted)]">
            Add a cheesecake to your cart first.
          </p>

          <Button
            href="/#cheesecakes"
            size="lg"
            className="mt-7"
          >
            Browse Cheesecakes
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--brand-background)] px-4 pb-32 pt-7 sm:px-8 lg:px-12 lg:pb-20 lg:pt-10">
      <div className="mx-auto max-w-[1120px]">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-[var(--brand-muted)] transition hover:text-[var(--brand-primary)]"
        >
          <ArrowLeft
            size={16}
          />

          Back to cart
        </Link>

        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]">
            Step 2 of 3 · Delivery
          </p>

          <h1 className="mt-2 font-serif text-3xl text-[var(--brand-text-dark)] sm:text-4xl">
            Where should we deliver?
          </h1>

          <p className="mt-2 text-sm text-[var(--brand-muted)]">
            {user
              ? `Signed in as ${user.email}`
              : "Continue as guest"}
          </p>
        </div>

        <form
          onSubmit={
            continueToPayment
          }
          className="mt-7 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start"
        >
          <div>
            <section className="rounded-[24px] border border-[var(--brand-border)] bg-white p-5 shadow-[0_12px_36px_rgba(50,23,22,0.04)] sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-serif text-2xl text-[var(--brand-text-dark)]">
                  Contact
                </h2>

                <span className="text-xs text-[var(--brand-muted)]">
                  Required fields
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  name="fullName"
                  autoComplete="name"
                  maxLength={100}
                  defaultValue={
                    details.fullName ||
                    user?.name ||
                    ""
                  }
                />

                <Field
                  label="Mobile number"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={30}
                  defaultValue={
                    details.phone ||
                    user?.phone ||
                    ""
                  }
                />

                <div className="sm:col-span-2">
                  <Field
                    label="Email address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    defaultValue={
                      details.email ||
                      user?.email ||
                      ""
                    }
                  />
                </div>
              </div>

              <div className="my-7 border-t border-[var(--brand-border)]" />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-[var(--brand-text-dark)]">
                    Delivery address
                  </h2>

                  {user &&
                    !isGuest &&
                    addresses.length >
                      0 && (
                      <p className="mt-1 text-xs text-[var(--brand-muted)]">
                        Choose a saved address or enter a different one.
                      </p>
                    )}
                </div>

                {user &&
                  !isGuest && (
                    <Link
                      href="/account/addresses"
                      className="shrink-0 text-xs font-semibold text-[var(--brand-primary)] transition hover:opacity-70"
                    >
                      Manage addresses
                    </Link>
                  )}
              </div>

              {addressesError && (
                <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
                  {
                    addressesError
                  }
                </div>
              )}

              {user &&
                !isGuest &&
                addressesLoading && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <AddressSkeleton />

                    <AddressSkeleton />
                  </div>
                )}

              {user &&
                !isGuest &&
                !addressesLoading &&
                addresses.length >
                  0 && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {addresses.map(
                      (
                        address
                      ) => (
                        <SavedAddressCard
                          key={
                            address.id
                          }
                          address={
                            address
                          }
                          selected={
                            selectedAddressId ===
                            address.id
                          }
                          onSelect={() =>
                            setSelectedAddressId(
                              address.id
                            )
                          }
                        />
                      )
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAddressId(
                          MANUAL_ADDRESS
                        )
                      }
                      className={`group flex min-h-[132px] cursor-pointer items-center gap-4 rounded-[20px] border p-4 text-left transition ${
                        selectedAddressId ===
                        MANUAL_ADDRESS
                          ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)]/35"
                          : "border-[var(--brand-border)] bg-white hover:border-[var(--brand-primary)]/50"
                      }`}
                    >
                      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                        <Plus
                          size={18}
                        />
                      </div>

                      <div>
                        <p className="font-serif text-lg text-[var(--brand-text-dark)]">
                          Use a different address
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[var(--brand-muted)]">
                          Enter delivery details for this order.
                        </p>
                      </div>
                    </button>
                  </div>
                )}

              {(!user ||
                isGuest ||
                addresses.length ===
                  0 ||
                selectedAddressId ===
                  MANUAL_ADDRESS) && (
                <div
                  className={
                    user &&
                    !isGuest &&
                    addresses.length >
                      0
                      ? "mt-7 border-t border-[var(--brand-border)] pt-2"
                      : ""
                  }
                >
                  {user &&
                    !isGuest &&
                    addresses.length >
                      0 && (
                      <div className="mt-4 flex items-center gap-2">
                        <MapPin
                          size={16}
                          className="text-[var(--brand-primary)]"
                        />

                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-text-dark)]">
                          Different address
                        </p>
                      </div>
                    )}

                  <ManualAddressFields
                    details={
                      details
                    }
                  />
                </div>
              )}

              {usingSavedAddress &&
                selectedAddress && (
                  <div className="mt-5 rounded-2xl bg-[var(--brand-primary-soft)]/30 px-4 py-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-primary)]">
                      <Check
                        size={15}
                      />

                      This address will be used for this order.
                    </div>
                  </div>
                )}

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  size="md"
                  iconRight={
                    <ArrowRight
                      size={15}
                    />
                  }
                  className="min-h-11 px-6"
                >
                  Continue to payment
                </Button>
              </div>
            </section>
          </div>

          <aside className="rounded-[24px] border border-[var(--brand-border)] bg-white p-5 lg:sticky lg:top-[112px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              Order summary ·{" "}
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}
            </p>

            <div className="mt-5 max-h-[330px] space-y-4 overflow-auto pr-1">
              {items.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    className="flex gap-3 border-b border-[var(--brand-border)] pb-4 last:border-0"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[var(--brand-primary-soft)]">
                      <Image
                        src={
                          item.image
                        }
                        alt={
                          item.name
                        }
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-base text-[var(--brand-text-dark)]">
                        {
                          item.name
                        }
                      </p>

                      <p className="mt-1 text-xs text-[var(--brand-muted)]">
                        Qty{" "}
                        {
                          item.quantity
                        }
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-[var(--brand-text-dark)]">
                      AED{" "}
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(
                        2
                      )}
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="mt-5 space-y-3 border-t border-[var(--brand-border)] pt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--brand-muted)]">
                  Subtotal
                </span>

                <span>
                  AED{" "}
                  {subtotal.toFixed(
                    2
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[var(--brand-muted)]">
                  Delivery
                </span>

                <span className="text-[var(--brand-muted)]">
                  Confirmed by phone
                </span>
              </div>

              <div className="flex justify-between border-t border-[var(--brand-border)] pt-4">
                <span className="font-serif text-xl">
                  Total
                </span>

                <span className="text-xl font-bold text-[var(--brand-primary)]">
                  AED{" "}
                  {subtotal.toFixed(
                    2
                  )}
                </span>
              </div>
            </div>

            <p className="mt-5 text-center text-[10px] leading-5 text-[var(--brand-muted)]">
              Your cart stays saved while you continue to payment.
            </p>
          </aside>
        </form>
      </div>
    </section>
  );
}

function SavedAddressCard({
  address,
  selected,
  onSelect,
}: {
  address: SavedAddress;
  selected: boolean;
  onSelect: () => void;
}) {
  const secondary =
    [
      address.building,
      address.apartment,
    ]
      .filter(Boolean)
      .join(" · ");

  return (
    <button
      type="button"
      onClick={
        onSelect
      }
      className={`relative min-h-[132px] cursor-pointer rounded-[20px] border p-4 text-left transition ${
        selected
          ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)]/35 shadow-[0_8px_25px_rgba(81,0,0,0.04)]"
          : "border-[var(--brand-border)] bg-white hover:border-[var(--brand-primary)]/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${
            selected
              ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
              : "border-[var(--brand-border)]"
          }`}
        >
          {selected && (
            <Check
              size={12}
              strokeWidth={3}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-serif text-lg text-[var(--brand-text-dark)]">
              {
                address.label
              }
            </p>

            {address.isDefault && (
              <span className="rounded-full bg-[var(--brand-primary)] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-white">
                Default
              </span>
            )}
          </div>

          <p className="mt-2 text-xs leading-5 text-[var(--brand-text-dark)]">
            {
              address.addressLine
            }
          </p>

          <p className="text-xs leading-5 text-[var(--brand-muted)]">
            {
              address.area
            }
            ,{" "}
            {
              address.emirate
            }
          </p>

          {secondary && (
            <p className="mt-1 text-[11px] leading-5 text-[var(--brand-muted)]">
              {
                secondary
              }
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

function ManualAddressFields({
  details,
}: {
  details: {
    emirate: string;
    area: string;
    addressLine: string;
    building: string;
    apartment: string;
    notes: string;
  };
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field
          label="Address"
          name="addressLine"
          autoComplete="street-address"
          maxLength={200}
          defaultValue={
            details.addressLine
          }
        />
      </div>

      <Field
        label="Area"
        name="area"
        maxLength={100}
        defaultValue={
          details.area
        }
      />

      <div className="mt-4">
        <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-text-dark)]">
          Emirate

          <select
            name="emirate"
            required
            defaultValue={
              details.emirate
            }
            className="mt-2 min-h-11 w-full cursor-pointer rounded-xl border border-[var(--brand-border)] bg-[var(--brand-background)] px-3.5 text-base font-normal normal-case tracking-normal outline-none transition focus:border-[var(--brand-primary)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/20"
          >
            <option
              value=""
              disabled
            >
              Select emirate
            </option>

            {emirates.map(
              (emirate) => (
                <option
                  key={
                    emirate
                  }
                  value={
                    emirate
                  }
                >
                  {
                    emirate
                  }
                </option>
              )
            )}
          </select>
        </label>
      </div>

      <Field
        label="Building / Villa"
        name="building"
        maxLength={100}
        required={false}
        defaultValue={
          details.building
        }
      />

      <Field
        label="Apartment / Unit"
        name="apartment"
        maxLength={50}
        required={false}
        defaultValue={
          details.apartment
        }
      />

      <div className="sm:col-span-2">
        <label className="mt-4 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--brand-text-dark)]">
          Delivery notes (optional)

          <textarea
            name="notes"
            rows={3}
            maxLength={500}
            defaultValue={
              details.notes
            }
            className="mt-2 w-full resize-none rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none transition focus:border-[var(--brand-primary)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/20"
            placeholder="Preferred delivery instructions"
          />
        </label>
      </div>
    </div>
  );
}

function AddressSkeleton() {
  return (
    <div className="min-h-[132px] animate-pulse rounded-[20px] border border-[var(--brand-border)] p-4">
      <div className="h-5 w-20 rounded bg-[var(--brand-primary-soft)]" />

      <div className="mt-4 h-3 w-4/5 rounded bg-[var(--brand-primary-soft)]" />

      <div className="mt-2 h-3 w-3/5 rounded bg-[var(--brand-primary-soft)]" />

      <div className="mt-2 h-3 w-2/5 rounded bg-[var(--brand-primary-soft)]" />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = true,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
}) {
  return (
    <label className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-text-dark)]">
      {label}

      <input
        {...props}
        required={
          required
        }
        name={
          name
        }
        type={
          type
        }
        className="mt-2 min-h-11 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-background)] px-3.5 text-base font-normal normal-case tracking-normal outline-none transition focus:border-[var(--brand-primary)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/20"
      />
    </label>
  );
}