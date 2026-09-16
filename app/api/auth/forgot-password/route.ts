import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

import {
  generateOtp,
  hashOtp,
} from "@/lib/auth/password-reset";

import {
  checkRateLimit,
  getClientIp,
} from "@/lib/auth/rate-limit";

import { sendPasswordResetOtp } from "@/lib/email/send-password-reset-otp";

const OTP_EXPIRY_MINUTES = 2;

const IP_LIMIT = 15;
const IP_WINDOW_MS =
  60 * 60 * 1000;

const EMAIL_LIMIT = 5;
const EMAIL_WINDOW_MS =
  60 * 60 * 1000;

const RESEND_COOLDOWN_MS =
  60 * 1000;

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const email =
      typeof body.email === "string"
        ? body.email
            .trim()
            .toLowerCase()
        : "";

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter your email address.",
        },
        {
          status: 400,
        }
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(email)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    const clientIp =
      getClientIp(request);

    const ipLimit =
      await checkRateLimit({
        type: "forgot-password-ip",
        key: clientIp,
        limit: IP_LIMIT,
        windowMs: IP_WINDOW_MS,
      });

    if (!ipLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many password reset requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After":
              String(
                ipLimit.retryAfter
              ),
          },
        }
      );
    }

    const emailLimit =
      await checkRateLimit({
        type:
          "forgot-password-email",
        key: email,
        limit: EMAIL_LIMIT,
        windowMs:
          EMAIL_WINDOW_MS,
      });

    if (!emailLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many verification codes have been requested. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After":
              String(
                emailLimit.retryAfter
              ),
          },
        }
      );
    }

    await connectDB();

    const customer =
      await Customer.findOne({
        email,
        isActive: true,
      }).select(
        "+passwordResetOtpHash " +
          "+passwordResetOtpExpires " +
          "+passwordResetOtpAttempts " +
          "+passwordResetVerifiedAt " +
          "+passwordResetTokenHash " +
          "+passwordResetTokenExpires"
      );

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message:
            "We couldn't find an account with this email address.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      customer.passwordResetOtpHash &&
      customer.passwordResetOtpExpires
    ) {
      const otpCreatedAt =
        customer.passwordResetOtpExpires.getTime() -
        OTP_EXPIRY_MINUTES *
          60 *
          1000;

      const nextAllowedAt =
        otpCreatedAt +
        RESEND_COOLDOWN_MS;

      if (
        Date.now() <
        nextAllowedAt
      ) {
        const retryAfter =
          Math.max(
            Math.ceil(
              (
                nextAllowedAt -
                Date.now()
              ) / 1000
            ),
            1
          );

        return NextResponse.json(
          {
            success: false,
            message: `Please wait ${retryAfter} seconds before requesting another code.`,
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
    }

    const otp =
      generateOtp();

    customer.passwordResetOtpHash =
      hashOtp(otp);

    customer.passwordResetOtpExpires =
      new Date(
        Date.now() +
          OTP_EXPIRY_MINUTES *
            60 *
            1000
      );

    customer.passwordResetOtpAttempts =
      0;

    customer.passwordResetVerifiedAt =
      null;

    customer.passwordResetTokenHash =
      null;

    customer.passwordResetTokenExpires =
      null;

    await customer.save();

    try {
      await sendPasswordResetOtp({
        email: customer.email,
        name: customer.name,
        otp,
      });
    } catch (error) {
      customer.passwordResetOtpHash =
        null;

      customer.passwordResetOtpExpires =
        null;

      customer.passwordResetOtpAttempts =
        0;

      customer.passwordResetVerifiedAt =
        null;

      customer.passwordResetTokenHash =
        null;

      customer.passwordResetTokenExpires =
        null;

      await customer.save();

      console.error(
        "Password reset email error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We couldn't send the verification code. Please try again.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Verification code sent successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process your request right now.",
      },
      {
        status: 500,
      }
    );
  }
}