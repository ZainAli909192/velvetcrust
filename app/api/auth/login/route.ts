import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { createSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import { loginSchema } from "@/lib/validations/auth";
import Customer from "@/models/Customer";
import Session from "@/models/Session";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check your login information.",
          errors: parsed.error.flatten().fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const { email, password } = parsed.data;

    await connectDB();

    const customer = await Customer.findOne({
      email,
    }).select("+passwordHash");

    if (!customer || !customer.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    if (!customer.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to sign in to this account.",
        },
        {
          status: 403,
        }
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      customer.passwordHash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    await Session.deleteMany({
      customerId: customer._id,
      expiresAt: {
        $lte: new Date(),
      },
    });

    await createSession(
      customer._id.toString()
    );

    return NextResponse.json(
      {
        success: true,
        message: "Signed in successfully.",
        customer: {
          id: customer._id.toString(),
          name: customer.name,
          email: customer.email,
          phone: customer.phone ?? null,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to sign in.",
      },
      {
        status: 500,
      }
    );
  }
}