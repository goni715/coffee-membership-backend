"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccountValidationSchema = exports.changeMultipleStatusValidationSchema = exports.changeStatusValidationSchema = exports.setNewPasswordValidationSchema = exports.changePasswordValidationSchema = exports.refreshTokenValidationSchema = exports.loginValidationSchema = exports.verifyOtpValidationSchema = exports.registerCustomerValidationSchema = exports.phoneNumberZodSchema = exports.emailValidationSchema = exports.passwordZodSchema = exports.emailZodSchema = exports.fullNameZodSchema = exports.phoneRegex = void 0;
const zod_1 = __importDefault(require("zod"));
const user_validation_1 = require("../user/user.validation");
const mongoose_1 = require("mongoose");
exports.phoneRegex = /^\+?\d{1,14}$/;
exports.fullNameZodSchema = zod_1.default
    .string({
    error: (issue) => issue.input === undefined
        ? "fullName is required"
        : "fullName must be string",
})
    .trim()
    .regex(user_validation_1.fullNameRegex, {
    message: "Full Name can only contain letters, spaces, apostrophes, hyphens, and dots.",
});
exports.emailZodSchema = zod_1.default.email({
    error: (issue) => issue.input === undefined ? "email is required" : "Invalid email address",
});
exports.passwordZodSchema = zod_1.default
    .string({
    error: (issue) => issue.input === undefined
        ? "password is required"
        : "password must be string",
})
    .min(6, "Password must be at least 6 characters long")
    .max(60, "Password must not exceed 60 characters")
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "Password must contain at least one letter and one number")
    .trim();
const otpZodSchema = zod_1.default
    .string({
    error: (issue) => issue.input === undefined ? "otp is required" : "otp must be string",
})
    .regex(/^\d{6}$/, "Otp must be a 6-digit number")
    .trim();
exports.emailValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: exports.emailZodSchema,
    }),
});
exports.phoneNumberZodSchema = zod_1.default
    .string({
    error: (issue) => issue.input === undefined
        ? "Phone number is required"
        : "Phone number must be a string",
})
    .trim()
    .regex(exports.phoneRegex, {
    message: "Please enter a valid phone number (e.g., +1234567890 or 1234567890)",
});
exports.registerCustomerValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        fullName: exports.fullNameZodSchema,
        email: exports.emailZodSchema,
        phone: exports.phoneNumberZodSchema,
        password: exports.passwordZodSchema,
    }),
});
exports.verifyOtpValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: exports.emailZodSchema,
        otp: otpZodSchema,
    }),
});
exports.loginValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: exports.emailZodSchema,
        password: exports.passwordZodSchema,
        isRememberMe: zod_1.default
            .boolean({
            error: (issue) => issue.input === undefined
                ? ""
                : "isRememberMe must be boolean value",
        })
            .optional()
            .default(false),
    }),
});
exports.refreshTokenValidationSchema = zod_1.default
    .object({
    cookies: zod_1.default
        .object({
        refreshToken: zod_1.default.string().optional(),
    })
        .optional(),
    body: zod_1.default
        .object({
        refreshToken: zod_1.default.string().optional(),
    })
        .optional(),
})
    .refine((data) => Boolean(data?.cookies?.refreshToken || data?.body?.refreshToken), {
    message: "Refresh token is required in cookie or body",
    path: ["refreshToken"],
});
exports.changePasswordValidationSchema = zod_1.default.object({
    body: zod_1.default
        .object({
        currentPassword: zod_1.default
            .string({
            error: (issue) => issue.input === undefined
                ? "currentPassword is required"
                : "currentPassword must be string",
        })
            .min(6, "Current password must be at least 6 characters long")
            .max(60, "Current password must not exceed 60 characters")
            .trim(),
        newPassword: zod_1.default
            .string({
            error: (issue) => issue.input === undefined
                ? "newPassword is required"
                : "newPassword must be string",
        })
            .min(6, "New password must be at least 6 characters long")
            .max(60, "New password must not exceed 60 characters")
            .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "New password must contain at least one letter and one number")
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
    }),
});
exports.setNewPasswordValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        token: zod_1.default
            .string({
            error: (issue) => issue.input === undefined
                ? "token is required"
                : "token must be string",
        })
            .trim()
            .regex(/^[A-Za-z0-9_-]+$/, "Invalid token format."),
        password: exports.passwordZodSchema,
    }),
});
exports.changeStatusValidationSchema = zod_1.default.object({
    params: zod_1.default.object({
        userId: zod_1.default.string().refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
            message: "userId must be a valid ObjectId",
        }),
    }),
    body: zod_1.default.object({
        status: zod_1.default
            .string({
            error: (issue) => issue.input === undefined
                ? "status is required"
                : `status must be 'blocked' or 'active'`,
        })
            .refine((val) => ["blocked", "active"].includes(val), {
            message: `status must be 'blocked' or 'active'`,
        }),
    }),
});
exports.changeMultipleStatusValidationSchema = zod_1.default.object({
    body: zod_1.default
        .object({
        userIds: zod_1.default
            .array(zod_1.default.string().refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
            message: "userIds must be an array of valid ObjectId",
        }), {
            error: (issue) => issue.input === undefined
                ? "userIds must be at least one value"
                : `userIds must be an array`,
        })
            .superRefine((arr, ctx) => {
            if (arr && arr?.length > 0) {
                const duplicates = arr.filter((item, index) => arr.indexOf(item) !== index);
                if (duplicates.length > 0) {
                    ctx.addIssue({
                        code: "custom",
                        message: "userIds array must not contain duplicate values",
                    });
                }
            }
        }),
        status: zod_1.default
            .string({
            error: (issue) => issue.input === undefined
                ? "status is required"
                : `status must be 'blocked' or 'active'`,
        })
            .refine((val) => ["blocked", "active"].includes(val), {
            message: `status must be 'blocked' or 'active'`,
        }),
    }),
});
exports.deleteAccountValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        password: exports.passwordZodSchema,
    }),
});
