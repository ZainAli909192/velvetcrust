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

export async function GET() {
  try {
    const customer =
      await getCurrentCustomer();

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          addresses: [],
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const addresses =
      await CustomerAddress.find(
        {
          customerId:
            customer._id,
        }
      )
        .sort({
          isDefault: -1,
          createdAt: -1,
        })
        .lean();

    return NextResponse.json(
      {
        success: true,

        addresses:
          addresses.map(
            (address) => ({
              id:
                address._id.toString(),

              label:
                address.label,

              emirate:
                address.emirate,

              area:
                address.area,

              addressLine:
                address.addressLine,

              building:
                address.building ??
                "",

              apartment:
                address.apartment ??
                "",

              notes:
                address.notes ??
                "",

              isDefault:
                address.isDefault,
            })
          ),
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
      "Addresses GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        addresses: [],

        message:
          "Unable to load addresses.",
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

    const requestedDefault =
      data.isDefault ===
      true;

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

    await connectDB();

    const addressCount =
      await CustomerAddress.countDocuments(
        {
          customerId:
            customer._id,
        }
      );

    if (
      addressCount >= 10
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "You can save up to 10 addresses.",
        },
        {
          status: 400,
        }
      );
    }

    const isDefault =
      addressCount === 0 ||
      requestedDefault;

    if (isDefault) {
      await CustomerAddress.updateMany(
        {
          customerId:
            customer._id,

          isDefault: true,
        },
        {
          $set: {
            isDefault:
              false,
          },
        }
      );
    }

    const address =
      await CustomerAddress.create(
        {
          customerId:
            customer._id,

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

          isDefault,
        }
      );

    return NextResponse.json(
      {
        success: true,

        message:
          "Address saved successfully.",

        address: {
          id:
            address._id.toString(),

          label:
            address.label,

          emirate:
            address.emirate,

          area:
            address.area,

          addressLine:
            address.addressLine,

          building:
            address.building ??
            "",

          apartment:
            address.apartment ??
            "",

          notes:
            address.notes ??
            "",

          isDefault:
            address.isDefault,
        },
      },
      {
        status: 201,

        headers: {
          "Cache-Control":
            "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Address POST error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to save address.",
      },
      {
        status: 500,
      }
    );
  }
}