import { z } from "zod";
import { REASON_MAX_LENGTH } from "../constants";

export const inviteAdminSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

export type InviteAdminFormData = z.infer<typeof inviteAdminSchema>;

export const createAdminSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  username: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscores only")
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.string().min(1, "Gender is required"),
});

export type CreateAdminFormData = z.infer<typeof createAdminSchema>;

export const reasonSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "Please provide a reason")
    .max(REASON_MAX_LENGTH, `Reason must be at most ${REASON_MAX_LENGTH} characters`),
});

export type ReasonFormData = z.infer<typeof reasonSchema>;
