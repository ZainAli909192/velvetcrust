import crypto from "crypto";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Session from "@/models/Session";

const SESSION_COOKIE = "vc_session";

const SESSION_DURATION =
  60 * 60 * 24 * 30;

function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function generateSessionToken() {
  return crypto
    .randomBytes(32)
    .toString("base64url");
}

export async function createSession(
  customerId: string
) {
  await connectDB();

  const token = generateSessionToken();
  const tokenHash = hashToken(token);

  const expiresAt = new Date(
    Date.now() +
      SESSION_DURATION * 1000
  );

  await Session.create({
    customerId,
    tokenHash,
    expiresAt,
  });

  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE,
    token,
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "lax",

      path: "/",

      maxAge: SESSION_DURATION,
    }
  );
}

export async function getCurrentCustomer() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get(
      SESSION_COOKIE
    )?.value;

  if (!token) {
    return null;
  }

  await connectDB();

  const tokenHash = hashToken(token);

  const session =
    await Session.findOne({
      tokenHash,
    }).select("+tokenHash");

  if (!session) {
    return null;
  }

  if (
    session.expiresAt.getTime() <=
    Date.now()
  ) {
    await Session.deleteOne({
      _id: session._id,
    });

    return null;
  }

  const customer =
    await Customer.findById(
      session.customerId
    );

  if (!customer) {
    await Session.deleteOne({
      _id: session._id,
    });

    return null;
  }

  if (!customer.isActive) {
    await Session.deleteOne({
      _id: session._id,
    });

    return null;
  }

  return customer;
}

export async function deleteSession() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get(
      SESSION_COOKIE
    )?.value;

  if (token) {
    await connectDB();

    await Session.deleteOne({
      tokenHash: hashToken(token),
    });
  }

  cookieStore.set(
    SESSION_COOKIE,
    "",
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "lax",

      path: "/",

      expires: new Date(0),
    }
  );
}