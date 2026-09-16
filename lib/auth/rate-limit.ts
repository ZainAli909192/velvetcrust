import crypto from "crypto";

import { connectDB } from "@/lib/mongodb";
import RateLimit, {
  RateLimitType,
} from "@/models/RateLimit";

type RateLimitOptions = {
  type: RateLimitType;
  key: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
};

function hashRateLimitKey(
  value: string
) {
  return crypto
    .createHash("sha256")
    .update(value)
    .digest("hex");
}

export async function checkRateLimit({
  type,
  key,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  await connectDB();

  const now = new Date();

  const normalizedKey =
    hashRateLimitKey(
      key.trim().toLowerCase()
    );

  const existing =
    await RateLimit.findOne({
      type,
      key: normalizedKey,
    });

  if (
    !existing ||
    existing.expiresAt.getTime() <=
      now.getTime()
  ) {
    if (existing) {
      await RateLimit.deleteOne({
        _id: existing._id,
      });
    }

    try {
      await RateLimit.create({
        type,
        key: normalizedKey,
        count: 1,
        windowStartedAt: now,
        expiresAt: new Date(
          now.getTime() +
            windowMs
        ),
      });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        return await checkRateLimit({
          type,
          key,
          limit,
          windowMs,
        });
      }

      throw error;
    }

    return {
      allowed: true,
      remaining:
        Math.max(limit - 1, 0),
      retryAfter: 0,
    };
  }

  const updated =
    await RateLimit.findOneAndUpdate(
      {
        _id: existing._id,
        count: {
          $lt: limit,
        },
        expiresAt: {
          $gt: now,
        },
      },
      {
        $inc: {
          count: 1,
        },
      },
      {
        new: true,
      }
    );

  if (updated) {
    return {
      allowed: true,
      remaining:
        Math.max(
          limit -
            updated.count,
          0
        ),
      retryAfter: 0,
    };
  }

  const retryAfter =
    Math.max(
      Math.ceil(
        (
          existing.expiresAt.getTime() -
          now.getTime()
        ) / 1000
      ),
      1
    );

  return {
    allowed: false,
    remaining: 0,
    retryAfter,
  };
}

export function getClientIp(
  request: Request
) {
  const forwardedFor =
    request.headers.get(
      "x-forwarded-for"
    );

  if (forwardedFor) {
    const firstIp =
      forwardedFor
        .split(",")[0]
        ?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  const realIp =
    request.headers.get(
      "x-real-ip"
    );

  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}