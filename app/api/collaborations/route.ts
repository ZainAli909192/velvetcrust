import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import {
  checkRateLimit,
  getClientIp,
} from "@/lib/auth/rate-limit";

import { sendCollaborationEmail } from "@/lib/email/collaboration-email";

import Collaboration from "@/models/Collaboration";

import { validateCollaborationInput } from "./_lib/collaboration-validation";

const RATE_LIMIT_WINDOW =
  15 * 60 * 1000;

export async function POST(
  request: NextRequest,
) {
  try {
    const clientIp = getClientIp(request);

    const ipLimit = await checkRateLimit({
      type: "collaboration",
      key: `ip:${clientIp}`,
      limit: 5,
      windowMs: RATE_LIMIT_WINDOW,
    });

    if (!ipLimit.allowed) {
      return NextResponse.json(
        {
          message:
            "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              ipLimit.retryAfter,
            ),
          },
        },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          message: "Invalid request.",
        },
        {
          status: 400,
        },
      );
    }

    const validation =
      validateCollaborationInput(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: validation.error,
        },
        {
          status: 400,
        },
      );
    }

    const data = validation.data;

    const emailLimit = await checkRateLimit({
      type: "collaboration",
      key: `email:${data.email}`,
      limit: 3,
      windowMs: RATE_LIMIT_WINDOW,
    });

    if (!emailLimit.allowed) {
      return NextResponse.json(
        {
          message:
            "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              emailLimit.retryAfter,
            ),
          },
        },
      );
    }

    await connectDB();

    const collaboration =
      await Collaboration.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        type: data.type,
        message: data.message,
        status: "pending",
      });

    try {
      await sendCollaborationEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        type: data.type,
        message: data.message,
      });
    } catch (emailError) {
      console.error(
        "Collaboration email failed:",
        emailError,
      );
    }

    return NextResponse.json(
      {
        message:
          "Your collaboration enquiry has been received.",

        collaboration: {
          id: collaboration._id.toString(),
          status: collaboration.status,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Create collaboration error:",
      error,
    );

    return NextResponse.json(
      {
        message:
          "Unable to submit your enquiry right now.",
      },
      {
        status: 500,
      },
    );
  }
}