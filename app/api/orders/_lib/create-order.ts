import crypto from "crypto";

import {
  NextRequest,
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

import {
  type ValidatedOrderInput,
} from "./order-validation";

const ORDER_RATE_LIMIT =
  10;

const ORDER_RATE_WINDOW =
  15 * 60 * 1000;

type CreateOrderResult =
  | {
      success: true;
      duplicate: boolean;
      status: number;
      order: ReturnType<
        typeof orderResponse
      >;
    }
  | {
      success: false;
      status: number;
      message: string;
      retryAfter?: number;
    };

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

function orderResponse(
  order: {
    _id: {
      toString(): string;
    };

    orderNumber: string;
    checkoutType?: string;
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
  };
}

export async function createOrder({
  request,
  input,
  idempotencyKey,
}: {
  request: NextRequest;

  input:
    ValidatedOrderInput;

  idempotencyKey: string;
}): Promise<CreateOrderResult> {
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
    return {
      success: false,
      status: 429,

      message:
        "Too many order attempts. Please try again later.",

      retryAfter:
        ipRateLimit.retryAfter,
    };
  }

  const customer =
    await getCurrentCustomer();

  if (customer) {
    const customerLimit =
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
      !customerLimit.allowed
    ) {
      return {
        success: false,
        status: 429,

        message:
          "Too many order attempts. Please try again later.",

        retryAfter:
          customerLimit.retryAfter,
      };
    }
  }

  await connectDB();

  const {
    items,
    customerDetails,
    deliveryAddress,
    paymentMethod,
  } = input;

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
            `${clientIp}:${customerDetails.email}`
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
    return {
      success: true,
      duplicate: true,
      status: 200,

      order:
        orderResponse(
          existingOrder
        ),
    };
  }

  const productIds =
    items.map(
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
    items.length
  ) {
    return {
      success: false,
      status: 400,

      message:
        "One or more products are unavailable.",
    };
  }

  const orderItems = [];

  let subtotal = 0;

  for (
    const item of items
  ) {
    const product =
      products.find(
        (product) =>
          product._id.toString() ===
          item.productId
      );

    if (!product) {
      return {
        success: false,
        status: 400,

        message:
          "One or more products are unavailable.",
      };
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

      return {
        success: false,
        status: 500,

        message:
          "Unable to process this order.",
      };
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

        customerDetails,

        deliveryAddress,

        items:
          orderItems,

        subtotal,
        deliveryFee,
        total,

        paymentMethod,

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
        return {
          success: true,
          duplicate: true,
          status: 200,

          order:
            orderResponse(
              duplicateOrder
            ),
        };
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
  } catch (error) {
    console.error(
      "Order email error:",
      error
    );
  }

  return {
    success: true,
    duplicate: false,
    status: 201,

    order:
      orderResponse(
        order
      ),
  };
}