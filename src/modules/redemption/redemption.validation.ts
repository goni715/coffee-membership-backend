import z from "zod";
import { shopIdZodSchema } from "../shop/shop.validation";

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
