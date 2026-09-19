export type CollaborationInput = {
  name: string;
  email: string;
  phone: string;
  type: string;
  message: string;
};

type ValidationResult =
  | {
      success: true;
      data: CollaborationInput;
    }
  | {
      success: false;
      error: string;
    };

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_REGEX =
  /^\+[1-9]\d{6,14}$/;

function normalizeString(
  value: unknown,
) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function validateCollaborationInput(
  body: unknown,
): ValidationResult {
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return {
      success: false,
      error: "Invalid request.",
    };
  }

  const input =
    body as Record<string, unknown>;

  const name =
    normalizeString(input.name);

  const email = normalizeString(
    input.email,
  ).toLowerCase();

  const phone =
    normalizeString(input.phone);

  const type =
    normalizeString(input.type);

  const message =
    normalizeString(input.message);

  if (
    name.length < 2 ||
    name.length > 80
  ) {
    return {
      success: false,
      error:
        "Please enter a valid name.",
    };
  }

  if (
    email.length > 254 ||
    !EMAIL_REGEX.test(email)
  ) {
    return {
      success: false,
      error:
        "Please enter a valid email address.",
    };
  }

  if (!PHONE_REGEX.test(phone)) {
    return {
      success: false,
      error:
        "Please enter a valid phone number.",
    };
  }

  if (
    type.length < 2 ||
    type.length > 80
  ) {
    return {
      success: false,
      error:
        "Please select a collaboration type.",
    };
  }

  if (
    message.length < 10 ||
    message.length > 2000
  ) {
    return {
      success: false,
      error:
        "Message must be between 10 and 2000 characters.",
    };
  }

  return {
    success: true,
    data: {
      name,
      email,
      phone,
      type,
      message,
    },
  };
}