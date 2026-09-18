import {
  NextRequest,
  NextResponse,
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

import CustomerAddress from "@/models/CustomerAddress";

const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

const ADDRESS_LABELS = [
  "Home",
  "Office",
  "Other",
] as const;

type Context = {
  params: Promise<{
    id: string;
  }>;
};

function text(
  value: unknown
) {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function validLabel(
  value: string
): value is
  (typeof ADDRESS_LABELS)[number] {
  return ADDRESS_LABELS.includes(
    value as
      (typeof ADDRESS_LABELS)[number]
  );
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

export async function PATCH(
  request: NextRequest,
  context: Context
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
      id,
    } = await context.params;

    if (
      !Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Address not found.",
        },
        {
          status: 404,
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

    await connectDB();

    if (
      data.action ===
      "set-default"
    ) {
      const exists =
        await CustomerAddress.exists(
          {
            _id: id,

            customerId:
              customer._id,
          }
        );

      if (!exists) {
        return NextResponse.json(
          {
            success: false,

            message:
              "Address not found.",
          },
          {
            status: 404,
          }
        );
      }

      await CustomerAddress.updateMany(
        {
          customerId:
            customer._id,
        },
        {
          $set: {
            isDefault:
              false,
          },
        }
      );

      const address =
        await CustomerAddress.findOneAndUpdate(
          {
            _id: id,

            customerId:
              customer._id,
          },
          {
            $set: {
              isDefault:
                true,
            },
          },
          {
            returnDocument:
              "after",
          }
        );

      return NextResponse.json(
        {
          success: true,

          message:
            "Default address updated.",

          address,
        },
        {
          headers: {
            "Cache-Control":
              "private, no-store",
          },
        }
      );
    }

    const label =
      text(data.label);

    const emirate =
      text(data.emirate);

    const area =
      text(data.area);

    const addressLine =
      text(
        data.addressLine
      );

    const building =
      text(data.building);

    const apartment =
      text(data.apartment);

    const notes =
      text(data.notes);

    if (
      !validLabel(
        label
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Select a valid address label.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !EMIRATES.includes(
        emirate
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Select a valid emirate.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !area ||
      area.length > 100
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Enter a valid area.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !addressLine ||
      addressLine.length >
        200
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Enter a valid address.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      building.length >
        100 ||
      apartment.length >
        50 ||
      notes.length > 500
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "One or more address fields are too long.",
        },
        {
          status: 400,
        }
      );
    }

    const address =
      await CustomerAddress.findOneAndUpdate(
        {
          _id: id,

          customerId:
            customer._id,
        },
        {
          $set: {
            label,
            emirate,
            area,
            addressLine,

            building:
              building ||
              undefined,

            apartment:
              apartment ||
              undefined,

            notes:
              notes ||
              undefined,
          },
        },
        {
          returnDocument:
            "after",

          runValidators: true,
        }
      );

    if (!address) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Address not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,

        message:
          "Address updated successfully.",
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
      "Address PATCH error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to update address.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: Context
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
      id,
    } = await context.params;

    if (
      !Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Address not found.",
        },
        {
          status: 404,
        }
      );
    }

    await connectDB();

    const address =
      await CustomerAddress.findOneAndDelete(
        {
          _id: id,

          customerId:
            customer._id,
        }
      );

    if (!address) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Address not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      address.isDefault
    ) {
      const nextAddress =
        await CustomerAddress.findOne(
          {
            customerId:
              customer._id,
          }
        ).sort({
          createdAt: -1,
        });

      if (nextAddress) {
        nextAddress.isDefault =
          true;

        await nextAddress.save();
      }
    }

    return NextResponse.json({
      success: true,

      message:
        "Address deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Address DELETE error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to delete address.",
      },
      {
        status: 500,
      }
    );
  }
}