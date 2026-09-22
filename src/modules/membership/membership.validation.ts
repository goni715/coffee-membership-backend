
import z from "zod";
import { shopIdZodSchema } from "../shop/shop.validation";
import isNotObjectId from "@/utils/isNotObjectId";
import { enumSchema } from "@/schemas/enum.schema";
import { MEMBERSHIP_UPDATE_STATUSES } from "./membership.constant";


export const joinShopValidationSchema = z.object({
    body: z.object({
        shopId: shopIdZodSchema
    }),
});

const membershipIdZodSchema = z
    .string({
        error: (issue) =>
            issue.input === undefined
                ? "membershipId is required"
                : "membershipId must be a string",
    }).refine((id) => !isNotObjectId(id), {
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


