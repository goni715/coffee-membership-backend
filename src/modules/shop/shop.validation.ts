import z from "zod";
import { phoneRegex } from "@/modules/auth/auth.validation";
import isNotObjectId from "@/utils/isNotObjectId";
import { SHOP_STATUSES } from "./shop.constant";
import { enumSchema } from "@/schemas/enum.schema";
import { requiredStringSchema } from "@/schemas/required.schema";


const nameZodSchema = requiredStringSchema('name')
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must be at most 100 characters long");


const contactNumberZodSchema = requiredStringSchema('contactNumber')
    .regex(phoneRegex, {
        message:
            "Please enter a valid contact number (e.g., +1234567890 or 1234567890)",
    });

const descriptionZodSchema = requiredStringSchema('description')
    .min(5, "Description must be at least 5 characters long")
    .max(500, "Description must be at most 500 characters long");

const addressZodSchema = requiredStringSchema('address')
    .min(3, "Address must be at least 3 characters long")
    .max(200, "Address must be at most 200 characters long");


export const createShopValidationSchema = z.object({
    body: z.object({
        name: nameZodSchema,
        contactNumber: contactNumberZodSchema,
        description: descriptionZodSchema,
        address: addressZodSchema
    }),
});

export const updateShopValidationSchema = z.object({
    body: z.object({
        name: nameZodSchema.optional(),
        contactNumber: contactNumberZodSchema.optional(),
        description: descriptionZodSchema.optional(),
        address: addressZodSchema.optional(),
        dailyBenefitDescription: requiredStringSchema('dailyBenefitDescription')
            .min(5, "Daily benefit description must be at least 5 characters long")
            .max(500, "Daily benefit description must be at most 500 characters long")
            .optional(),
    })
});


export const shopIdZodSchema = requiredStringSchema('shopId').refine((id) => !isNotObjectId(id), {
    message: "shopId must be a valid ObjectId",
});

export const updateShopStatusValidationSchema = z.object({
    params: z.object({
        shopId: shopIdZodSchema
    }),
    body: z.object({
        status: enumSchema('status', Object.values(SHOP_STATUSES))
    })
});


export const getSingleShopValidationSchema = z.object({
    params: z.object({
        shopId: shopIdZodSchema
    }),
});

export const getShopsValidationSchema = z.object({
    query: z.object({
        searchTerm: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: enumSchema('sortOrder', ['asc', 'desc']).optional(),
        status: enumSchema('status', Object.values(SHOP_STATUSES)).optional(),
    })
});

export const getCustomerShopsValidationSchema = z.object({
    query: z.object({
        searchTerm: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: enumSchema('sortOrder', ['asc', 'desc']).optional(),
    })
});