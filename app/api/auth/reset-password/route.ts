import {
  NextRequest,
  NextResponse,
} from "next/server";

import bcrypt from "bcryptjs";
import crypto from "crypto";

import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;

function hashResetToken(
  token: string
) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function isStrongPassword(
  password: string
) {
  return (
    password.length >=
      PASSWORD_MIN_LENGTH &&
    password.length <=
      PASSWORD_MAX_LENGTH &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  );
}

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

    const resetToken =
      typeof body.resetToken === "string"
        ? body.resetToken.trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const confirmPassword =
      typeof body.confirmPassword ===
      "string"
        ? body.confirmPassword
        : "";

    if (
      !email ||
      !resetToken ||
      !password ||
      !confirmPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete all required fields.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      password !==
      confirmPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Passwords do not match.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !isStrongPassword(password)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be 8–72 characters and include an uppercase letter, lowercase letter, and number.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const tokenHash =
      hashResetToken(
        resetToken
      );

    const customer =
      await Customer.findOne({
        email,
        isActive: true,
        passwordResetTokenHash:
          tokenHash,
        passwordResetTokenExpires: {
          $gt: new Date(),
        },
      }).select(
        [
          "+passwordHash",
          "+passwordResetOtpHash",
          "+passwordResetOtpExpires",
          "+passwordResetOtpAttempts",
          "+passwordResetVerifiedAt",
          "+passwordResetTokenHash",
          "+passwordResetTokenExpires",
        ].join(" ")
      );

    if (
      !customer ||
      !customer.passwordResetVerifiedAt
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your password reset session is invalid or has expired. Please start again.",
        },
        {
          status: 400,
        }
      );
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      );

    customer.passwordHash =
      passwordHash;

    if (
      !customer.providers.includes(
        "credentials"
      )
    ) {
      customer.providers.push(
        "credentials"
      );
    }

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

    return NextResponse.json(
      {
        success: true,
        message:
          "Your password has been reset successfully. You can now sign in.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to reset your password right now.",
      },
      {
        status: 500,
      }
    );
  }
}