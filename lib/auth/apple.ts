import {
  SignJWT,
  createRemoteJWKSet,
  importPKCS8,
  jwtVerify,
} from "jose";

const APPLE_ISSUER =
  "https://appleid.apple.com";

const APPLE_TOKEN_URL =
  "https://appleid.apple.com/auth/token";

const APPLE_KEYS_URL =
  new URL(
    "https://appleid.apple.com/auth/keys"
  );

const appleJWKS =
  createRemoteJWKSet(
    APPLE_KEYS_URL
  );

type AppleTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  id_token: string;
};

export type AppleIdentity = {
  appleId: string;
  email?: string;
  emailVerified: boolean;
};

function getAppleConfig() {
  const clientId =
    process.env.APPLE_CLIENT_ID;

  const teamId =
    process.env.APPLE_TEAM_ID;

  const keyId =
    process.env.APPLE_KEY_ID;

  const privateKey =
    process.env.APPLE_PRIVATE_KEY;

  const redirectUri =
    process.env.APPLE_REDIRECT_URI;

  if (
    !clientId ||
    !teamId ||
    !keyId ||
    !privateKey ||
    !redirectUri
  ) {
    throw new Error(
      "Apple authentication environment variables are missing."
    );
  }

  return {
    clientId,
    teamId,
    keyId,
    privateKey:
      privateKey.replace(
        /\\n/g,
        "\n"
      ),
    redirectUri,
  };
}

export async function createAppleClientSecret() {
  const {
    clientId,
    teamId,
    keyId,
    privateKey,
  } = getAppleConfig();

  const signingKey =
    await importPKCS8(
      privateKey,
      "ES256"
    );

  const now =
    Math.floor(
      Date.now() / 1000
    );

  return await new SignJWT({})
    .setProtectedHeader({
      alg: "ES256",
      kid: keyId,
    })
    .setIssuer(teamId)
    .setSubject(clientId)
    .setAudience(
      APPLE_ISSUER
    )
    .setIssuedAt(now)
    .setExpirationTime(
      now + 5 * 60
    )
    .sign(signingKey);
}

export function getAppleAuthorizationUrl(
  state: string
) {
  const {
    clientId,
    redirectUri,
  } = getAppleConfig();

  const url =
    new URL(
      `${APPLE_ISSUER}/auth/authorize`
    );

  url.searchParams.set(
    "client_id",
    clientId
  );

  url.searchParams.set(
    "redirect_uri",
    redirectUri
  );

  url.searchParams.set(
    "response_type",
    "code"
  );

  url.searchParams.set(
    "response_mode",
    "form_post"
  );

  url.searchParams.set(
    "scope",
    "name email"
  );

  url.searchParams.set(
    "state",
    state
  );

  return url.toString();
}

export async function exchangeAppleCode(
  code: string
): Promise<AppleTokenResponse> {
  const {
    clientId,
    redirectUri,
  } = getAppleConfig();

  const clientSecret =
    await createAppleClientSecret();

  const body =
    new URLSearchParams({
      client_id: clientId,
      client_secret:
        clientSecret,
      code,
      grant_type:
        "authorization_code",
      redirect_uri:
        redirectUri,
    });

  const response =
    await fetch(
      APPLE_TOKEN_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body: body.toString(),

        cache: "no-store",
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    console.error(
      "Apple token exchange failed:",
      data
    );

    throw new Error(
      "Apple authorization code could not be validated."
    );
  }

  if (
    !data.id_token ||
    typeof data.id_token !==
      "string"
  ) {
    throw new Error(
      "Apple identity token is missing."
    );
  }

  return data as AppleTokenResponse;
}

export async function verifyAppleIdentityToken(
  idToken: string
): Promise<AppleIdentity> {
  const {
    clientId,
  } = getAppleConfig();

  const {
    payload,
  } = await jwtVerify(
    idToken,
    appleJWKS,
    {
      issuer: APPLE_ISSUER,
      audience: clientId,
      algorithms: ["RS256"],
    }
  );

  if (
    !payload.sub ||
    typeof payload.sub !==
      "string"
  ) {
    throw new Error(
      "Apple identity token does not contain a user identifier."
    );
  }

  const email =
    typeof payload.email ===
    "string"
      ? payload.email
          .trim()
          .toLowerCase()
      : undefined;

  const emailVerified =
    payload.email_verified ===
      true ||
    payload.email_verified ===
      "true";

  return {
    appleId: payload.sub,
    email,
    emailVerified,
  };
}