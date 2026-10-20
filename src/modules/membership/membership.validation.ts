
import z from "zod";
import { shopIdZodSchema } from "../shop/shop.validation";
import isNotObjectId from "@/utils/isNotObjectId";
import { enumSchema } from "@/schemas/enum.schema";
import { MEMBERSHIP_STATUSES, MEMBERSHIP_UPDATE_STATUSES } from "./membership.constant";
import { requiredStringSchema } from "@/schemas/required.schema";

export const shopQrCodeRegex = /^HH-SHOP-[0-9A-Fa-f]{6}$/;

export const joinShopValidationSchema = z.object({
    body: z.object({
        shopId: shopIdZodSchema
    }),
});

const membershipIdZodSchema = requiredStringSchema("membershipId").refine((id) => !isNotObjectId(id), {
    message: "membershipId must be a valid ObjectId",
});


export const updateMembershipStatusValidationSchema = z.object({
    params: z.object({
        membershipId: membershipIdZodSchema
    }),
    body: z.object({
        status: enumSchema('status', MEMBERSHIP_UPDATE_STATUSES)
    })
});

export const getSingleRequestValidationSchema = z.object({
    params: z.object({
        membershipId: membershipIdZodSchema
    }),
});

export const getSingleMembershipByShopIdValidationSchema = z.object({
    params: z.object({
        shopId: shopIdZodSchema
    }),
});


export const qrCodeZodSchema = requiredStringSchema("QR code")
    .regex(shopQrCodeRegex, {
        message: "Invalid QR code format. Expected format: HH-SHOP-XXXXXX",
    });


export const joinShopWithQrCodeValidationSchema = z.object({
    body: z.object({
        qrCode: qrCodeZodSchema
    })
})


export const getMembershipsValidationSchema = z.object({
    query: z.object({
        searchTerm: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: enumSchema('sortOrder', ['asc', 'desc']).optional(),
        status: enumSchema('status', Object.values(MEMBERSHIP_STATUSES)).optional(),
    })
});