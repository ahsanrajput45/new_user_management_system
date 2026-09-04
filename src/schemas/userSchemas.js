import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  role: z.enum(["Admin", "User"], {
    errorMap: () => ({ message: "Select a role" }),
  }),
  status: z.enum(["Active", "Inactive"], {
    errorMap: () => ({ message: "Select a status" }),
  }),
});

export const createUserSchema = userSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  photo: z.string().optional(),
});

export const editUserSchema = userSchema.extend({
  password: z.string().optional(),
  photo: z.string().optional(),
});
