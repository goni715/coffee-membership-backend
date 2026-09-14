"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShopValidationSchema = exports.createShopValidationSchema = exports.contactNumberZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const auth_validation_1 = require("../auth/auth.validation");
exports.contactNumberZodSchema = zod_1.default
    .string({
    error: (issue) => issue.input === undefined
        ? "Contact number is required"
        : "Contact number must be a string",
})
    .trim()
    .regex(auth_validation_1.phoneRegex, {
    message: "Please enter a valid contact number (e.g., +1234567890 or 1234567890)",
});
exports.createShopValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default
            .string({
            error: (issue) => issue.input === undefined
                ? "name is required"
                : "name must be a string",
        })
            .trim()
            .min(2, "Name must be at least 2 characters long")
            .max(100, "Name must be at most 100 characters long"),
        contactNumber: exports.contactNumberZodSchema,
        description: zod_1.default
            .string({
            error: (issue) => issue.input === undefined
                ? "description is required"
                : "description must be a string",
        })
            .trim()
            .min(5, "Description must be at least 5 characters long")
            .max(500, "Description must be at most 500 characters long"),
        address: zod_1.default
            .string({
            error: (issue) => issue.input === undefined
                ? "address is required"
                : "address must be a string",
        })
            .trim()
            .min(3, "Address must be at least 3 characters long")
            .max(200, "Address must be at most 200 characters long"),
    }),
});
exports.updateShopValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default
            .string({
            error: (issue) => issue.input === undefined
                ? "name is required"
                : "name must be a string",
        })
            .trim()
            .min(2, "Name must be at least 2 characters long")
            .max(100, "Name must be at most 100 characters long")
            .optional(),
        contactNumber: exports.contactNumberZodSchema.optional(),
        description: zod_1.default
            .string({
            error: (issue) => issue.input === undefined
                ? "description is required"
                : "description must be a string",
        })
            .trim()
            .min(5, "Description must be at least 5 characters long")
            .max(500, "Description must be at most 500 characters long")
            .optional(),
        dailyBenefitDescription: zod_1.default
            .string({
            error: (issue) => issue.input === undefined
                ? "daily benefit description is required"
                : "daily benefit description must be a string",
        })
            .trim()
            .min(5, "Daily benefit description must be at least 5 characters long")
            .max(500, "Daily benefit description must be at most 500 characters long")
            .optional(),
        address: zod_1.default
            .string({
            error: (issue) => issue.input === undefined
                ? "address is required"
                : "address must be a string",
        })
            .trim()
            .min(3, "Address must be at least 3 characters long")
            .max(200, "Address must be at most 200 characters long")
            .optional(),
    })
});
