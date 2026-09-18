import {
  Types,
} from "mongoose";

export type OrderItemInput = {
  productId?: unknown;
  quantity?: unknown;
};

export type CustomerDetailsInput = {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
};

export type DeliveryAddressInput = {
  emirate?: unknown;
  area?: unknown;
  addressLine?: unknown;
  building?: unknown;
  apartment?: unknown;
  notes?: unknown;
};

export type CreateOrderBody = {
  items?: unknown;
  customerDetails?: unknown;
  deliveryAddress?: unknown;
  paymentMethod?: unknown;
};

export type PaymentMethod =
  | "card"
  | "apple_pay"
  | "google_pay"
  | "tabby"
  | "tamara";

export type ValidatedOrderInput = {
  items: Array<{
    productId: string;
    quantity: number;
  }>;

  customerDetails: {
    fullName: string;
    email: string;
    phone: string;
  };

  deliveryAddress: {
    emirate: string;
    area: string;
    addressLine: string;
    building: string;
    apartment: string;
    notes: string;
  };

  paymentMethod:
    PaymentMethod;
};

type ValidationResult =
  | {
      success: true;
      data:
        ValidatedOrderInput;
    }
  | {
      success: false;
      message: string;
    };

const MAX_PRODUCTS = 10;
const MAX_QUANTITY = 20;

const PAYMENT_METHODS:
  PaymentMethod[] = [
    "card",
    "apple_pay",
    "google_pay",
    "tabby",
    "tamara",
  ];

function normalizeString(
  value: unknown,
  maxLength: number
) {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const normalized =
    value.trim();

  if (
    !normalized ||
    normalized.length >
      maxLength
  ) {
    return null;
  }

  return normalized;
}

function normalizeOptionalString(
  value: unknown,
  maxLength: number
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "";
  }

  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const normalized =
    value.trim();

  if (
    normalized.length >
    maxLength
  ) {
    return null;
  }

  return normalized;
}

function normalizeEmail(
  value: unknown
) {
  const email =
    normalizeString(
      value,
      254
    );

  if (!email) {
    return null;
  }

  const normalized =
    email.toLowerCase();

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !emailPattern.test(
      normalized
    )
  ) {
    return null;
  }

  return normalized;
}

function isAllowedPaymentMethod(
  value: unknown
): value is PaymentMethod {
  return (
    typeof value ===
      "string" &&
    PAYMENT_METHODS.includes(
      value as PaymentMethod
    )
  );
}

export function validateOrderInput(
  body: CreateOrderBody
): ValidationResult {
  if (
    !Array.isArray(
      body.items
    ) ||
    body.items.length < 1 ||
    body.items.length >
      MAX_PRODUCTS
  ) {
    return {
      success: false,

      message:
        "Order must contain between 1 and 10 products.",
    };
  }

  const rawItems =
    body.items as
      OrderItemInput[];

  const quantityByProduct =
    new Map<
      string,
      number
    >();

  for (
    const item of rawItems
  ) {
    if (
      !item ||
      typeof item !==
        "object" ||
      typeof item.productId !==
        "string" ||
      !Types.ObjectId.isValid(
        item.productId
      )
    ) {
      return {
        success: false,

        message:
          "One or more products are invalid.",
      };
    }

    const quantity =
      Number(
        item.quantity
      );

    if (
      !Number.isInteger(
        quantity
      ) ||
      quantity < 1 ||
      quantity >
        MAX_QUANTITY
    ) {
      return {
        success: false,

        message:
          "Product quantity must be between 1 and 20.",
      };
    }

    const current =
      quantityByProduct.get(
        item.productId
      ) ?? 0;

    const combined =
      current +
      quantity;

    if (
      combined >
      MAX_QUANTITY
    ) {
      return {
        success: false,

        message:
          "Maximum quantity per product is 20.",
      };
    }

    quantityByProduct.set(
      item.productId,
      combined
    );
  }

  const customerDetails =
    body.customerDetails;

  if (
    !customerDetails ||
    typeof customerDetails !==
      "object"
  ) {
    return {
      success: false,

      message:
        "Customer details are required.",
    };
  }

  const details =
    customerDetails as
      CustomerDetailsInput;

  const fullName =
    normalizeString(
      details.fullName,
      100
    );

  const email =
    normalizeEmail(
      details.email
    );

  const phone =
    normalizeString(
      details.phone,
      30
    );

  if (
    !fullName ||
    !email ||
    !phone
  ) {
    return {
      success: false,

      message:
        "Please provide valid customer details.",
    };
  }

  const deliveryAddress =
    body.deliveryAddress;

  if (
    !deliveryAddress ||
    typeof deliveryAddress !==
      "object"
  ) {
    return {
      success: false,

      message:
        "Delivery address is required.",
    };
  }

  const address =
    deliveryAddress as
      DeliveryAddressInput;

  const emirate =
    normalizeString(
      address.emirate,
      50
    );

  const area =
    normalizeString(
      address.area,
      100
    );

  const addressLine =
    normalizeString(
      address.addressLine,
      200
    );

  const building =
    normalizeOptionalString(
      address.building,
      100
    );

  const apartment =
    normalizeOptionalString(
      address.apartment,
      50
    );

  const notes =
    normalizeOptionalString(
      address.notes,
      500
    );

  if (
    !emirate ||
    !area ||
    !addressLine ||
    building === null ||
    apartment === null ||
    notes === null
  ) {
    return {
      success: false,

      message:
        "Please provide a valid delivery address.",
    };
  }

  if (
    !isAllowedPaymentMethod(
      body.paymentMethod
    )
  ) {
    return {
      success: false,

      message:
        "Invalid payment method.",
    };
  }

  const items =
    Array.from(
      quantityByProduct.entries()
    ).map(
      ([
        productId,
        quantity,
      ]) => ({
        productId,
        quantity,
      })
    );

  return {
    success: true,

    data: {
      items,

      customerDetails: {
        fullName,
        email,
        phone,
      },

      deliveryAddress: {
        emirate,
        area,
        addressLine,
        building,
        apartment,
        notes,
      },

      paymentMethod:
        body.paymentMethod,
    },
  };
}