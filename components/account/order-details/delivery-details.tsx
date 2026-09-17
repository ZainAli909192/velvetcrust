"use client";

import {
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import type {
  CustomerDetails,
  DeliveryAddress,
} from "../order-details";

export default function DeliveryDetails({
  customer,
  address,
}: {
  customer:
    CustomerDetails;
  address:
    DeliveryAddress;
}) {
  const addressLines = [
    address.addressLine,
    address.building,
    address.apartment
      ? `Apartment ${address.apartment}`
      : "",
    address.area,
    address.emirate,
  ].filter(Boolean);

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="border-t border-[var(--brand-border)] pt-8"
    >
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
        Delivery
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[var(--brand-text-dark)]">
        Delivery details
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <InfoItem
          icon={
            <UserRound
              size={18}
            />
          }
          label="Customer"
          value={
            customer.fullName
          }
        />

        <InfoItem
          icon={
            <Phone
              size={18}
            />
          }
          label="Phone"
          value={
            customer.phone
          }
        />

        <InfoItem
          icon={
            <Mail
              size={18}
            />
          }
          label="Email"
          value={
            customer.email
          }
        />

        <InfoItem
          icon={
            <MapPin
              size={18}
            />
          }
          label="Delivery address"
          value={addressLines.join(
            ", "
          )}
        />
      </div>

      {address.notes && (
        <div className="mt-4 rounded-[20px] border border-[var(--brand-border)] bg-white p-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">
            Delivery notes
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--brand-text-dark)]">
            {
              address.notes
            }
          </p>
        </div>
      )}
    </motion.section>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon:
    React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4 rounded-[20px] border border-[var(--brand-border)] bg-white p-5">
      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">
          {label}
        </p>

        <p className="mt-1.5 break-words text-sm leading-6 text-[var(--brand-text-dark)]">
          {value ||
            "Unavailable"}
        </p>
      </div>
    </div>
  );
}