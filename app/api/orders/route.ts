import {
  NextRequest,
  NextResponse,
} from "next/server";
import {
  getCustomerOrders,
} from "./_lib/get-customer-orders";

import {
  createOrder,
} from "./_lib/create-order";

import {
  type CreateOrderBody,
  validateOrderInput,
} from "./_lib/order-validation";

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
export async function GET() {
  try {
    const result =
      await getCustomerOrders();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            result.message,
        },
        {
          status:
            result.status,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        orders:
          result.orders,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Get customer orders error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load orders.",
      },
      {
        status: 500,
      }
    );
  }
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

    const validation =
      validateOrderInput(
        body
      );

    if (
      !validation.success
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            validation.message,
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await createOrder({
        request,

        input:
          validation.data,

        idempotencyKey,
      });

    if (
      !result.success
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            result.message,
        },
        {
          status:
            result.status,

          headers:
            result.retryAfter
              ? {
                  "Retry-After":
                    String(
                      result.retryAfter
                    ),
                }
              : undefined,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,

        duplicate:
          result.duplicate,

        message:
          result.duplicate
            ? "Order already created."
            : "Order created successfully.",

        order:
          result.order,
      },
      {
        status:
          result.status,
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
