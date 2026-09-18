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

import Customer from "@/models/Customer";

function normalizeString(
  value: unknown
) {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function allowedOrigin(
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

export async function GET() {
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
        }
      );
    }

    return NextResponse.json(
      {
        success: true,

        customer: {
          id:
            customer._id.toString(),

          name:
            customer.name,

          email:
            customer.email,

          phone:
            customer.phone ??
            "",
        },
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
      "Profile GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load profile.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: NextRequest
) {
  try {
    if (
      !allowedOrigin(
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

    const name =
      normalizeString(
        data.name
      );

    const phone =
      normalizeString(
        data.phone
      );

    if (
      name.length < 2 ||
      name.length > 80
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name must be between 2 and 80 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      phone.length > 20
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Phone number is too long.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const customer =
      await Customer.findByIdAndUpdate(
        currentCustomer._id,
        {
          $set: {
            name,

            ...(phone
              ? {
                  phone,
                }
              : {}),

            ...(!phone
              ? {
                  $unset:
                    undefined,
                }
              : {}),
          },
        },
        {
          returnDocument:
            "after",
          runValidators: true,
        }
      );

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (!phone) {
      customer.phone =
        undefined;

      await customer.save();
    }

    return NextResponse.json({
      success: true,

      message:
        "Profile updated successfully.",

      customer: {
        id:
          customer._id.toString(),

        name:
          customer.name,

        email:
          customer.email,

        phone:
          customer.phone ??
          null,
      },
    });
  } catch (error) {
    console.error(
      "Profile PATCH error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update profile.",
      },
      {
        status: 500,
      }
    );
  }
}