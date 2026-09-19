import {
  NextResponse,
} from "next/server";

import Stripe from "stripe";

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
  sendCustomerOrderConfirmedEmail,
  sendOwnerOrderConfirmedEmail,
} from "@/lib/email/order-emails";

import Order from "@/models/Order";

export const runtime =
  "nodejs";

const EMAIL_CLAIM_TIMEOUT_MS =
  10 * 60 * 1000;

type ConfirmationRecipient =
  | "customer"
  | "owner";

function expectedStripeAmount(
  total: number
) {
  if (
    !Number.isFinite(total) ||
    total <= 0
  ) {
    return null;
  }

  const amount =
    Math.round(
      total * 100
    );

  if (
    !Number.isSafeInteger(
      amount
    ) ||
    amount <= 0
  ) {
    return null;
  }

  return amount;
}

async function claimConfirmationEmail(
  orderId: Types.ObjectId,
  recipient:
    ConfirmationRecipient
) {
  const now =
    new Date();

  const staleClaimBefore =
    new Date(
      now.getTime() -
        EMAIL_CLAIM_TIMEOUT_MS
    );

  if (
    recipient ===
    "customer"
  ) {
    return await Order.findOneAndUpdate(
      {
        _id:
          orderId,

        paymentStatus:
          "Paid",

        status: {
          $ne:
            "Cancelled",
        },

        $and: [
          {
            $or: [
              {
                customerConfirmationEmailSentAt:
                  null,
              },
              {
                customerConfirmationEmailSentAt: {
                  $exists:
                    false,
                },
              },
            ],
          },
          {
            $or: [
              {
                customerConfirmationEmailClaimedAt:
                  null,
              },
              {
                customerConfirmationEmailClaimedAt: {
                  $exists:
                    false,
                },
              },
              {
                customerConfirmationEmailClaimedAt: {
                  $lt:
                    staleClaimBefore,
                },
              },
            ],
          },
        ],
      },
      {
        $set: {
          customerConfirmationEmailClaimedAt:
            now,
        },
      },
      {
        returnDocument:
          "after",
      }
    );
  }

  return await Order.findOneAndUpdate(
    {
      _id:
        orderId,

      paymentStatus:
        "Paid",

      status: {
        $ne:
          "Cancelled",
      },

      $and: [
        {
          $or: [
            {
              ownerConfirmationEmailSentAt:
                null,
            },
            {
              ownerConfirmationEmailSentAt: {
                $exists:
                  false,
              },
            },
          ],
        },
        {
          $or: [
            {
              ownerConfirmationEmailClaimedAt:
                null,
            },
            {
              ownerConfirmationEmailClaimedAt: {
                $exists:
                  false,
              },
            },
            {
              ownerConfirmationEmailClaimedAt: {
                $lt:
                  staleClaimBefore,
              },
            },
          ],
        },
      ],
    },
    {
      $set: {
        ownerConfirmationEmailClaimedAt:
          now,
      },
    },
    {
      returnDocument:
        "after",
    }
  );
}

async function markConfirmationEmailSent(
  orderId: Types.ObjectId,
  recipient:
    ConfirmationRecipient,
  claimedAt: Date
) {
  if (
    recipient ===
    "customer"
  ) {
    await Order.updateOne(
      {
        _id:
          orderId,

        customerConfirmationEmailSentAt: {
          $in: [
            null,
          ],
        },

        customerConfirmationEmailClaimedAt:
          claimedAt,
      },
      {
        $set: {
          customerConfirmationEmailSentAt:
            new Date(),
        },

        $unset: {
          customerConfirmationEmailClaimedAt:
            1,
        },
      }
    );

    return;
  }

  await Order.updateOne(
    {
      _id:
        orderId,

      ownerConfirmationEmailSentAt: {
        $in: [
          null,
        ],
      },

      ownerConfirmationEmailClaimedAt:
        claimedAt,
    },
    {
      $set: {
        ownerConfirmationEmailSentAt:
          new Date(),
      },

      $unset: {
        ownerConfirmationEmailClaimedAt:
          1,
      },
    }
  );
}

async function releaseConfirmationEmailClaim(
  orderId: Types.ObjectId,
  recipient:
    ConfirmationRecipient,
  claimedAt: Date
) {
  if (
    recipient ===
    "customer"
  ) {
    await Order.updateOne(
      {
        _id:
          orderId,

        customerConfirmationEmailSentAt: {
          $in: [
            null,
          ],
        },

        customerConfirmationEmailClaimedAt:
          claimedAt,
      },
      {
        $unset: {
          customerConfirmationEmailClaimedAt:
            1,
        },
      }
    );

    return;
  }

  await Order.updateOne(
    {
      _id:
        orderId,

      ownerConfirmationEmailSentAt: {
        $in: [
          null,
        ],
      },

      ownerConfirmationEmailClaimedAt:
        claimedAt,
    },
    {
      $unset: {
        ownerConfirmationEmailClaimedAt:
          1,
      },
    }
  );
}

async function sendCustomerConfirmationIfNeeded(
  orderId: Types.ObjectId
) {
  const order =
    await claimConfirmationEmail(
      orderId,
      "customer"
    );

  if (!order) {
    return true;
  }

  const claimedAt =
    order
      .customerConfirmationEmailClaimedAt;

  if (!claimedAt) {
    return false;
  }

  try {
    await sendCustomerOrderConfirmedEmail(
      order
    );

    await markConfirmationEmailSent(
      order._id,
      "customer",
      claimedAt
    );

    return true;
  } catch (error) {
    console.error(
      "Customer confirmation email failed:",
      {
        orderId:
          order._id.toString(),

        orderNumber:
          order.orderNumber,

        error,
      }
    );

    try {
      await releaseConfirmationEmailClaim(
        order._id,
        "customer",
        claimedAt
      );
    } catch (
      releaseError
    ) {
      console.error(
        "Failed to release customer email claim:",
        {
          orderId:
            order._id.toString(),

          error:
            releaseError,
        }
      );
    }

    return false;
  }
}

async function sendOwnerConfirmationIfNeeded(
  orderId: Types.ObjectId
) {
  const order =
    await claimConfirmationEmail(
      orderId,
      "owner"
    );

  if (!order) {
    return true;
  }

  const claimedAt =
    order
      .ownerConfirmationEmailClaimedAt;

  if (!claimedAt) {
    return false;
  }

  try {
    await sendOwnerOrderConfirmedEmail(
      order
    );

    await markConfirmationEmailSent(
      order._id,
      "owner",
      claimedAt
    );

    return true;
  } catch (error) {
    console.error(
      "Owner confirmation email failed:",
      {
        orderId:
          order._id.toString(),

        orderNumber:
          order.orderNumber,

        error,
      }
    );

    try {
      await releaseConfirmationEmailClaim(
        order._id,
        "owner",
        claimedAt
      );
    } catch (
      releaseError
    ) {
      console.error(
        "Failed to release owner email claim:",
        {
          orderId:
            order._id.toString(),

          error:
            releaseError,
        }
      );
    }

    return false;
  }
}

async function sendConfirmationEmails(
  orderId: Types.ObjectId
) {
  const [
    customerSent,
    ownerSent,
  ] =
    await Promise.all([
      sendCustomerConfirmationIfNeeded(
        orderId
      ),

      sendOwnerConfirmationIfNeeded(
        orderId
      ),
    ]);

  if (
    !customerSent ||
    !ownerSent
  ) {
    throw new Error(
      "One or more confirmation emails failed."
    );
  }
}

async function handlePaymentSucceeded(
  paymentIntent:
    Stripe.PaymentIntent
) {
  const orderId =
    paymentIntent.metadata
      .orderId;

  if (
    !orderId ||
    !Types.ObjectId.isValid(
      orderId
    )
  ) {
    console.error(
      "Stripe payment succeeded without a valid orderId.",
      paymentIntent.id
    );

    return;
  }

  const order =
    await Order.findOne({
      _id:
        orderId,

      paymentReference:
        paymentIntent.id,
    });

  if (!order) {
    console.error(
      "Stripe payment does not match an order.",
      {
        paymentIntentId:
          paymentIntent.id,

        orderId,
      }
    );

    return;
  }

  const expectedAmount =
    expectedStripeAmount(
      order.total
    );

  if (
    expectedAmount ===
    null
  ) {
    console.error(
      "Order has an invalid total.",
      {
        orderId:
          order._id.toString(),

        total:
          order.total,
      }
    );

    return;
  }

  if (
    paymentIntent.currency
      .toLowerCase() !==
    "aed"
  ) {
    console.error(
      "Stripe payment currency mismatch.",
      {
        orderId:
          order._id.toString(),

        paymentIntentId:
          paymentIntent.id,

        expectedCurrency:
          "aed",

        receivedCurrency:
          paymentIntent.currency,
      }
    );

    return;
  }

  if (
    paymentIntent.amount !==
    expectedAmount
  ) {
    console.error(
      "Stripe payment amount mismatch.",
      {
        orderId:
          order._id.toString(),

        paymentIntentId:
          paymentIntent.id,

        expectedAmount,

        receivedAmount:
          paymentIntent.amount,
      }
    );

    return;
  }

  if (
    order.status ===
    "Cancelled"
  ) {
    console.error(
      "Payment succeeded for a cancelled order.",
      {
        orderId:
          order._id.toString(),

        paymentIntentId:
          paymentIntent.id,
      }
    );

    return;
  }

  if (
    order.paymentStatus !==
    "Paid"
  ) {
    const updatedOrder =
      await Order.findOneAndUpdate(
        {
          _id:
            order._id,

          paymentReference:
            paymentIntent.id,

          paymentStatus: {
            $ne:
              "Paid",
          },

          status: {
            $ne:
              "Cancelled",
          },
        },
        {
          $set: {
            paymentStatus:
              "Paid",

            status:
              "Confirmed",
          },
        },
        {
          returnDocument:
            "after",
        }
      );

    if (!updatedOrder) {
      return;
    }
  }

  await sendConfirmationEmails(
    order._id
  );
}

async function handlePaymentFailed(
  paymentIntent:
    Stripe.PaymentIntent
) {
  const orderId =
    paymentIntent.metadata
      .orderId;

  if (
    !orderId ||
    !Types.ObjectId.isValid(
      orderId
    )
  ) {
    return;
  }

  await Order.findOneAndUpdate(
    {
      _id:
        orderId,

      paymentReference:
        paymentIntent.id,

      paymentStatus: {
        $ne:
          "Paid",
      },

      status: {
        $ne:
          "Cancelled",
      },
    },
    {
      $set: {
        paymentStatus:
          "Failed",
      },
    }
  );
}

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
        received:
          false,
      },
      {
        status:
          500,
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
        received:
          false,
      },
      {
        status:
          400,
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
        received:
          false,
      },
      {
        status:
          400,
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

        await handlePaymentSucceeded(
          paymentIntent
        );

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent =
          event.data
            .object as Stripe.PaymentIntent;

        await handlePaymentFailed(
          paymentIntent
        );

        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent =
          event.data
            .object as Stripe.PaymentIntent;

        await handlePaymentFailed(
          paymentIntent
        );

        break;
      }

      default:
        break;
    }

    return NextResponse.json({
      received:
        true,
    });
  } catch (error) {
    console.error(
      "Stripe webhook processing error:",
      error
    );

    return NextResponse.json(
      {
        received:
          false,
      },
      {
        status:
          500,
      }
    );
  }
}