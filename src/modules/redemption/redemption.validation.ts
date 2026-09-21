import z from "zod";
import { shopIdZodSchema } from "../shop/shop.validation";
import { TIMEFRAME_VALUES } from "./redemption.constant";
import { dateZodSchema } from "../support/support.validation";
import { booleanQuerySchema } from "@/schemas/global.schema";
import { enumSchema } from "@/schemas/enum.schema";

export const qrCodeRegex = /^HH-COFFEE-[0-9A-Fa-f]{6}$/;

export const qrCodeZodSchema = z
    .string({
        error: (issue) =>
            issue.input === undefined
                ? "QR code is required"
                : "QR code must be a string",
    })
    .trim()
    .regex(qrCodeRegex, {
        message: "Invalid QR code format. Expected format: HH-COFFEE-XXXXXX",
    });

export const generateQrCodeValidationSchema = z.object({
    body: z.object({
        shopId: shopIdZodSchema
    })
});

export const verifyQrCodeValidationSchema = z.object({
    body: z.object({
        qrCode: qrCodeZodSchema
    })
});

export const getRedemptionsValidationSchema = z.object({
    query: z.object({
        searchTerm: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sortOrder: z.string().optional(),
        sortBy: z.string().optional(),
        isUsed: booleanQuerySchema("isUsed")
            .optional(),
        timeframe: enumSchema("timeframe", TIMEFRAME_VALUES)
            .optional(),
        date: dateZodSchema.optional(),
    })
});