import {
  NextRequest,
  NextResponse,
} from "next/server";

const UAE_EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
] as const;

type NominatimAddress = {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  residential?: string;
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  city_district?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  state_district?: string;
  country?: string;
  country_code?: string;
};

type NominatimResponse = {
  display_name?: string;
  address?: NominatimAddress;
  error?: string;
};

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

function normalizeEmirate(
  ...values: Array<
    string | undefined
  >
) {
  const combined =
    values
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  if (
    combined.includes(
      "abu dhabi"
    )
  ) {
    return "Abu Dhabi";
  }

  if (
    combined.includes(
      "dubai"
    )
  ) {
    return "Dubai";
  }

  if (
    combined.includes(
      "sharjah"
    ) ||
    combined.includes(
      "ash shariqah"
    ) ||
    combined.includes(
      "shariqah"
    )
  ) {
    return "Sharjah";
  }

  if (
    combined.includes(
      "ajman"
    )
  ) {
    return "Ajman";
  }

  if (
    combined.includes(
      "umm al quwain"
    ) ||
    combined.includes(
      "umm al qaiwain"
    ) ||
    combined.includes(
      "umm al quwayn"
    )
  ) {
    return "Umm Al Quwain";
  }

  if (
    combined.includes(
      "ras al khaimah"
    ) ||
    combined.includes(
      "ras al khaymah"
    ) ||
    combined.includes(
      "ras al khaima"
    )
  ) {
    return "Ras Al Khaimah";
  }

  if (
    combined.includes(
      "fujairah"
    ) ||
    combined.includes(
      "al fujairah"
    )
  ) {
    return "Fujairah";
  }

  return "";
}

function getArea(
  address: NominatimAddress
) {
  return (
    address.suburb ??
    address.neighbourhood ??
    address.quarter ??
    address.city_district ??
    address.residential ??
    address.municipality ??
    address.city ??
    address.town ??
    address.village ??
    ""
  );
}

function getAddressLine(
  address: NominatimAddress,
  displayName: string
) {
  const street =
    address.road ??
    address.pedestrian ??
    "";

  const streetAddress =
    [
      address.house_number,
      street,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

  if (streetAddress) {
    return streetAddress;
  }

  if (address.residential) {
    return address.residential;
  }

  if (address.neighbourhood) {
    return address.neighbourhood;
  }

  return displayName;
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

    const latitude =
      Number(
        data.latitude
      );

    const longitude =
      Number(
        data.longitude
      );

    if (
      !Number.isFinite(
        latitude
      ) ||
      !Number.isFinite(
        longitude
      ) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid location coordinates.",
        },
        {
          status: 400,
        }
      );
    }

    const url =
      new URL(
        "https://nominatim.openstreetmap.org/reverse"
      );

    url.searchParams.set(
      "format",
      "jsonv2"
    );

    url.searchParams.set(
      "lat",
      String(latitude)
    );

    url.searchParams.set(
      "lon",
      String(longitude)
    );

    url.searchParams.set(
      "addressdetails",
      "1"
    );

    url.searchParams.set(
      "zoom",
      "18"
    );

    url.searchParams.set(
      "accept-language",
      "en"
    );

    const response =
      await fetch(
        url.toString(),
        {
          method: "GET",

          headers: {
            "User-Agent":
              "VelvetCrust/1.0 (https://velvetcrust.ae)",

            Accept:
              "application/json",
          },

          cache:
            "no-store",

          signal:
            AbortSignal.timeout(
              8000
            ),
        }
      );

    if (!response.ok) {
      console.error(
        "Nominatim HTTP error:",
        response.status
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to find an address for this location.",
        },
        {
          status: 502,
        }
      );
    }

    const result =
      (await response.json()) as NominatimResponse;

    if (
      result.error ||
      !result.address
    ) {
      console.error(
        "Nominatim response error:",
        result.error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We couldn't find a delivery address for this location.",
        },
        {
          status: 422,
        }
      );
    }

    const address =
      result.address;

    if (
      address.country_code
        ?.toLowerCase() !==
      "ae"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Velvet Crust currently delivers within the UAE only.",
        },
        {
          status: 400,
        }
      );
    }

    const emirate =
      normalizeEmirate(
        address.state,
        address.state_district,
        address.municipality,
        address.county,
        address.city,
        address.town,
        address.village,
        result.display_name
      );

    if (
      !emirate ||
      !UAE_EMIRATES.includes(
        emirate as
          (typeof UAE_EMIRATES)[number]
      )
    ) {
      console.error(
        "Unable to detect UAE emirate:",
        {
          state:
            address.state,

          stateDistrict:
            address.state_district,

          municipality:
            address.municipality,

          county:
            address.county,

          city:
            address.city,

          town:
            address.town,

          village:
            address.village,

          displayName:
            result.display_name,
        }
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We found your location but couldn't determine the emirate. Please select it manually.",
        },
        {
          status: 422,
        }
      );
    }

    const area =
      getArea(
        address
      );

    const addressLine =
      getAddressLine(
        address,
        result.display_name ??
          ""
      );

    return NextResponse.json(
      {
        success: true,

        location: {
          emirate,
          area,
          addressLine,
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
      "Reverse geocode error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to detect your address right now.",
      },
      {
        status: 500,
      }
    );
  }
}