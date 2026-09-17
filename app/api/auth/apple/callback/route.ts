import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  connectDB,
} from "@/lib/mongodb";

import {
  createSession,
} from "@/lib/auth/session";

import {
  exchangeAppleCode,
  verifyAppleIdentityToken,
} from "@/lib/auth/apple";

import Customer from "@/models/Customer";

const STATE_COOKIE =
  "vc_apple_oauth_state";

type AppleUserPayload = {
  name?: {
    firstName?: string;
    lastName?: string;
  };
};

function getSiteUrl() {
  return (
    process.env.NEXT_SITE_URL ||
    "http://localhost:3000"
  );
}

function redirectWithError(
  code: string
) {
  return NextResponse.redirect(
    new URL(
      `/account?authError=${encodeURIComponent(
        code
      )}`,
      getSiteUrl()
    ),
    303
  );
}

function getAppleName(
  rawUser: FormDataEntryValue | null
) {
  if (
    !rawUser ||
    typeof rawUser !== "string"
  ) {
    return "";
  }

  try {
    const parsed =
      JSON.parse(
        rawUser
      ) as AppleUserPayload;

    const firstName =
      parsed.name?.firstName
        ?.trim() || "";

    const lastName =
      parsed.name?.lastName
        ?.trim() || "";

    return [
      firstName,
      lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();
  } catch {
    return "";
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const formData =
      await request.formData();

    const code =
      formData.get("code");

    const state =
      formData.get("state");

    const appleError =
      formData.get("error");

    const storedState =
      request.cookies.get(
        STATE_COOKIE
      )?.value;

    if (appleError) {
      console.error(
        "Apple authorization error:",
        appleError
      );

      return redirectWithError(
        "apple_cancelled"
      );
    }

    if (
      typeof state !== "string" ||
      !storedState ||
      state !== storedState
    ) {
      return redirectWithError(
        "invalid_state"
      );
    }

    if (
      typeof code !== "string" ||
      !code
    ) {
      return redirectWithError(
        "missing_code"
      );
    }

    const tokenResponse =
      await exchangeAppleCode(
        code
      );

    const identity =
      await verifyAppleIdentityToken(
        tokenResponse.id_token
      );

    await connectDB();

    let customer =
      await Customer.findOne({
        appleId:
          identity.appleId,
      });

    if (!customer) {
      if (
        !identity.email ||
        !identity.emailVerified
      ) {
        return redirectWithError(
          "apple_email_unavailable"
        );
      }

      customer =
        await Customer.findOne({
          email:
            identity.email,
        });
    }

    if (customer) {
      if (!customer.isActive) {
        return redirectWithError(
          "account_disabled"
        );
      }

      if (
        customer.appleId &&
        customer.appleId !==
          identity.appleId
      ) {
        return redirectWithError(
          "apple_account_conflict"
        );
      }

      customer.appleId =
        identity.appleId;

      if (
        !customer.providers.includes(
          "apple"
        )
      ) {
        customer.providers.push(
          "apple"
        );
      }

      if (
        identity.emailVerified
      ) {
        customer.emailVerified =
          true;
      }

      await customer.save();
    } else {
      const name =
        getAppleName(
          formData.get("user")
        );

      customer =
        await Customer.create({
          name:
            name ||
            "Velvet Crust Customer",

          email:
            identity.email,

          providers: [
            "apple",
          ],

          appleId:
            identity.appleId,

          emailVerified:
            identity.emailVerified,

          isActive: true,
        });
    }

    await createSession(
      customer._id.toString()
    );

    const response =
      NextResponse.redirect(
        new URL(
          "/account",
          getSiteUrl()
        ),
        303
      );

    response.cookies.set(
      STATE_COOKIE,
      "",
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        expires:
          new Date(0),
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Apple authentication callback error:",
      error
    );

    return redirectWithError(
      "apple_failed"
    );
  }
}