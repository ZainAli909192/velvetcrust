import {
  Resend,
} from "resend";

import {
  OrderEmailData,
  OrderEmailItem,
} from "./order-email-types";

export function escapeHtml(
  value: string
) {
  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}

export function money(
  value: number
) {
  const safeValue =
    Number.isFinite(
      Number(value)
    )
      ? Number(value)
      : 0;

  return `AED ${safeValue.toFixed(
    2
  )}`;
}

export function paymentLabel(
  method: string
) {
  switch (
    method.toLowerCase()
  ) {
    case "card":
      return "Credit / Debit Card";

    case "apple_pay":
      return "Apple Pay";

    case "google_pay":
      return "Google Pay";

    case "tabby":
      return "Tabby";

    case "tamara":
      return "Tamara";

    default:
      return method;
  }
}

export function buildItemsHtml(
  items: OrderEmailItem[]
) {
  return items
    .map(
      (item) => `
        <tr>
          <td
            style="
              padding:12px 0;
              border-bottom:1px solid #eaded8;
            "
          >
            <div
              style="
                font-weight:600;
                color:#510000;
              "
            >
              ${escapeHtml(
                item.name
              )}
            </div>

            <div
              style="
                margin-top:4px;
                font-size:13px;
                color:#765e59;
              "
            >
              Qty ${item.quantity}
              ×
              ${money(
                item.unitPrice
              )}
            </div>
          </td>

          <td
            align="right"
            style="
              padding:12px 0;
              border-bottom:1px solid #eaded8;
              font-weight:600;
              color:#510000;
            "
          >
            ${money(
              item.totalPrice
            )}
          </td>
        </tr>
      `
    )
    .join("");
}

export function buildDeliveryHtml(
  order: OrderEmailData
) {
  const {
    deliveryAddress,
  } = order;

  return `
    ${escapeHtml(
      deliveryAddress.addressLine
    )}
    <br/>

    ${escapeHtml(
      deliveryAddress.area
    )},
    ${escapeHtml(
      deliveryAddress.emirate
    )}

    ${
      deliveryAddress.building
        ? `
          <br/>
          ${escapeHtml(
            deliveryAddress.building
          )}
        `
        : ""
    }

    ${
      deliveryAddress.apartment
        ? `
          <br/>
          Apartment / Unit:
          ${escapeHtml(
            deliveryAddress.apartment
          )}
        `
        : ""
    }
  `;
}

export function formatCancellationDate(
  value?:
    | Date
    | string
    | null
) {
  if (!value) {
    return "Just now";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Just now";
  }

  return new Intl.DateTimeFormat(
    "en-AE",
    {
      dateStyle: "long",
      timeStyle: "short",
      timeZone:
        "Asia/Dubai",
    }
  ).format(date);
}

export function getResend() {
  const apiKey =
    process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured."
    );
  }

  return new Resend(
    apiKey
  );
}

export function getFromEmail() {
  const from =
    process.env.RESEND_FROM_EMAIL;

  if (!from) {
    throw new Error(
      "RESEND_FROM_EMAIL is not configured."
    );
  }

  return from;
}

export function getOwnerEmail() {
  const ownerEmail =
    process.env.OWNER_EMAIL;

  if (!ownerEmail) {
    throw new Error(
      "OWNER_EMAIL is not configured."
    );
  }

  return ownerEmail;
}