import {
  NextRequest,
  NextResponse,
} from "next/server";

import { OAuth2Client } from "google-auth-library";

import { connectDB } from "@/lib/mongodb";
import { createSession } from "@/lib/auth/session";
import Customer from "@/models/Customer";

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error(
    "GOOGLE_CLIENT_ID is not defined"
  );
}

const googleClient =
  new OAuth2Client(
    GOOGLE_CLIENT_ID
  );

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const credential =
      typeof body.credential === "string"
        ? body.credential.trim()
        : "";

    if (!credential) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Google authentication credential is required.",
        },
        {
          status: 400,
        }
      );
    }

    const ticket =
      await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });

    const payload =
      ticket.getPayload();

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to verify your Google account.",
        },
        {
          status: 401,
        }
      );
    }

    const googleId =
      payload.sub;

    const email =
      typeof payload.email === "string"
        ? payload.email
            .trim()
            .toLowerCase()
        : "";

    const name =
      typeof payload.name === "string"
        ? payload.name.trim()
        : "";

    const emailVerified =
      payload.email_verified === true;

    if (
      !googleId ||
      !email ||
      !emailVerified
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your Google account could not be verified.",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    let customer =
      await Customer.findOne({
        googleId,
      }).select("+googleId");

    if (customer) {
      if (!customer.isActive) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This account is currently unavailable.",
          },
          {
            status: 403,
          }
        );
      }

      await createSession(
        customer._id.toString()
      );

      return NextResponse.json(
        {
          success: true,
          message:
            "Signed in successfully.",
        },
        {
          status: 200,
        }
      );
    }

    const existingCustomer =
      await Customer.findOne({
        email,
      }).select("+googleId");

    if (existingCustomer) {
      if (
        !existingCustomer.isActive
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This account is currently unavailable.",
          },
          {
            status: 403,
          }
        );
      }

      if (
        existingCustomer.googleId &&
        existingCustomer.googleId !==
          googleId
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This email is already linked to another Google account.",
          },
          {
            status: 409,
          }
        );
      }

      const providers =
        existingCustomer.providers ?? [];

      if (
        !providers.includes("google")
      ) {
        existingCustomer.providers = [
          ...providers,
          "google",
        ];
      }

      existingCustomer.googleId =
        googleId;

      existingCustomer.emailVerified =
        true;

      await existingCustomer.save();

      await createSession(
        existingCustomer._id.toString()
      );

      return NextResponse.json(
        {
          success: true,
          message:
            "Signed in successfully.",
        },
        {
          status: 200,
        }
      );
    }

    customer =
      await Customer.create({
        name:
          name ||
          email.split("@")[0],

        email,

        providers: [
          "google",
        ],

        googleId,

        emailVerified: true,

        isActive: true,
      });

    await createSession(
      customer._id.toString()
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Signed in successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Google authentication error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to sign in with Google. Please try again.",
      },
      {
        status: 401,
      }
    );
  }
}
