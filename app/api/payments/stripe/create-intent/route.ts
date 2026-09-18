import crypto from "crypto";

import {
  NextResponse,
} from "next/server";

import {
  Types,
} from "mongoose";

import {
  connectDB,
} from "@/lib/mongodb";

import {
  stripe,
} from "@/lib/stripe";

import {
  getCurrentCustomer,
} from "@/lib/auth/session";

import Order from "@/models/Order";

const STRIPE_METHODS = [
  "card",
  "apple_pay",
  "google_pay",
] as const;

function isAllowedOrigin(
  request: Request
) {
  const origin =
    request.headers.get(
      "origin"
    );

  if (!origin) {
    return false;
  }

  if (
    origin ===
    new URL(request.url).origin
  ) {
    return true;
  }

  const siteUrl =
    process.env.NEXT_SITE_URL;

  if (siteUrl) {
    try {
      const allowedOrigin =
        new URL(
          siteUrl
        ).origin;

      if (
        origin ===
        allowedOrigin
      ) {
        return true;
      }
    } catch {
      return false;
    }
  }

  if (
    process.env.NODE_ENV !==
    "production"
  ) {
    try {
      const url =
        new URL(
          origin
        );

      return (
        url.hostname ===
          "localhost" ||
        url.hostname ===
          "127.0.0.1"
      );
    } catch {
      return false;
    }
  }

  return false;
}

function hashGuestAccessToken(
  token: string
) {
  return crypto
    .createHash(
      "sha256"
    )
    .update(token)
    .digest();
}

function verifyGuestAccessToken(
  providedToken: string,
  storedHash: string
) {
  try {
    const providedHash =
      hashGuestAccessToken(
        providedToken
      );

    const storedBuffer =
      Buffer.from(
        storedHash,
        "hex"
      );

    if (
      providedHash.length !==
      storedBuffer.length
    ) {
      return false;
    }

    return crypto.timingSafeEqual(
      providedHash,
      storedBuffer
    );
  } catch {
    return false;
  }
}

function toFils(
  amount: number
) {
  return Math.round(
    amount * 100
  );
}

export async function POST(
  request: Request
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
            "Request not allowed.",
        },
        {
          status: 403,
        }
      );
    }

    let body: {
      orderId?: unknown;
      guestAccessToken?: unknown;
    };

    try {
      body =
        (await request.json()) as {
          orderId?: unknown;
          guestAccessToken?: unknown;
        };
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
      typeof body.orderId !==
        "string" ||
      !Types.ObjectId.isValid(
        body.orderId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid order.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const order =
      await Order.findById(
        body.orderId
      ).select(
        "+guestAccessTokenHash"
      );

    if (!order) {
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
      !STRIPE_METHODS.includes(
        order.paymentMethod
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

    if (
      order.status ===
      "Cancelled"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This order has been cancelled.",
        },
        {
          status: 409,
        }
      );
    }

    if (
      order.paymentStatus ===
      "Paid"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This order has already been paid.",
        },
        {
          status: 409,
        }
      );
    }

    if (
      order.checkoutType ===
      "customer"
    ) {
      const customer =
        await getCurrentCustomer();

      if (
        !customer ||
        !order.customerId ||
        order.customerId.toString() !==
          customer._id.toString()
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
    } else if (
      order.checkoutType ===
      "guest"
    ) {
      if (
        typeof body.guestAccessToken !==
          "string" ||
        body.guestAccessToken.length <
          32 ||
        body.guestAccessToken.length >
          200 ||
        typeof order.guestAccessTokenHash !==
          "string" ||
        !verifyGuestAccessToken(
          body.guestAccessToken,
          order.guestAccessTokenHash
        )
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
    } else {
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

    const total =
      Number(
        order.total
      );

    if (
      !Number.isFinite(
        total
      ) ||
      total <= 0
    ) {
      console.error(
        "Invalid Stripe order total:",
        order._id
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to initialize payment.",
        },
        {
          status: 500,
        }
      );
    }

    const amount =
      toFils(
        total
      );

    if (
      !Number.isSafeInteger(
        amount
      ) ||
      amount <= 0
    ) {
      console.error(
        "Invalid Stripe amount:",
        order._id
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to initialize payment.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      order.paymentReference
    ) {
      try {
        const existingIntent =
          await stripe
            .paymentIntents
            .retrieve(
              order.paymentReference
            );

        const belongsToOrder =
          existingIntent
            .metadata
            .orderId ===
          order._id.toString();

        const amountMatches =
          existingIntent.amount ===
          amount;

        const currencyMatches =
          existingIntent.currency ===
          "aed";

        const reusable =
          existingIntent.status !==
            "canceled" &&
          existingIntent.status !==
            "succeeded" &&
          Boolean(
            existingIntent.client_secret
          );

        if (
          belongsToOrder &&
          amountMatches &&
          currencyMatches &&
          reusable
        ) {
          return NextResponse.json(
            {
              success: true,

              clientSecret:
                existingIntent.client_secret,

              paymentIntentId:
                existingIntent.id,
            },
            {
              headers: {
                "Cache-Control":
                  "no-store",
              },
            }
          );
        }

        if (
          existingIntent.status ===
          "succeeded"
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "This payment has already been completed.",
            },
            {
              status: 409,
            }
          );
        }

        if (
          !belongsToOrder ||
          !amountMatches ||
          !currencyMatches
        ) {
          console.error(
            "Stripe PaymentIntent does not match order:",
            order._id
          );

          return NextResponse.json(
            {
              success: false,
              message:
                "Unable to verify this order's payment. Please contact support.",
            },
            {
              status: 409,
            }
          );
        }
      } catch (error) {
        console.error(
          "Stripe PaymentIntent retrieval error:",
          error
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "Unable to verify the existing payment. Please try again shortly.",
          },
          {
            status: 503,
          }
        );
      }
    }

    const paymentIntent =
      await stripe
        .paymentIntents
        .create(
          {
            amount,

            currency:
              "aed",

            // Apple Pay and Google Pay are card wallets. Do not offer
            // unrelated redirect methods through the card-only UI.
            payment_method_types: [
              "card",
            ],

            receipt_email:
              order
                .customerDetails
                .email,

            metadata: {
              orderId:
                order._id.toString(),

              orderNumber:
                order.orderNumber,

              checkoutType:
                order.checkoutType,
            },
          },
          {
            idempotencyKey:
              `vc-payment-${order._id.toString()}-${order.paymentReference || "initial"}`,
          }
        );

    if (
      !paymentIntent.client_secret
    ) {
      console.error(
        "Stripe PaymentIntent missing client secret:",
        paymentIntent.id
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to initialize payment.",
        },
        {
          status: 500,
        }
      );
    }

    order.paymentReference =
      paymentIntent.id;

    await order.save();

    return NextResponse.json(
      {
        success: true,

        clientSecret:
          paymentIntent.client_secret,

        paymentIntentId:
          paymentIntent.id,
      },
      {
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Stripe create intent error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to initialize payment.",
      },
      {
        status: 500,
      }
    );
  }
}
