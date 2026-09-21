
import z from "zod";
import { shopIdZodSchema } from "../shop/shop.validation";
import isNotObjectId from "@/utils/isNotObjectId";
import { TMembershipStatus } from "./membership.interface";


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
        status: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? "status is required"
                        : `status must be ${['active', 'rejected', 'paused']
                            .map((type) => `'${type}'`)
                            .join(" or ")}`,
            })
            .refine((val) => ['active', 'rejected', 'paused'].includes(val as TMembershipStatus), {
                message: `status must be ${['active', 'rejected', 'paused']
                    .map((type) => `'${type}'`)
                    .join(" or ")}`,
            })
    })
});
