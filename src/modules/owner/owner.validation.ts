import z from "zod";
import { emailZodSchema, fullNameZodSchema, passwordZodSchema, phoneNumberZodSchema } from "@/modules/auth/auth.validation";

export const createOwnerValidationSchema = z.object({
  fullName: fullNameZodSchema,
  email: emailZodSchema,
  phone: phoneNumberZodSchema,
  password: passwordZodSchema.optional(),
});
