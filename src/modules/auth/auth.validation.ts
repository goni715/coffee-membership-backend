import z from "zod";
import { fullNameRegex } from "@/modules/user/user.validation";
import { Types } from "mongoose";

export const phoneRegex = /^\+?\d{1,14}$/;

const fullNameZodSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "fullName is required"
        : "fullName must be string",
  })
  .trim()
  .regex(fullNameRegex, {
    message:
      "Full Name can only contain letters, spaces, apostrophes, hyphens, and dots.",
  });

export const emailZodSchema = z.email({
  error: (issue) =>
    issue.input === undefined ? "email is required" : "Invalid email address",
});

const passwordZodSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "password is required"
        : "password must be string",
  })
  .min(6, "Password must be at least 6 characters long")
  .max(60, "Password must not exceed 60 characters")
  .trim();

const otpZodSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? "otp is required" : "otp must be string",
  })
  .regex(/^\d{6}$/, "Otp must be a 6-digit number")
  .trim();

export const emailValidationSchema = z.object({
  email: emailZodSchema,
});


const phoneNumberZodSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "Phone number is required"
        : "Phone number must be a string",
  })
  .trim()
  .regex(phoneRegex, {
    message: "Please enter a valid phone number (e.g., +1234567890 or 1234567890)",
  });

export const registerCustomerValidationSchema = z.object({
  fullName: fullNameZodSchema,
  email: emailZodSchema,
  phone: phoneNumberZodSchema,
  password: passwordZodSchema,
});

export const verifyOtpValidationSchema = z.object({
  email: emailZodSchema,
  otp: otpZodSchema,
});

export const loginValidationSchema = z.object({
  email: emailZodSchema,
  password: passwordZodSchema,
  rememberMe: z
    .boolean({
      error: (issue) =>
        issue.input === undefined
          ? ""
          : "rememberMe must be boolean value",
    })
    .optional()
    .default(false),
});

export const refreshTokenValidationSchema = z.object({
  refreshToken: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Refresh token is required"
        : "refreshToken must be string",
  }),
});

export const changePasswordValidationSchema = z
  .object({
    currentPassword: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "currentPassword is required"
            : "currentPassword must be string",
      })
      .min(6, "Current password must be at least 6 characters long")
      .max(60, "Current password must not exceed 60 characters")
      .trim(),
    newPassword: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "newPassword is required"
            : "newPassword must be string",
      })
      .min(6, "New password must be at least 6 characters long")
      .max(60, "New password must not exceed 60 characters")
      .trim(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword === data.currentPassword) {
      ctx.addIssue({
        path: ["newPassword"],
        message: "New password must be different from the current password",
        code: "custom",
      });
    }
  });

export const forgotPasswordSetNewPassSchema = z.object({
  email: emailZodSchema,
  otp: otpZodSchema,
  password: passwordZodSchema,
});

export const changeStatusValidationSchema = z.object({
  status: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "status is required"
          : `status must be 'blocked' or 'active'`,
    })
    .refine((val) => ["blocked", "active"].includes(val), {
      message: `status must be 'blocked' or 'active'`,
    }),
});

export const changeMultipleStatusValidationSchema = z.object({
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
  status: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "status is required"
          : `status must be 'blocked' or 'active'`,
    })
    .refine((val) => ["blocked", "active"].includes(val), {
      message: `status must be 'blocked' or 'active'`,
    }),
});

export const deleteAccountValidationSchema = z.object({
  password: passwordZodSchema,
});
