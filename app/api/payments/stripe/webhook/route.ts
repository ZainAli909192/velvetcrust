import {
  NextResponse,
} from "next/server";

import Stripe from "stripe";

import {
  connectDB,
} from "@/lib/mongodb";

import {
  stripe,
} from "@/lib/stripe";

import Order from "@/models/Order";

export const runtime =
  "nodejs";

export async function POST(
  request: Request
) {
  const webhookSecret =
    process.env
      .STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "STRIPE_WEBHOOK_SECRET is not defined."
    );

    return NextResponse.json(
      {
        received: false,
      },
      {
        status: 500,
      }
    );
  }

  const signature =
    request.headers.get(
      "stripe-signature"
    );

  if (!signature) {
    return NextResponse.json(
      {
        received: false,
      },
      {
        status: 400,
      }
    );
  }

  let event:
    Stripe.Event;

  try {
    const rawBody =
      await request.text();

    event =
      stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
  } catch (error) {
    console.error(
      "Stripe webhook verification failed:",
      error
    );

    return NextResponse.json(
      {
        received: false,
      },
      {
        status: 400,
      }
    );
  }

  try {
    await connectDB();

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent =
          event.data
            .object as Stripe.PaymentIntent;

        const orderId =
          paymentIntent.metadata
            .orderId;

        if (!orderId) {
          break;
        }

        await Order.findOneAndUpdate(
          {
            _id: orderId,

            paymentReference:
              paymentIntent.id,

            paymentStatus: {
              $ne: "Paid",
            },

            status: {
              $ne: "Cancelled",
            },
          },
          {
            $set: {
              paymentStatus:
                "Paid",

              status:
                "Confirmed",
            },
          }
        );

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent =
          event.data
            .object as Stripe.PaymentIntent;

        const orderId =
          paymentIntent.metadata
            .orderId;

        if (!orderId) {
          break;
        }

        await Order.findOneAndUpdate(
          {
            _id: orderId,

            paymentReference:
              paymentIntent.id,

            paymentStatus: {
              $ne: "Paid",
            },
          },
          {
            $set: {
              paymentStatus:
                "Failed",
            },
          }
        );

        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent =
          event.data
            .object as Stripe.PaymentIntent;

        const orderId =
          paymentIntent.metadata
            .orderId;

        if (!orderId) {
          break;
        }

        await Order.findOneAndUpdate(
          {
            _id: orderId,

            paymentReference:
              paymentIntent.id,

            paymentStatus: {
              $ne: "Paid",
            },
          },
          {
            $set: {
              paymentStatus:
                "Failed",
            },
          }
        );

        break;
      }

      default:
        break;
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Stripe webhook processing error:",
      error
    );

    return NextResponse.json(
      {
        received: false,
      },
      {
        status: 500,
      }
    );
  }
}