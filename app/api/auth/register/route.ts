import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { registerSchema } from "@/lib/validations/auth";
import Customer from "@/models/Customer";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check your information.",
          errors: parsed.error.flatten().fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const {
      name,
      email,
      phone,
      password,
    } = parsed.data;

    await connectDB();

    const existingCustomer =
      await Customer.findOne({
        email,
      }).lean();

    if (existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const customer =
      await Customer.create({
        name,
        email,
        phone: phone || undefined,
        passwordHash,

        providers: [
          "credentials",
        ],

        emailVerified: false,
        isActive: true,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully.",

        customer: {
          id: customer._id.toString(),
          name: customer.name,
          email: customer.email,
          phone: customer.phone ?? null,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create account.",
      },
      {
        status: 500,
      }
    );
  }
}