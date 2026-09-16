import {
  NextRequest,
  NextResponse,
} from "next/server";

import crypto from "crypto";

import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

import {
  createResetVerificationToken,
  hashOtp,
  hashResetVerificationToken,
} from "@/lib/auth/password-reset";

import {
  checkRateLimit,
  getClientIp,
} from "@/lib/auth/rate-limit";

const MAX_OTP_ATTEMPTS = 5;

const RESET_TOKEN_EXPIRY_MINUTES =
  2;

const VERIFY_IP_LIMIT = 20;

const VERIFY_IP_WINDOW_MS =
  15 * 60 * 1000;

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

    const otp =
      typeof body.otp === "string"
        ? body.otp.trim()
        : "";

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email address is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !/^\d{6}$/.test(otp)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enter the 6-digit verification code.",
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
        type: "verify-otp-ip",
        key: clientIp,
        limit: VERIFY_IP_LIMIT,
        windowMs:
          VERIFY_IP_WINDOW_MS,
      });

    if (!ipLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many verification attempts. Please try again later.",
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

    if (
      !customer ||
      !customer.passwordResetOtpHash ||
      !customer.passwordResetOtpExpires
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The verification code is invalid or has expired.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      customer.passwordResetOtpExpires.getTime() <=
      Date.now()
    ) {
      customer.passwordResetOtpHash =
        null;

      customer.passwordResetOtpExpires =
        null;

      customer.passwordResetOtpAttempts =
        0;

      await customer.save();

      return NextResponse.json(
        {
          success: false,
          message:
            "This verification code has expired. Please request a new code.",
        },
        {
          status: 400,
        }
      );
    }

    const attempts =
      customer.passwordResetOtpAttempts ??
      0;

    if (
      attempts >=
      MAX_OTP_ATTEMPTS
    ) {
      customer.passwordResetOtpHash =
        null;

      customer.passwordResetOtpExpires =
        null;

      customer.passwordResetOtpAttempts =
        0;

      await customer.save();

      return NextResponse.json(
        {
          success: false,
          message:
            "Too many incorrect attempts. Please request a new code.",
        },
        {
          status: 429,
        }
      );
    }

    const submittedHash =
      hashOtp(otp);

    const submittedBuffer =
      Buffer.from(
        submittedHash,
        "hex"
      );

    const storedBuffer =
      Buffer.from(
        customer.passwordResetOtpHash,
        "hex"
      );

    const validHashLengths =
      submittedBuffer.length ===
      storedBuffer.length;

    const otpMatches =
      validHashLengths &&
      crypto.timingSafeEqual(
        submittedBuffer,
        storedBuffer
      );

    if (!otpMatches) {
      const newAttempts =
        attempts + 1;

      customer.passwordResetOtpAttempts =
        newAttempts;

      if (
        newAttempts >=
        MAX_OTP_ATTEMPTS
      ) {
        customer.passwordResetOtpHash =
          null;

        customer.passwordResetOtpExpires =
          null;

        customer.passwordResetOtpAttempts =
          0;

        await customer.save();

        return NextResponse.json(
          {
            success: false,
            message:
              "Too many incorrect attempts. Please request a new code.",
          },
          {
            status: 429,
          }
        );
      }

      await customer.save();

      const remaining =
        MAX_OTP_ATTEMPTS -
        newAttempts;

      return NextResponse.json(
        {
          success: false,
          message:
            remaining === 1
              ? "Incorrect code. 1 attempt remaining."
              : `Incorrect code. ${remaining} attempts remaining.`,
        },
        {
          status: 400,
        }
      );
    }

    const resetToken =
      createResetVerificationToken();

    customer.passwordResetOtpHash =
      null;

    customer.passwordResetOtpExpires =
      null;

    customer.passwordResetOtpAttempts =
      0;

    customer.passwordResetVerifiedAt =
      new Date();

    customer.passwordResetTokenHash =
      hashResetVerificationToken(
        resetToken
      );

    customer.passwordResetTokenExpires =
      new Date(
        Date.now() +
          RESET_TOKEN_EXPIRY_MINUTES *
            60 *
            1000
      );

    await customer.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Verification successful.",
        resetToken,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Verify reset OTP error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to verify the code right now.",
      },
      {
        status: 500,
      }
    );
  }
}