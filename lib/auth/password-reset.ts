import crypto from "crypto";

const OTP_LENGTH = 6;

export function generateOtp() {
  return crypto
    .randomInt(
      0,
      10 ** OTP_LENGTH
    )
    .toString()
    .padStart(
      OTP_LENGTH,
      "0"
    );
}

export function hashOtp(
  otp: string
) {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}

export function createResetVerificationToken() {
  return crypto
    .randomBytes(32)
    .toString("hex");
}

export function hashResetVerificationToken(
  token: string
) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}