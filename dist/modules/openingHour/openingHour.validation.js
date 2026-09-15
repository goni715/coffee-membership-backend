"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOpeningHourValidationSchema = exports.createOpeningHourValidationSchema = void 0;
const zod_1 = require("zod");
const moment_1 = __importDefault(require("moment"));
// "07:00 AM", "11:30 PM") format validation
const timeFormatRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
const openTimeZodSchema = zod_1.z
    .string({
    error: (issue) => issue.input === undefined
        ? "openTime is required"
        : "openTime must be string",
})
    .trim()
    .regex(timeFormatRegex, {
    message: "Invalid open time format. Use 'hh:mm AM/PM' (e.g., '09:00 AM')",
});
const closeTimeZodSchema = zod_1.z
    .string({
    error: (issue) => issue.input === undefined
        ? "closeTime is required"
        : "closeTime must be string",
})
    .trim()
    .regex(timeFormatRegex, {
    message: "Invalid close time format. Use 'hh:mm AM/PM' (e.g., '09:00 AM')",
});
const dayZodSchema = zod_1.z
    .string({
    error: (issue) => issue.input === undefined
        ? "day is required"
        : "day must be string",
})
    .trim()
    .min(3, { message: "Day must be at least 3 characters long" })
    .max(10, { message: "Day cannot be more than 10 characters long" });
exports.createOpeningHourValidationSchema = zod_1.z
    .object({
    day: dayZodSchema,
    openTime: openTimeZodSchema,
    closeTime: closeTimeZodSchema,
})
    .refine((data) => {
    const open = (0, moment_1.default)(data.openTime, "hh:mm A");
    const close = (0, moment_1.default)(data.closeTime, "hh:mm A");
    // openTime must be earlier than closeTime (returns false if equal or later)
    return open.isBefore(close);
}, {
    message: "openTime must be earlier than closeTime and cannot be the same",
    path: ["openTime"],
});
exports.updateOpeningHourValidationSchema = zod_1.z
    .object({
    day: dayZodSchema.optional(),
    openTime: openTimeZodSchema.optional(),
    closeTime: closeTimeZodSchema.optional(),
    isClosed: zod_1.z
        .boolean({
        error: (issue) => issue.input === undefined
            ? "isClosed is required"
            : "isClosed must be boolean",
    })
        .optional()
        .default(false),
})
    .refine((data) => {
    if (data.openTime && data.closeTime) {
        const open = (0, moment_1.default)(data.openTime, "hh:mm A");
        const close = (0, moment_1.default)(data.closeTime, "hh:mm A");
        return open.isBefore(close);
    }
    return true;
}, {
    message: "openTime must be earlier than closeTime and cannot be the same",
    path: ["openTime"],
});
