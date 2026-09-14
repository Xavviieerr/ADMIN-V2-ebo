import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Please enter your email or username")
    .refine(
      (val) => {
        if (val.includes("@")) {
          return z.string().email().safeParse(val).success;
        }
        return val.length >= 4;
      },
      {
        message: "Enter a valid email or username (min 4 characters)",
      },
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
