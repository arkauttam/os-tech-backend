import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
  designation: z.string().optional(),
  password: z.string().min(6),
});