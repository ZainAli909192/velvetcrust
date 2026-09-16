import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required")
    .max(80, "Name is too long"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .max(254),

  phone: z
    .string()
    .trim()
    .max(20)
    .optional(),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(128, "Password is too long")
    .regex(
      /[a-z]/,
      "Password must contain a lowercase letter"
    )
    .regex(
      /[A-Z]/,
      "Password must contain an uppercase letter"
    )
    .regex(
      /\d/,
      "Password must contain a number"
    ),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .max(254),

  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
});

export type RegisterInput =
  z.infer<typeof registerSchema>;

export type LoginInput =
  z.infer<typeof loginSchema>;