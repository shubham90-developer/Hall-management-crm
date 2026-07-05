import { z } from "zod";

export const RegisterValidation = z.object({
  username: z.string("Username is required").min(3).max(30).trim(),
  email: z.string("Email is required").email("Invalid email").trim(),
  password: z.string("Password is required").min(6),
});

export const LoginValidation = z.object({
  email: z.string("Email is required").email("Invalid email").trim(),
  password: z.string("Password is required"),
});

export const ChangePasswordValidation = z.object({
  username: z.string("Username is required").trim(),
  newPassword: z.string("New password is required").min(6),
});
