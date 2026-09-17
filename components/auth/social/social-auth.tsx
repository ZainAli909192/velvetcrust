"use client";

import AppleLogin from "./apple-login";
import GoogleLogin from "./google-login";

type SocialAuthProps = {
  onSuccess?: () => void;
};

export default function SocialAuth({
  onSuccess,
}: SocialAuthProps) {
  return (
    <div
      className="
        grid
        grid-cols-2
        items-start
        gap-2.5

        sm:gap-3
      "
    >
      <GoogleLogin
        onSuccess={
          onSuccess
        }
      />

      <AppleLogin />
    </div>
  );
}