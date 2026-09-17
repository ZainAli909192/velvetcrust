import {
  NextResponse,
} from "next/server";

import {
  connectDB,
} from "@/lib/mongodb";

import {
  getCurrentCustomer,
} from "@/lib/auth/session";

import Order from "@/models/Order";

type RouteContext = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const customer =
      await getCurrentCustomer();

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Authentication required.",
        },
        {
          status: 401,
          headers: {
            "Cache-Control":
              "private, no-store",
          },
        }
      );
    }

    const {
      orderNumber:
        rawOrderNumber,
    } = await context.params;

    const orderNumber =
      decodeURIComponent(
        rawOrderNumber
      ).trim();

    if (
      !orderNumber ||
      orderNumber.length > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order not found.",
        },
        {
          status: 404,
          headers: {
            "Cache-Control":
              "private, no-store",
          },
        }
      );
    }

    await connectDB();

    const order =
      await Order.findOne({
        orderNumber,

        customerId:
          customer._id,

        checkoutType:
          "customer",
      })
        .select(
          [
            "orderNumber",
            "items",
            "deliveryAddress",
            "subtotal",
            "deliveryFee",
            "total",
            "paymentMethod",
            "paymentStatus",
            "status",
            "cancelledAt",
            "deliveredAt",
            "createdAt",
          ].join(" ")
        )
        .lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order not found.",
        },
        {
          status: 404,
          headers: {
            "Cache-Control":
              "private, no-store",
          },
        }
      );
    }

    const itemCount =
      Array.isArray(
        order.items
      )
        ? order.items.reduce(
            (
              total: number,
              item: import("@/models/Order").OrderItem
            ) =>
              total +
              Number(
                item.quantity ??
                  0
              ),
            0
          )
        : 0;

    return NextResponse.json(
      {
        success: true,

        order: {
          orderNumber:
            order.orderNumber,

          items:
            order.items ?? [],

          itemCount,

          // Current customer profile
          customerDetails: {
            fullName:
              customer.name,

            email:
              customer.email,

            phone:
              customer.phone ??
              "",
          },

          // Keep original order delivery address
          deliveryAddress:
            order.deliveryAddress,

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

          cancelledAt:
            order.cancelledAt,

          deliveredAt:
            order.deliveredAt,

          createdAt:
            order.createdAt,
        },
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Get order error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load order.",
      },
      {
        status: 500,

        headers: {
          "Cache-Control":
            "private, no-store",
        },
      }
    );
  }
}
