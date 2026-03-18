import { z } from "zod";

export const signupSchema = z.object({

  name: z.string().min(2),
  email: z.string().email(),
  contact: z.string().min(10),

  company: z.string().optional(),
  designation: z.string().optional(),

  password: z.string().min(8),
  confirmPassword: z.string()

}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

