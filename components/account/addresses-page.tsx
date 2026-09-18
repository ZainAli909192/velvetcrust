"use client";

import axios, {
  AxiosError,
} from "axios";

import Link from "next/link";

import {
  ArrowLeft,
  Check,
  Edit3,
  MapPin,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useAuth,
} from "@/components/store/auth-context";

import AddressForm, {
  AddressFormData,
  AddressLabel,
  EMPTY_ADDRESS,
} from "./address-form";

type Address = {
  id: string;

  label: AddressLabel;

  emirate: string;
  area: string;
  addressLine: string;

  building: string;
  apartment: string;
  notes: string;

  isDefault: boolean;
};

type AddressesResponse = {
  success: boolean;
  addresses: Address[];
  message?: string;
};

type ErrorResponse = {
  message?: string;
};

export default function AddressesPage() {
  const router =
    useRouter();

  const {
    user,
    isReady,
  } = useAuth();

  const [
    addresses,
    setAddresses,
  ] =
    useState<Address[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    formOpen,
    setFormOpen,
  ] = useState(false);

  const [
    editingId,
    setEditingId,
  ] =
    useState<string | null>(
      null
    );

  const [
    form,
    setForm,
  ] =
    useState<AddressFormData>(
      EMPTY_ADDRESS
    );

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const loadAddresses =
    useCallback(
      async () => {
        if (!user) {
          return;
        }

        setLoading(true);

        try {
          const response =
            await axios.get<AddressesResponse>(
              "/api/account/addresses"
            );

          setAddresses(
            response.data
              .addresses ?? []
          );
        } catch (error) {
          console.error(
            "Load addresses:",
            error
          );

          setAddresses([]);
        } finally {
          setLoading(false);
        }
      },
      [user]
    );

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

  useEffect(() => {
    if (
      isReady &&
      user
    ) {
      void loadAddresses();
    }
  }, [
    isReady,
    user,
    loadAddresses,
  ]);

  function startAdd() {
    setEditingId(
      null
    );

    setForm({
      ...EMPTY_ADDRESS,

      isDefault:
        addresses.length ===
        0,
    });

    setFormError("");
    setMessage("");

    setFormOpen(true);
  }

  function startEdit(
    address: Address
  ) {
    setEditingId(
      address.id
    );

    setForm({
      label:
        address.label,

      emirate:
        address.emirate,

      area:
        address.area,

      addressLine:
        address.addressLine,

      building:
        address.building,

      apartment:
        address.apartment,

      notes:
        address.notes,

      isDefault:
        address.isDefault,
    });

    setFormError("");
    setMessage("");

    setFormOpen(true);
  }

  async function saveAddress() {
    if (saving) {
      return;
    }

    if (
      !form.label ||
      !form.emirate ||
      !form.area.trim() ||
      !form.addressLine.trim()
    ) {
      setFormError(
        "Please complete the required address fields."
      );

      return;
    }

    setSaving(true);
    setFormError("");

    try {
      if (editingId) {
        await axios.patch(
          `/api/account/addresses/${editingId}`,
          {
            label:
              form.label,

            emirate:
              form.emirate,

            area:
              form.area,

            addressLine:
              form.addressLine,

            building:
              form.building,

            apartment:
              form.apartment,

            notes:
              form.notes,
          }
        );

        if (
          form.isDefault
        ) {
          await axios.patch(
            `/api/account/addresses/${editingId}`,
            {
              action:
                "set-default",
            }
          );
        }

        setMessage(
          "Address updated successfully."
        );
      } else {
        await axios.post(
          "/api/account/addresses",
          form
        );

        setMessage(
          "Address saved successfully."
        );
      }

      setFormOpen(
        false
      );

      setEditingId(
        null
      );

      await loadAddresses();
    } catch (error) {
      const apiError =
        error as AxiosError<ErrorResponse>;

      setFormError(
        apiError.response
          ?.data?.message ||
          "Unable to save address."
      );
    } finally {
      setSaving(false);
    }
  }

  async function setDefault(
    id: string
  ) {
    try {
      await axios.patch(
        `/api/account/addresses/${id}`,
        {
          action:
            "set-default",
        }
      );

      setMessage(
        "Default address updated."
      );

      await loadAddresses();
    } catch (error) {
      console.error(
        "Set default:",
        error
      );
    }
  }

  async function deleteAddress(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this saved address?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `/api/account/addresses/${id}`
      );

      setMessage(
        "Address deleted."
      );

      await loadAddresses();
    } catch (error) {
      console.error(
        "Delete address:",
        error
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
      <div className="mx-auto max-w-[900px]">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--brand-muted)] transition hover:text-[var(--brand-primary)]"
        >
          <ArrowLeft
            size={16}
          />

          Back to account
        </Link>

        <div className="mt-7 flex items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
              My account
            </p>

            <h1 className="mt-2 font-serif text-4xl text-[var(--brand-text-dark)] sm:text-5xl">
              Saved addresses
            </h1>

            <p className="mt-3 text-sm text-[var(--brand-muted)]">
              Manage your delivery addresses.
            </p>
          </div>

          {!formOpen && (
            <button
              type="button"
              onClick={
                startAdd
              }
              className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 text-xs font-semibold text-white transition hover:opacity-90"
            >
              <Plus
                size={16}
              />

              Add address
            </button>
          )}
        </div>

        {message && (
          <div className="mt-6 flex items-center gap-2 rounded-[14px] bg-green-50 px-4 py-3 text-xs text-green-700">
            <Check
              size={15}
            />

            {message}
          </div>
        )}

        {formOpen && (
          <div className="mt-8">
            <AddressForm
              value={form}
              saving={
                saving
              }
              error={
                formError
              }
              editing={
                Boolean(
                  editingId
                )
              }
              onChange={
                setForm
              }
              onCancel={() => {
                setFormOpen(
                  false
                );

                setEditingId(
                  null
                );

                setFormError(
                  ""
                );
              }}
              onSubmit={
                saveAddress
              }
            />
          </div>
        )}

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2].map(
                (item) => (
                  <div
                    key={
                      item
                    }
                    className="h-52 animate-pulse rounded-[24px] bg-black/5"
                  />
                )
              )}
            </div>
          ) : addresses.length ===
            0 ? (
            <div className="rounded-[24px] border border-[var(--brand-border)] bg-white px-5 py-14 text-center">
              <MapPin
                size={26}
                className="mx-auto text-[var(--brand-primary)]"
              />

              <h2 className="mt-4 font-serif text-2xl text-[var(--brand-text-dark)]">
                No saved addresses
              </h2>

              <p className="mt-2 text-sm text-[var(--brand-muted)]">
                Add an address to make checkout faster.
              </p>

              {!formOpen && (
                <button
                  type="button"
                  onClick={
                    startAdd
                  }
                  className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 text-xs font-semibold text-white"
                >
                  <Plus
                    size={15}
                  />

                  Add address
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map(
                (
                  address
                ) => (
                  <div
                    key={
                      address.id
                    }
                    className="relative rounded-[24px] border border-[var(--brand-border)] bg-white p-5 shadow-[0_10px_30px_rgba(81,0,0,0.025)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid size-10 place-items-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                        <MapPin
                          size={17}
                        />
                      </div>

                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-primary-soft)] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--brand-primary)]">
                          <Star
                            size={11}
                            fill="currentColor"
                          />

                          Default
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 font-serif text-xl text-[var(--brand-text-dark)]">
                      {
                        address.label
                      }
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                      {
                        address.addressLine
                      }

                      <br />

                      {
                        address.area
                      }
                      ,{" "}
                      {
                        address.emirate
                      }

                      {address.building && (
                        <>
                          <br />

                          {
                            address.building
                          }
                        </>
                      )}

                      {address.apartment && (
                        <>
                          {" · "}

                          {
                            address.apartment
                          }
                        </>
                      )}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--brand-border)] pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(
                            address
                          )
                        }
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--brand-border)] px-3 py-2 text-[11px] font-semibold text-[var(--brand-text-dark)] transition hover:border-[var(--brand-primary)]"
                      >
                        <Edit3
                          size={13}
                        />

                        Edit
                      </button>

                      {!address.isDefault && (
                        <button
                          type="button"
                          onClick={() =>
                            void setDefault(
                              address.id
                            )
                          }
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--brand-border)] px-3 py-2 text-[11px] font-semibold text-[var(--brand-primary)] transition hover:border-[var(--brand-primary)]"
                        >
                          <Star
                            size={13}
                          />

                          Set default
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          void deleteAddress(
                            address.id
                          )
                        }
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-red-100 px-3 py-2 text-[11px] font-semibold text-red-700 transition hover:bg-red-50"
                      >
                        <Trash2
                          size={13}
                        />

                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}