import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    connectDB,
} from "@/lib/mongodb";

import {
    getCurrentCustomer,
} from "@/lib/auth/session";

import {
    sendOrderCancellationEmails,
} from "@/lib/email/order-emails";

import Order from "@/models/Order";

type RouteContext = {
    params: Promise<{
        orderNumber: string;
    }>;
};

export async function PATCH(
    request: NextRequest,
    context: RouteContext
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
                        "Invalid request origin.",
                },
                {
                    status: 403,
                }
            );
        }

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
            orderNumber.length >
            100
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Order not found.",
                },
                {
                    status: 404,
                }
            );
        }

        await connectDB();

        const cancelledAt =
            new Date();

        const updatedOrder =
            await Order.findOneAndUpdate(
                {
                    orderNumber,

                    customerId:
                        customer._id,

                    checkoutType:
                        "customer",

                    status: {
                        $in: [
                            "Pending",
                            "Confirmed",
                        ],
                    },
                },
                {
                    $set: {
                        status:
                            "Cancelled",

                        cancelledAt,
                    },
                },
                {
                    returnDocument:
                        "after",
                }
            )
                .select(
                    [
                        "orderNumber",
                        "customerDetails",
                        "deliveryAddress",
                        "items",
                        "subtotal",
                        "deliveryFee",
                        "total",
                        "paymentMethod",
                        "paymentStatus",
                        "status",
                        "cancelledAt",
                    ].join(" ")
                )
                .lean();

        if (!updatedOrder) {
            const existingOrder =
                await Order.findOne({
                    orderNumber,

                    customerId:
                        customer._id,

                    checkoutType:
                        "customer",
                })
                    .select(
                        "orderNumber status cancelledAt"
                    )
                    .lean();

            if (!existingOrder) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Order not found.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            if (
                existingOrder.status ===
                "Cancelled"
            ) {
                return NextResponse.json(
                    {
                        success: true,

                        message:
                            "Order is already cancelled.",

                        order: {
                            orderNumber:
                                existingOrder.orderNumber,

                            status:
                                existingOrder.status,

                            cancelledAt:
                                existingOrder.cancelledAt,
                        },
                    },
                    {
                        status: 200,
                    }
                );
            }

            console.log(
                "Cancellation blocked. Current status:",
                existingOrder.status
            );

            return NextResponse.json(
                {
                    success: false,

                    message:
                        "This order can no longer be cancelled.",

                    currentStatus:
                        existingOrder.status,
                },
                {
                    status: 409,
                }
            );
        }

        try {
            await sendOrderCancellationEmails(
                {
                    orderNumber:
                        updatedOrder.orderNumber,

                    customerDetails: {
                        fullName:
                            customer.name,

                        email:
                            customer.email,

                        phone:
                            customer.phone ??
                            updatedOrder
                                .customerDetails
                                .phone ??
                            "",
                    },

                    deliveryAddress: {
                        emirate:
                            updatedOrder
                                .deliveryAddress
                                .emirate,

                        area:
                            updatedOrder
                                .deliveryAddress
                                .area,

                        addressLine:
                            updatedOrder
                                .deliveryAddress
                                .addressLine,

                        building:
                            updatedOrder
                                .deliveryAddress
                                .building,

                        apartment:
                            updatedOrder
                                .deliveryAddress
                                .apartment,

                        notes:
                            updatedOrder
                                .deliveryAddress
                                .notes,
                    },

                    items:
                        updatedOrder.items.map(
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
                        updatedOrder.subtotal,

                    deliveryFee:
                        updatedOrder.deliveryFee,

                    total:
                        updatedOrder.total,

                    paymentMethod:
                        updatedOrder.paymentMethod,

                    paymentStatus:
                        updatedOrder.paymentStatus,

                    status:
                        updatedOrder.status,

                    cancelledAt:
                        updatedOrder.cancelledAt,
                }
            );
        } catch (error) {
            console.error(
                "Cancellation email error:",
                error
            );
        }

        return NextResponse.json(
            {
                success: true,

                message:
                    "Order cancelled successfully.",

                order: {
                    orderNumber:
                        updatedOrder.orderNumber,

                    status:
                        updatedOrder.status,

                    cancelledAt:
                        updatedOrder.cancelledAt,
                },
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "Cancel order error:",
            error
        );

        return NextResponse.json(
            {
                success: false,

                message:
                    "Unable to cancel order.",
            },
            {
                status: 500,
            }
        );
    }
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