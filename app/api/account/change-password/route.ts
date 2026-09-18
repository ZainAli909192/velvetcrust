import {
  NextRequest,
  NextResponse,
} from "next/server";

import bcrypt from "bcryptjs";

import {
  connectDB,
} from "@/lib/mongodb";

import {
  getCurrentCustomer,
  rotateCustomerSessions,
} from "@/lib/auth/session";

import {
  checkRateLimit,
  getClientIp,
} from "@/lib/auth/rate-limit";

import Customer from "@/models/Customer";

const RATE_LIMIT_WINDOW =
  15 * 60 * 1000;

function validOrigin(
  request: NextRequest
) {
  const origin =
    request.headers.get(
      "origin"
    );

  if (!origin) {
    return false;
  }

  const allowed =
    new Set<string>();

  const siteUrl =
    process.env.NEXT_SITE_URL;

  if (siteUrl) {
    try {
      allowed.add(
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
    allowed.add(
      "http://localhost:3000"
    );

    allowed.add(
      "http://127.0.0.1:3000"
    );
  }

  return allowed.has(
    origin
  );
}

function rateLimitedResponse(
  retryAfter: number
) {
  return NextResponse.json(
    {
      success: false,

      message:
        "Too many attempts. Please try again later.",
    },
    {
      status: 429,

      headers: {
        "Retry-After":
          String(
            retryAfter
          ),
      },
    }
  );
}

export async function PATCH(
  request: NextRequest
) {
  try {
    if (
      !validOrigin(
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

    const ip =
      getClientIp(
        request
      );

    const ipLimit =
      await checkRateLimit({
        type:
          "password-change-ip",

        key: ip,

        limit: 10,

        windowMs:
          RATE_LIMIT_WINDOW,
      });

    if (!ipLimit.allowed) {
      return rateLimitedResponse(
        ipLimit.retryAfter
      );
    }

    const currentCustomer =
      await getCurrentCustomer();

    if (!currentCustomer) {
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

    const customerId =
      currentCustomer._id.toString();

    const customerLimit =
      await checkRateLimit({
        type:
          "password-change-customer",

        key: customerId,

        limit: 5,

        windowMs:
          RATE_LIMIT_WINDOW,
      });

    if (
      !customerLimit.allowed
    ) {
      return rateLimitedResponse(
        customerLimit.retryAfter
      );
    }

    let body: unknown;

    try {
      body =
        await request.json();
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
      !body ||
      typeof body !==
        "object" ||
      Array.isArray(body)
    ) {
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

    const data =
      body as Record<
        string,
        unknown
      >;

    const currentPassword =
      typeof data.currentPassword ===
      "string"
        ? data.currentPassword
        : "";

    const newPassword =
      typeof data.newPassword ===
      "string"
        ? data.newPassword
        : "";

    if (
      !currentPassword ||
      !newPassword
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Current and new password are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      currentPassword.length >
      128
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Invalid password.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      newPassword.length <
        8 ||
      newPassword.length >
        128
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "New password must be between 8 and 128 characters.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const customer =
      await Customer.findById(
        currentCustomer._id
      ).select(
        "+passwordHash"
      );

    if (
      !customer ||
      !customer.isActive
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Unable to change password.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !customer.passwordHash
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "This account does not currently have a password.",
        },
        {
          status: 400,
        }
      );
    }

    const currentMatches =
      await bcrypt.compare(
        currentPassword,
        customer.passwordHash
      );

    if (!currentMatches) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Current password is incorrect.",
        },
        {
          status: 400,
        }
      );
    }

    const samePassword =
      await bcrypt.compare(
        newPassword,
        customer.passwordHash
      );

    if (samePassword) {
      return NextResponse.json(
        {
          success: false,

          message:
            "New password must be different from your current password.",
        },
        {
          status: 400,
        }
      );
    }

    const passwordHash =
      await bcrypt.hash(
        newPassword,
        12
      );

    customer.passwordHash =
      passwordHash;

    await customer.save();

    await rotateCustomerSessions(
      customer._id.toString()
    );

    return NextResponse.json(
      {
        success: true,

        message:
          "Password changed successfully.",
      },
      {
        headers: {
          "Cache-Control":
            "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to change password.",
      },
      {
        status: 500,
      }
    );
  }
}