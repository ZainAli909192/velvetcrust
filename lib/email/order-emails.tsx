import {
  OrderEmailData,
} from "./order-email-types";

import {
  sendCustomerOrderEmail,
} from "./customer-order-email";

import {
  sendOwnerOrderEmail,
} from "./owner-order-email";

import {
  sendCustomerOrderConfirmedEmail,
} from "./customer-order-confirmed-email";

import {
  sendOwnerOrderConfirmedEmail,
} from "./owner-order-confirmed-email";

import {
  sendCustomerCancellationEmail,
} from "./customer-cancellation-email";

import {
  sendOwnerCancellationEmail,
} from "./owner-cancellation-email";

export type {
  OrderEmailData,
} from "./order-email-types";

export {
  sendCustomerOrderConfirmedEmail,
  sendOwnerOrderConfirmedEmail,
};

export async function sendOrderCreatedEmails(
  order: OrderEmailData
) {
  const results =
    await Promise.allSettled([
      sendCustomerOrderEmail(
        order
      ),

      sendOwnerOrderEmail(
        order
      ),
    ]);

  const [
    customerResult,
    ownerResult,
  ] = results;

  if (
    customerResult.status ===
    "rejected"
  ) {
    console.error(
      "Customer order email failed:",
      customerResult.reason
    );
  }

  if (
    ownerResult.status ===
    "rejected"
  ) {
    console.error(
      "Owner order email failed:",
      ownerResult.reason
    );
  }

  return {
    customerSent:
      customerResult.status ===
      "fulfilled",

    ownerSent:
      ownerResult.status ===
      "fulfilled",
  };
}

export async function sendOrderConfirmedEmails(
  order: OrderEmailData
) {
  const results =
    await Promise.allSettled([
      sendCustomerOrderConfirmedEmail(
        order
      ),

      sendOwnerOrderConfirmedEmail(
        order
      ),
    ]);

  const [
    customerResult,
    ownerResult,
  ] = results;

  if (
    customerResult.status ===
    "rejected"
  ) {
    console.error(
      "Customer confirmation email failed:",
      customerResult.reason
    );
  }

  if (
    ownerResult.status ===
    "rejected"
  ) {
    console.error(
      "Owner confirmation email failed:",
      ownerResult.reason
    );
  }

  return {
    customerSent:
      customerResult.status ===
      "fulfilled",

    ownerSent:
      ownerResult.status ===
      "fulfilled",

    allSent:
      customerResult.status ===
        "fulfilled" &&
      ownerResult.status ===
        "fulfilled",
  };
}

export async function sendOrderCancellationEmails(
  order: OrderEmailData
) {
  const results =
    await Promise.allSettled([
      sendCustomerCancellationEmail(
        order
      ),

      sendOwnerCancellationEmail(
        order
      ),
    ]);

  const [
    customerResult,
    ownerResult,
  ] = results;

  if (
    customerResult.status ===
    "rejected"
  ) {
    console.error(
      "Customer cancellation email failed:",
      customerResult.reason
    );
  }

  if (
    ownerResult.status ===
    "rejected"
  ) {
    console.error(
      "Owner cancellation email failed:",
      ownerResult.reason
    );
  }

  return {
    customerSent:
      customerResult.status ===
      "fulfilled",

    ownerSent:
      ownerResult.status ===
      "fulfilled",
  };
}