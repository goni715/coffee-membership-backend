import z from "zod";
import { fullNameZodSchema, phoneNumberZodSchema } from "../auth/auth.validation";
import { shopIdZodSchema } from "../shop/shop.validation";
import { enumSchema } from "@/schemas/enum.schema";
import { MEMBERSHIP_STATUSES } from "../membership/membership.constant";
import { ACCOUNT_STATUSES } from "./user.constant";


export const updateProfileValidationSchema = z.object({
    body: z.object({
        fullName: fullNameZodSchema.optional(),
        phone: phoneNumberZodSchema.optional(),
    }),
});

export const getCustomersValidationSchema = z.object({
    query: z.object({
        searchTerm: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: enumSchema('sortOrder', ['asc', 'desc']).optional(),
        status: enumSchema('status', Object.values(ACCOUNT_STATUSES)).optional(),
    })
});

export const getCustomersByShopIdValidationSchema = z.object({
    params: z.object({
        shopId: shopIdZodSchema
    }),
    query: z.object({
        searchTerm: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sortOrder: z.string().optional(),
        sortBy: z.string().optional(),
        status: enumSchema('status', ['active', 'blocked']).optional(),
        membershipStatus: enumSchema('membershipStatus', Object.values(MEMBERSHIP_STATUSES)).optional(),
    })
});

export const getMyCustomersValidationSchema = z.object({
    query: z.object({
        searchTerm: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sortOrder: z.string().optional(),
        sortBy: z.string().optional(),
        membershipStatus: enumSchema('membershipStatus', Object.values(MEMBERSHIP_STATUSES)).optional(),
    })
});