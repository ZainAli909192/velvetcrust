import { NextResponse } from "next/server";

import { getCurrentCustomer } from "@/lib/auth/session";

export async function GET() {
  try {
    const customer =
      await getCurrentCustomer();

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          customer: null,
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json({
      success: true,

      customer: {
        id: customer._id.toString(),
        name: customer.name,
        email: customer.email,
        phone: customer.phone ?? null,
      },
    });
  } catch (error) {
    console.error(
      "Current customer error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        customer: null,
      },
      {
        status: 500,
      }
    );
  }
}