import {
  connectDB,
} from "@/lib/mongodb";

import {
  getCurrentCustomer,
} from "@/lib/auth/session";

import Order from "@/models/Order";

export async function getCustomerOrders() {
  const customer =
    await getCurrentCustomer();

  if (!customer) {
    return {
      success: false as const,
      status: 401,
      message:
        "Authentication required.",
    };
  }

  await connectDB();

  const orders =
    await Order.find({
      customerId:
        customer._id,
    })
      .select(
        [
          "orderNumber",
          "items",
          "subtotal",
          "deliveryFee",
          "total",
          "paymentMethod",
          "paymentStatus",
          "status",
          "createdAt",
        ].join(" ")
      )
      .sort({
        createdAt: -1,
      })
      .lean();

  return {
    success: true as const,

    orders:
      orders.map(
        (order) => ({
          orderNumber:
            order.orderNumber,

          items:
            order.items.map(
              (item: import("@/models/Order").OrderItem) => ({
                name:
                  item.name,

                image:
                  item.image,

                quantity:
                  item.quantity,

                unitPrice:
                  item.unitPrice,

                totalPrice:
                  item.totalPrice,
              })
            ),

          itemCount:
            order.items.reduce(
              (
                total: number,
                item: import("@/models/Order").OrderItem
              ) =>
                total +
                item.quantity,
              0
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

          createdAt:
            order.createdAt,
        })
      ),
  };
}
