import z from "zod";
import { shopIdZodSchema } from "../shop/shop.validation";
import { TIMEFRAME_VALUES } from "./redemption.constant";
import { dateZodSchema } from "../support/support.validation";
import { booleanQuerySchema } from "@/schemas/global.schema";
import { enumSchema } from "@/schemas/enum.schema";
import { requiredStringSchema } from "@/schemas/required.schema";

export const qrCodeRegex = /^HH-COFFEE-[0-9A-Fa-f]{6}$/;

export const qrCodeZodSchema = requiredStringSchema('QR code')
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
        isRedeemed: booleanQuerySchema("isRedeemed")
            .optional(),
        timeframe: enumSchema("timeframe", TIMEFRAME_VALUES)
            .optional(),
        date: dateZodSchema.optional(),
    })
});

export const getSingleRedemptionValidationSchema = z.object({
    params: z.object({
        qrCode: qrCodeZodSchema
    })
})