import z from "zod";
import {
  emailZodSchema,
  fullNameZodSchema,
  passwordZodSchema,
  phoneNumberZodSchema,
} from "@/modules/auth/auth.validation";
import { Types } from "mongoose";

export const createOwnerValidationSchema = z.object({
  body: z.object({
    fullName: fullNameZodSchema,
    email: emailZodSchema,
    phone: phoneNumberZodSchema,
    password: passwordZodSchema.optional(),
  }),
});

export const updateOwnerValidationSchema = z.object({
  params: z.object({
    ownerId: z.string().refine((id) => Types.ObjectId.isValid(id), {
      message: "ownerId must be a valid ObjectId",
    }),
  }),
  body: z
    .object({
      fullName: fullNameZodSchema.optional(),
      phone: phoneNumberZodSchema.optional(),
    })
    .refine((data) => Object.values(data).some((val) => val !== undefined), {
      message: "At least one field must be provided to update",
      path: ["body"],
    }),
});

export const deleteOwnerValidationSchema = z.object({
  params: z.object({
    ownerId: z.string().refine((id) => Types.ObjectId.isValid(id), {
      message: "ownerId must be a valid ObjectId",
    }),
  }),
});
