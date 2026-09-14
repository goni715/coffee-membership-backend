"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOwnerValidationSchema = exports.updateOwnerValidationSchema = exports.createOwnerValidationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const auth_validation_1 = require("../auth/auth.validation");
const mongoose_1 = require("mongoose");
exports.createOwnerValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        fullName: auth_validation_1.fullNameZodSchema,
        email: auth_validation_1.emailZodSchema,
        phone: auth_validation_1.phoneNumberZodSchema,
        password: auth_validation_1.passwordZodSchema.optional(),
    }),
});
exports.updateOwnerValidationSchema = zod_1.default.object({
    params: zod_1.default.object({
        ownerId: zod_1.default.string().refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
            message: "ownerId must be a valid ObjectId",
        }),
    }),
    body: zod_1.default
        .object({
        fullName: auth_validation_1.fullNameZodSchema.optional(),
        phone: auth_validation_1.phoneNumberZodSchema.optional(),
    })
        .refine((data) => Object.values(data).some((val) => val !== undefined), {
        message: "At least one field must be provided to update",
        path: ["body"],
    }),
});
exports.deleteOwnerValidationSchema = zod_1.default.object({
    params: zod_1.default.object({
        ownerId: zod_1.default.string().refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
            message: "ownerId must be a valid ObjectId",
        }),
    }),
});
