import z from "zod";
import { Types } from "mongoose";
import { requiredStringSchema } from "@/schemas/required.schema";
import { booleanSchema } from "@/schemas/boolean.schema";
import { enumSchema } from "@/schemas/enum.schema";


export const fullNameRegex = /^[A-Za-z\s'.-]+$/;
export const phoneRegex = /^\+?\d{1,14}$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)/;

export const fullNameZodSchema = requiredStringSchema('fullName')
  .regex(fullNameRegex, {
    message:
      "Full Name can only contain letters, spaces, apostrophes, hyphens, and dots.",
  });

export const emailZodSchema = z.email({
  error: (issue) =>
    issue.input === undefined ? "email is required" : "Invalid email address",
});

export const passwordZodSchema = requiredStringSchema('password')
  .min(6, "Password must be at least 6 characters long")
  .max(60, "Password must not exceed 60 characters")
  .regex(
    passwordRegex,
    "Password must contain at least one letter and one number",
  )


const otpZodSchema = requiredStringSchema('otp')
  .regex(/^\d{6}$/, "Otp must be a 6-digit number")

export const emailValidationSchema = z.object({
  body: z.object({
    email: emailZodSchema,
  }),
});

export const phoneNumberZodSchema = requiredStringSchema('phoneNumber')
  .regex(phoneRegex, {
    message:
      "Please enter a valid phone number (e.g., +1234567890 or 1234567890)",
  })
  .trim()
  .regex(phoneRegex, {
    message:
      "Please enter a valid phone number (e.g., +1234567890 or 1234567890)",
  });

export const registerCustomerValidationSchema = z.object({
  body: z.object({
    fullName: fullNameZodSchema,
    email: emailZodSchema,
    phone: phoneNumberZodSchema,
    password: passwordZodSchema,
  }),
});

export const verifyOtpValidationSchema = z.object({
  body: z.object({
    email: emailZodSchema,
    otp: otpZodSchema,
  }),
});

const isRememberMeZodSchema = booleanSchema('isRememberMe')
  .optional()
  .default(false)

export const loginValidationSchema = z.object({
  body: z.object({
    email: emailZodSchema,
    password: passwordZodSchema,
    isRememberMe: isRememberMeZodSchema
  }),
});



export const refreshTokenValidationSchema = z
  .object({
    cookies: z
      .object({
        refreshToken: z.string().optional(),
      })
      .optional(),
    body: z
      .object({
        refreshToken: z.string().optional(),
      })
      .optional(),
  })

export const changePasswordValidationSchema = z.object({
  body: z
    .object({
      currentPassword: requiredStringSchema('currentPassword')
        .min(6, "Current password must be at least 6 characters long")
        .max(60, "Current password must not exceed 60 characters")
        .regex(passwordRegex, "Current password must contain at least one letter and one number"),
      newPassword: requiredStringSchema('newPassword')
        .min(6, "New password must be at least 6 characters long")
        .max(60, "New password must not exceed 60 characters")
        .regex(
          passwordRegex,
          "New password must contain at least one letter and one number",
        ),
    })
    .superRefine((data, ctx) => {
      if (data.newPassword === data.currentPassword) {
        ctx.addIssue({
          path: ["newPassword"],
          message: "New password must be different from the current password",
          code: "custom",
        });
      }
    }),
});

export const setNewPasswordValidationSchema = z.object({
  body: z.object({
    token: requiredStringSchema('token')
      .regex(/^[A-Za-z0-9_-]+$/, "Invalid token format."),
    password: passwordZodSchema,
  }),
});

const statusZodSchema = enumSchema('status', ['blocked', 'active'])

export const changeStatusValidationSchema = z.object({
  params: z.object({
    userId: z.string().refine((id) => Types.ObjectId.isValid(id), {
      message: "userId must be a valid ObjectId",
    }),
  }),
  body: z.object({
    status: statusZodSchema
  }),
});

export const changeMultipleStatusValidationSchema = z.object({
  body: z
    .object({
      userIds: z
        .array(
          z.string().refine((id) => Types.ObjectId.isValid(id), {
            message: "userIds must be an array of valid ObjectId",
          }),
          {
            error: (issue) =>
              issue.input === undefined
                ? "userIds must be at least one value"
                : `userIds must be an array`,
          },
        )
        .superRefine((arr, ctx) => {
          if (arr && arr?.length > 0) {
            const duplicates = arr.filter(
              (item, index) => arr.indexOf(item) !== index,
            );
            if (duplicates.length > 0) {
              ctx.addIssue({
                code: "custom",
                message: "userIds array must not contain duplicate values",
              });
            }
          }
        }),
      status: statusZodSchema
    }),
});

export const deleteAccountValidationSchema = z.object({
  body: z.object({
    password: passwordZodSchema,
  }),
});
