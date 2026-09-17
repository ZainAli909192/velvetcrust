import crypto from "crypto";

import {
  NextResponse,
} from "next/server";

import {
  getAppleAuthorizationUrl,
} from "@/lib/auth/apple";

const STATE_COOKIE =
  "vc_apple_oauth_state";

const STATE_MAX_AGE =
  10 * 60;

export async function GET() {
  try {
    const state =
      crypto
        .randomBytes(32)
        .toString("base64url");

    const authorizationUrl =
      getAppleAuthorizationUrl(
        state
      );

    const response =
      NextResponse.redirect(
        authorizationUrl
      );

    response.cookies.set(
      STATE_COOKIE,
      state,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge:
          STATE_MAX_AGE,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Apple authentication start error:",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/account?authError=apple",
        process.env.NEXT_SITE_URL ||
          "http://localhost:3000"
      )
    );
  }
}