import crypto from "crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  Types,
} from "mongoose";

import {
  connectDB,
} from "@/lib/mongodb";

import {
  getCurrentCustomer,
} from "@/lib/auth/session";

import {
  checkRateLimit,
  getClientIp,
} from "@/lib/auth/rate-limit";

import {
  sendOrderCreatedEmails,
} from "@/lib/email/order-emails";

import Product from "@/models/Product";
import Order from "@/models/Order";

type OrderItemInput = {
  productId?: unknown;
  quantity?: unknown;
};

type CustomerDetailsInput = {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
};

type DeliveryAddressInput = {
  emirate?: unknown;
  area?: unknown;
  addressLine?: unknown;
  building?: unknown;
  apartment?: unknown;
  notes?: unknown;
};

type CreateOrderBody = {
  items?: unknown;
  customerDetails?: unknown;
  deliveryAddress?: unknown;
  paymentMethod?: unknown;
};

const MAX_PRODUCTS = 10;
const MAX_QUANTITY = 20;

const ORDER_RATE_LIMIT =
  10;

const ORDER_RATE_WINDOW =
  15 * 60 * 1000;

const PAYMENT_METHODS = [
  "card",
  "tabby",
  "tamara",
] as const;

function normalizeString(
  value: unknown,
  maxLength: number
) {
  if (
    typeof value !== "string"
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
    typeof value !== "string"
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
): value is
  (typeof PAYMENT_METHODS)[number] {
  return (
    typeof value === "string" &&
    PAYMENT_METHODS.includes(
      value as
        (typeof PAYMENT_METHODS)[number]
    )
  );
}

function isAllowedOrigin(
  request: NextRequest
) {
  const origin =
    request.headers.get(
      "origin"
    );

  if (!origin) {
    return false;
  }

  const allowedOrigins =
    new Set<string>();

  const siteUrl =
    process.env.NEXT_SITE_URL;

  if (siteUrl) {
    try {
      allowedOrigins.add(
        new URL(
          siteUrl
        ).origin
      );
    } catch {
      return false;
    }
  }

  if (
    process.env.NODE_ENV !==
    "production"
  ) {
    allowedOrigins.add(
      "http://localhost:3000"
    );

    allowedOrigins.add(
      "http://127.0.0.1:3000"
    );
  }

  return allowedOrigins.has(
    origin
  );
}

function createOrderNumber() {
  const date =
    new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");

  const random =
    crypto
      .randomBytes(5)
      .toString("hex")
      .toUpperCase();

  return `VC-${date}-${random}`;
}

function getDuplicateOrderResponse(
  order: {
    _id: {
      toString(): string;
    };

    orderNumber: string;
    subtotal: number;
    deliveryFee: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    createdAt: Date;
  }
) {
  return {
    id:
      order._id.toString(),

    orderNumber:
      order.orderNumber,

    subtotal:
      order.subtotal,

    deliveryFee:
      order.deliveryFee,

    total:
      order.total,

    paymentMethod:
      order.paymentMethod,

    paymentStatus:
      order.paymentStatus,

    status:
      order.status,

    createdAt:
      order.createdAt,
  };
}

export async function POST(
  request: NextRequest
) {
  try {
    if (
      !isAllowedOrigin(
        request
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Request origin is not allowed.",
        },
        {
          status: 403,
        }
      );
    }

    const idempotencyKey =
      request.headers
        .get(
          "idempotency-key"
        )
        ?.trim();

    if (
      !idempotencyKey ||
      idempotencyKey.length >
        100 ||
      !/^[A-Za-z0-9_-]+$/.test(
        idempotencyKey
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A valid idempotency key is required.",
        },
        {
          status: 400,
        }
      );
    }

    const clientIp =
      getClientIp(
        request
      );

    const ipRateLimit =
      await checkRateLimit({
        type:
          "order-create-ip",

        key:
          clientIp,

        limit:
          ORDER_RATE_LIMIT,

        windowMs:
          ORDER_RATE_WINDOW,
      });

    if (
      !ipRateLimit.allowed
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many order attempts. Please try again later.",
        },
        {
          status: 429,

          headers: {
            "Retry-After":
              String(
                ipRateLimit.retryAfter
              ),
          },
        }
      );
    }

    const customer =
      await getCurrentCustomer();

    if (customer) {
      const customerRateLimit =
        await checkRateLimit({
          type:
            "order-create-customer",

          key:
            customer._id.toString(),

          limit:
            ORDER_RATE_LIMIT,

          windowMs:
            ORDER_RATE_WINDOW,
        });

      if (
        !customerRateLimit.allowed
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Too many order attempts. Please try again later.",
          },
          {
            status: 429,

            headers: {
              "Retry-After":
                String(
                  customerRateLimit.retryAfter
                ),
            },
          }
        );
      }
    }

    let body:
      CreateOrderBody;

    try {
      body =
        (await request.json()) as CreateOrderBody;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Array.isArray(
        body.items
      ) ||
      body.items.length < 1 ||
      body.items.length >
        MAX_PRODUCTS
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order must contain between 1 and 10 products.",
        },
        {
          status: 400,
        }
      );
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
        return NextResponse.json(
          {
            success: false,
            message:
              "One or more products are invalid.",
          },
          {
            status: 400,
          }
        );
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
        return NextResponse.json(
          {
            success: false,
            message:
              "Product quantity must be between 1 and 20.",
          },
          {
            status: 400,
          }
        );
      }

      const currentQuantity =
        quantityByProduct.get(
          item.productId
        ) || 0;

      const combinedQuantity =
        currentQuantity +
        quantity;

      if (
        combinedQuantity >
        MAX_QUANTITY
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Maximum quantity per product is 20.",
          },
          {
            status: 400,
          }
        );
      }

      quantityByProduct.set(
        item.productId,
        combinedQuantity
      );
    }

    const customerDetails =
      body.customerDetails;

    if (
      !customerDetails ||
      typeof customerDetails !==
        "object"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer details are required.",
        },
        {
          status: 400,
        }
      );
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
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide valid customer details.",
        },
        {
          status: 400,
        }
      );
    }

    const deliveryAddress =
      body.deliveryAddress;

    if (
      !deliveryAddress ||
      typeof deliveryAddress !==
        "object"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Delivery address is required.",
        },
        {
          status: 400,
        }
      );
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
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a valid delivery address.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !isAllowedPaymentMethod(
        body.paymentMethod
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid payment method.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const checkoutType =
      customer
        ? "customer"
        : "guest";

    const idempotencyScope =
      customer
        ? `customer:${customer._id.toString()}`
        : `guest:${crypto
            .createHash(
              "sha256"
            )
            .update(
              `${clientIp}:${email}`
            )
            .digest(
              "hex"
            )}`;

    const existingOrder =
      await Order.findOne({
        idempotencyScope,
        idempotencyKey,
      }).lean();

    if (existingOrder) {
      return NextResponse.json(
        {
          success: true,
          duplicate: true,

          message:
            "Order already created.",

          order:
            getDuplicateOrderResponse(
              existingOrder
            ),
        },
        {
          status: 200,
        }
      );
    }

    const mergedItems =
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

    const productIds =
      mergedItems.map(
        (item) =>
          new Types.ObjectId(
            item.productId
          )
      );

    const products =
      await Product.find({
        _id: {
          $in: productIds,
        },

        isActive: true,
      }).lean();

    if (
      products.length !==
      mergedItems.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more products are unavailable.",
        },
        {
          status: 400,
        }
      );
    }

    const orderItems = [];

    let subtotal = 0;

    for (
      const item of mergedItems
    ) {
      const product =
        products.find(
          (product) =>
            product._id.toString() ===
            item.productId
        );

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message:
              "One or more products are unavailable.",
          },
          {
            status: 400,
          }
        );
      }

      const unitPrice =
        Number(
          product.price
        );

      if (
        !Number.isFinite(
          unitPrice
        ) ||
        unitPrice < 0
      ) {
        console.error(
          "Invalid product price:",
          product._id
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "Unable to process this order.",
          },
          {
            status: 500,
          }
        );
      }

      const totalPrice =
        unitPrice *
        item.quantity;

      subtotal +=
        totalPrice;

      orderItems.push({
        productId:
          product._id,

        name:
          product.name,

        image:
          product.image,

        quantity:
          item.quantity,

        unitPrice,

        totalPrice,
      });
    }

    const deliveryFee = 0;

    const total =
      subtotal +
      deliveryFee;

    let order;

    try {
      order =
        await Order.create({
          orderNumber:
            createOrderNumber(),

          customerId:
            customer
              ? customer._id
              : null,

          checkoutType,

          idempotencyScope,

          idempotencyKey,

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

          items:
            orderItems,

          subtotal,

          deliveryFee,

          total,

          paymentMethod:
            body.paymentMethod,

          paymentStatus:
            "Pending",

          status:
            "Pending",
        });
    } catch (error) {
      if (
        typeof error ===
          "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        const duplicateOrder =
          await Order.findOne({
            idempotencyScope,
            idempotencyKey,
          }).lean();

        if (
          duplicateOrder
        ) {
          return NextResponse.json(
            {
              success: true,
              duplicate: true,

              message:
                "Order already created.",

              order:
                getDuplicateOrderResponse(
                  duplicateOrder
                ),
            },
            {
              status: 200,
            }
          );
        }
      }

      throw error;
    }

    try {
      await sendOrderCreatedEmails({
        orderNumber:
          order.orderNumber,

        customerDetails: {
          fullName:
            order.customerDetails.fullName,

          email:
            order.customerDetails.email,

          phone:
            order.customerDetails.phone,
        },

        deliveryAddress: {
          emirate:
            order.deliveryAddress.emirate,

          area:
            order.deliveryAddress.area,

          addressLine:
            order.deliveryAddress.addressLine,

          building:
            order.deliveryAddress.building,

          apartment:
            order.deliveryAddress.apartment,

          notes:
            order.deliveryAddress.notes,
        },

        items:
          order.items.map(
            (item) => ({
              name:
                item.name,

              quantity:
                item.quantity,

              unitPrice:
                item.unitPrice,

              totalPrice:
                item.totalPrice,
            })
          ),

        subtotal:
          order.subtotal,

        deliveryFee:
          order.deliveryFee,

        total:
          order.total,

        paymentMethod:
          order.paymentMethod,

        paymentStatus:
          order.paymentStatus,

        status:
          order.status,
      });
    } catch (emailError) {
      console.error(
        "Order email error:",
        emailError
      );
    }

    return NextResponse.json(
      {
        success: true,

        message:
          "Order created successfully.",

        order: {
          id:
            order._id.toString(),

          orderNumber:
            order.orderNumber,

          checkoutType:
            order.checkoutType,

          subtotal:
            order.subtotal,

          deliveryFee:
            order.deliveryFee,

          total:
            order.total,

          paymentMethod:
            order.paymentMethod,

          paymentStatus:
            order.paymentStatus,

          status:
            order.status,

          createdAt:
            order.createdAt,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to create order.",
      },
      {
        status: 500,
      }
    );
  }
}