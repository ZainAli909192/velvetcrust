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
  LocateFixed,
  LoaderCircle,
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

import type {
  CheckoutDetails,
} from "@/types/checkout";

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

type ReverseGeocodeResponse = {
  success: boolean;

  location?: {
    emirate: string;
    area: string;
    addressLine: string;
  };

  message?: string;
};

type ManualAddress = {
  emirate: string;
  area: string;
  addressLine: string;
  building: string;
  apartment: string;
  notes: string;
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
    saveAddressError,
    setSaveAddressError,
  ] = useState("");

  const [
    savingAddress,
    setSavingAddress,
  ] = useState(false);

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

  const [
    manualAddress,
    setManualAddress,
  ] =
    useState<ManualAddress>({
      emirate:
        details.emirate,

      area:
        details.area,

      addressLine:
        details.addressLine,

      building:
        details.building,

      apartment:
        details.apartment,

      notes:
        details.notes,
    });

  const [
    locating,
    setLocating,
  ] = useState(false);

  const [
    locationError,
    setLocationError,
  ] = useState("");

  const [
    locationSuccess,
    setLocationSuccess,
  ] = useState(false);

  useEffect(() => {
    if (
      !isReady ||
      !user ||
      isGuest
    ) {
      const resetTimer =
        window.setTimeout(
          () => {
            setAddresses(
              []
            );

            setSelectedAddressId(
              MANUAL_ADDRESS
            );

            setAddressesReady(
              true
            );
          },
          0
        );

      return () =>
        window.clearTimeout(
          resetTimer
        );
    }

    let active = true;

    async function loadAddresses() {
      setAddressesLoading(
        true
      );

      setAddressesError(
        ""
      );

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

  function updateManualAddress<
    K extends keyof ManualAddress,
  >(
    key: K,
    value: ManualAddress[K]
  ) {
    setManualAddress(
      (current) => ({
        ...current,
        [key]: value,
      })
    );

    if (
      locationSuccess
    ) {
      setLocationSuccess(
        false
      );
    }
  }

  async function useCurrentLocation() {
    if (locating) {
      return;
    }

    setLocationError(
      ""
    );

    setLocationSuccess(
      false
    );

    setSelectedAddressId(
      MANUAL_ADDRESS
    );

    if (
      !navigator.geolocation
    ) {
      setLocationError(
        "Current location is not supported by this browser."
      );

      return;
    }

    setLocating(
      true
    );

    navigator.geolocation.getCurrentPosition(
      async (
        position
      ) => {
        try {
          const response =
            await axios.post<ReverseGeocodeResponse>(
              "/api/location/reverse-geocode",
              {
                latitude:
                  position.coords
                    .latitude,

                longitude:
                  position.coords
                    .longitude,
              }
            );

          const location =
            response.data
              .location;

          if (
            !response.data
              .success ||
            !location
          ) {
            setLocationError(
              response.data
                .message ||
                "Unable to find your address."
            );

            return;
          }

          setManualAddress(
            (current) => ({
              ...current,

              emirate:
                location.emirate,

              area:
                location.area,

              addressLine:
                location.addressLine,
            })
          );

          setLocationSuccess(
            true
          );
        } catch (error) {
          const message =
            axios.isAxiosError(
              error
            ) &&
            typeof error
              .response?.data
              ?.message ===
              "string"
              ? error.response
                  .data.message
              : "Unable to find your address from your current location.";

          setLocationError(
            message
          );
        } finally {
          setLocating(
            false
          );
        }
      },

      (error) => {
        setLocating(
          false
        );

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          setLocationError(
            "Location access was denied. Allow location access in your browser or enter the address manually."
          );

          return;
        }

        if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          setLocationError(
            "Your current location could not be determined. Please enter the address manually."
          );

          return;
        }

        if (
          error.code ===
          error.TIMEOUT
        ) {
          setLocationError(
            "Location detection took too long. Please try again."
          );

          return;
        }

        setLocationError(
          "Unable to detect your current location."
        );
      },

      {
        enableHighAccuracy:
          true,

        timeout: 10000,

        maximumAge: 60000,
      }
    );
  }

  async function continueToPayment(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      savingAddress ||
      locating
    ) {
      return;
    }

    setSaveAddressError(
      ""
    );

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

    let nextDetails: CheckoutDetails;

    if (
      usingSavedAddress &&
      selectedAddress
    ) {
      nextDetails = {
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
      };
    } else {
      nextDetails = {
        fullName,
        email,
        phone,

        emirate:
          manualAddress.emirate.trim(),

        area:
          manualAddress.area.trim(),

        addressLine:
          manualAddress.addressLine.trim(),

        building:
          manualAddress.building.trim(),

        apartment:
          manualAddress.apartment.trim(),

        notes:
          manualAddress.notes.trim(),
      };
    }

    if (
      user &&
      !isGuest &&
      !usingSavedAddress
    ) {
      const alreadySaved =
        addresses.some(
          (address) =>
            address.emirate ===
              nextDetails.emirate &&
            address.area ===
              nextDetails.area &&
            address.addressLine ===
              nextDetails.addressLine &&
            (address.building ??
              "") ===
              nextDetails.building &&
            (address.apartment ??
              "") ===
              nextDetails.apartment &&
            (address.notes ??
              "") ===
              nextDetails.notes
        );

      if (!alreadySaved) {
        setSavingAddress(
          true
        );

        try {
          await axios.post(
            "/api/account/addresses",
            {
              label:
                addresses.length ===
                0
                  ? "Home"
                  : "Other",

              emirate:
                nextDetails.emirate,

              area:
                nextDetails.area,

              addressLine:
                nextDetails.addressLine,

              building:
                nextDetails.building,

              apartment:
                nextDetails.apartment,

              notes:
                nextDetails.notes,
            }
          );
        } catch (error) {
          const message =
            axios.isAxiosError(
              error
            ) &&
            typeof error
              .response?.data
              ?.message ===
              "string"
              ? error.response
                  .data.message
              : "Unable to save your address. Please try again.";

          setSaveAddressError(
            message
          );

          return;
        } finally {
          setSavingAddress(
            false
          );
        }
      }
    }

    saveDetails(
      nextDetails
    );

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

  const showManualAddress =
    !user ||
    isGuest ||
    addresses.length ===
      0 ||
    selectedAddressId ===
      MANUAL_ADDRESS;

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
                          onSelect={() => {
                            setSelectedAddressId(
                              address.id
                            );

                            setLocationError(
                              ""
                            );

                            setLocationSuccess(
                              false
                            );
                          }}
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

              {showManualAddress && (
                <div
                  className={
                    user &&
                    !isGuest &&
                    addresses.length >
                      0
                      ? "mt-7 border-t border-[var(--brand-border)] pt-5"
                      : "mt-5"
                  }
                >
                  <button
                    type="button"
                    disabled={
                      locating
                    }
                    onClick={() =>
                      void useCurrentLocation()
                    }
                    className="flex w-full cursor-pointer items-center gap-3 rounded-[18px] border border-[var(--brand-border)] bg-[var(--brand-primary-soft)]/20 px-4 py-4 text-left transition hover:border-[var(--brand-primary)] disabled:cursor-wait disabled:opacity-70"
                  >
                    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[var(--brand-primary)]">
                      {locating ? (
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                      ) : (
                        <LocateFixed
                          size={18}
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--brand-text-dark)]">
                        {locating
                          ? "Finding your location..."
                          : "Use my current location"}
                      </p>

                      <p className="mt-0.5 text-xs text-[var(--brand-muted)]">
                        Autofill your delivery address
                      </p>
                    </div>

                    {!locating && (
                      <ArrowRight
                        size={16}
                        className="text-[var(--brand-primary)]"
                      />
                    )}
                  </button>

                  {locationSuccess && (
                    <div className="mt-3 flex items-start gap-2 rounded-[14px] bg-green-50 px-4 py-3 text-xs leading-5 text-green-700">
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0"
                      />

                      <span>
                        Location found. Please check the address details before continuing.
                      </span>
                    </div>
                  )}

                  {locationError && (
                    <div
                      role="alert"
                      className="mt-3 rounded-[14px] bg-red-50 px-4 py-3 text-xs leading-5 text-red-700"
                    >
                      {
                        locationError
                      }
                    </div>
                  )}

                  <ManualAddressFields
                    address={
                      manualAddress
                    }
                    onChange={
                      updateManualAddress
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

              {saveAddressError && (
                <p
                  role="alert"
                  className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {
                    saveAddressError
                  }
                </p>
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    savingAddress ||
                    locating
                  }
                  size="md"
                  iconRight={
                    <ArrowRight
                      size={15}
                    />
                  }
                  className="min-h-11 px-6"
                >
                  {savingAddress
                    ? "Saving address..."
                    : locating
                      ? "Finding location..."
                      : "Continue to payment"}
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
  address,
  onChange,
}: {
  address: ManualAddress;

  onChange: <
    K extends keyof ManualAddress,
  >(
    key: K,
    value: ManualAddress[K]
  ) => void;
}) {
  return (
    <div className="mt-2 grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <ControlledField
          label="Address"
          name="addressLine"
          autoComplete="street-address"
          maxLength={200}
          value={
            address.addressLine
          }
          onChange={(
            value
          ) =>
            onChange(
              "addressLine",
              value
            )
          }
        />
      </div>

      <ControlledField
        label="Area"
        name="area"
        maxLength={100}
        value={
          address.area
        }
        onChange={(
          value
        ) =>
          onChange(
            "area",
            value
          )
        }
      />

      <div className="mt-4">
        <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-text-dark)]">
          Emirate

          <select
            name="emirate"
            required
            value={
              address.emirate
            }
            onChange={(
              event
            ) =>
              onChange(
                "emirate",
                event.target
                  .value
              )
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

      <ControlledField
        label="Building / Villa"
        name="building"
        maxLength={100}
        required={false}
        value={
          address.building
        }
        onChange={(
          value
        ) =>
          onChange(
            "building",
            value
          )
        }
      />

      <ControlledField
        label="Apartment / Unit"
        name="apartment"
        maxLength={50}
        required={false}
        value={
          address.apartment
        }
        onChange={(
          value
        ) =>
          onChange(
            "apartment",
            value
          )
        }
      />

      <div className="sm:col-span-2">
        <label className="mt-4 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--brand-text-dark)]">
          Delivery notes (optional)

          <textarea
            name="notes"
            rows={3}
            maxLength={500}
            value={
              address.notes
            }
            onChange={(
              event
            ) =>
              onChange(
                "notes",
                event.target
                  .value
              )
            }
            className="mt-2 w-full resize-none rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none transition focus:border-[var(--brand-primary)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/20"
            placeholder="Preferred delivery instructions"
          />
        </label>
      </div>
    </div>
  );
}

function ControlledField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = true,
  ...props
}: Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  label: string;
  name: string;
  value: string;
  onChange: (
    value: string
  ) => void;
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
        value={
          value
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
        className="mt-2 min-h-11 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-background)] px-3.5 text-base font-normal normal-case tracking-normal outline-none transition focus:border-[var(--brand-primary)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/20"
      />
    </label>
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