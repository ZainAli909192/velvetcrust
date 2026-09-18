"use client";

import {
  Check,
  LoaderCircle,
  X,
} from "lucide-react";

export type AddressLabel =
  | "Home"
  | "Office"
  | "Other";

export type AddressFormData = {
  label: AddressLabel;

  emirate: string;
  area: string;
  addressLine: string;

  building: string;
  apartment: string;
  notes: string;

  isDefault: boolean;
};

export const EMPTY_ADDRESS: AddressFormData =
  {
    label: "Home",

    emirate: "Dubai",

    area: "",

    addressLine: "",

    building: "",

    apartment: "",

    notes: "",

    isDefault: false,
  };

const emirates = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairh",
];

export default function AddressForm({
  value,
  saving,
  error,
  editing,
  onChange,
  onCancel,
  onSubmit,
}: {
  value: AddressFormData;

  saving: boolean;

  error: string;

  editing: boolean;

  onChange: (
    value: AddressFormData
  ) => void;

  onCancel: () => void;

  onSubmit: () => void;
}) {
  function update<
    K extends keyof AddressFormData,
  >(
    key: K,
    fieldValue:
      AddressFormData[K]
  ) {
    onChange({
      ...value,

      [key]:
        fieldValue,
    });
  }

  return (
    <section className="rounded-[26px] border border-[var(--brand-border)] bg-white p-5 shadow-[0_18px_50px_rgba(81,0,0,0.04)] sm:p-7">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            Address
          </p>

          <h2 className="mt-1 font-serif text-2xl text-[var(--brand-text-dark)]">
            {editing
              ? "Edit address"
              : "Add address"}
          </h2>
        </div>

        <button
          type="button"
          onClick={
            onCancel
          }
          aria-label="Close address form"
          className="grid size-9 cursor-pointer place-items-center rounded-full text-[var(--brand-text-dark)] transition hover:bg-[var(--brand-primary-soft)]"
        >
          <X
            size={18}
          />
        </button>
      </div>

      <div className="mt-7 grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-[var(--brand-text-dark)]">
            Label
          </label>

          <select
            value={
              value.label
            }
            onChange={(
              event
            ) =>
              update(
                "label",
                event.target
                  .value as AddressLabel
              )
            }
            className="mt-2 min-h-12 w-full cursor-pointer rounded-[14px] border border-[var(--brand-border)] bg-white px-4 text-sm outline-none transition focus:border-[var(--brand-primary)]"
          >
            <option value="Home">
              Home
            </option>

            <option value="Office">
              Office
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--brand-text-dark)]">
            Emirate
          </label>

          <select
            value={
              value.emirate
            }
            onChange={(
              event
            ) =>
              update(
                "emirate",
                event.target
                  .value
              )
            }
            className="mt-2 min-h-12 w-full cursor-pointer rounded-[14px] border border-[var(--brand-border)] bg-white px-4 text-sm outline-none transition focus:border-[var(--brand-primary)]"
          >
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
        </div>

        <Field
          label="Area"
          value={
            value.area
          }
          maxLength={100}
          placeholder="JVC"
          onChange={(
            nextValue
          ) =>
            update(
              "area",
              nextValue
            )
          }
        />

        <Field
          label="Building / Villa"
          value={
            value.building
          }
          maxLength={100}
          required={false}
          placeholder="Building or villa"
          onChange={(
            nextValue
          ) =>
            update(
              "building",
              nextValue
            )
          }
        />

        <div className="sm:col-span-2">
          <Field
            label="Address"
            value={
              value.addressLine
            }
            maxLength={200}
            placeholder="Street and address"
            onChange={(
              nextValue
            ) =>
              update(
                "addressLine",
                nextValue
              )
            }
          />
        </div>

        <Field
          label="Apartment / Unit"
          value={
            value.apartment
          }
          maxLength={50}
          required={false}
          placeholder="Apartment / unit"
          onChange={(
            nextValue
          ) =>
            update(
              "apartment",
              nextValue
            )
          }
        />

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-[var(--brand-text-dark)]">
            Delivery notes
          </label>

          <textarea
            value={
              value.notes
            }
            maxLength={500}
            rows={4}
            onChange={(
              event
            ) =>
              update(
                "notes",
                event.target
                  .value
              )
            }
            placeholder="Optional delivery instructions"
            className="mt-2 w-full resize-none rounded-[14px] border border-[var(--brand-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-primary)]"
          />
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={
            value.isDefault
          }
          onChange={(
            event
          ) =>
            update(
              "isDefault",
              event.target
                .checked
            )
          }
          className="size-4 cursor-pointer accent-[var(--brand-primary)]"
        />

        <span className="text-sm text-[var(--brand-text-dark)]">
          Make this my default address
        </span>
      </label>

      {error && (
        <div className="mt-5 rounded-[14px] bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={
            saving
          }
          onClick={
            onSubmit
          }
          className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-7 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle
              size={16}
              className="animate-spin"
            />
          ) : (
            <Check
              size={15}
            />
          )}

          {saving
            ? "Saving..."
            : editing
              ? "Save changes"
              : "Save address"}
        </button>

        <button
          type="button"
          disabled={
            saving
          }
          onClick={
            onCancel
          }
          className="min-h-12 cursor-pointer rounded-full border border-[var(--brand-border)] px-6 text-xs font-semibold text-[var(--brand-text-dark)] transition hover:border-[var(--brand-primary)] disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  placeholder,
  maxLength,
  required = true,
  onChange,
}: {
  label: string;

  value: string;

  placeholder?: string;

  maxLength: number;

  required?: boolean;

  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-[var(--brand-text-dark)]">
        {label}
      </label>

      <input
        value={
          value
        }
        required={
          required
        }
        maxLength={
          maxLength
        }
        placeholder={
          placeholder
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target
              .value
          )
        }
        className="mt-2 min-h-12 w-full rounded-[14px] border border-[var(--brand-border)] bg-white px-4 text-sm outline-none transition focus:border-[var(--brand-primary)]"
      />
    </div>
  );
}