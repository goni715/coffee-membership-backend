import z from "zod";
import {
  emailZodSchema,
  fullNameZodSchema,
  passwordZodSchema,
  phoneNumberZodSchema,
} from "@/modules/auth/auth.validation";
import { Types } from "mongoose";
import { enumSchema } from "@/schemas/enum.schema";
import { ACCOUNT_STATUSES } from "../user/user.constant";

export const createOwnerValidationSchema = z.object({
  body: z.object({
    fullName: fullNameZodSchema,
    email: emailZodSchema,
    phone: phoneNumberZodSchema,
    password: passwordZodSchema.optional(),
  }),
});


const ownerIdZodSchema = z.string().refine((id) => Types.ObjectId.isValid(id), {
  message: "ownerId must be a valid ObjectId",
});


export const updateOwnerValidationSchema = z.object({
  params: z.object({
    ownerId: ownerIdZodSchema,
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
    ownerId: ownerIdZodSchema,
  }),
});


export const getOwnersValidationSchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: enumSchema('sortOrder', ['asc', 'desc']).optional(),
    status: enumSchema('status', [ACCOUNT_STATUSES.ACTIVE, ACCOUNT_STATUSES.BLOCKED]).optional(),
  })
});
