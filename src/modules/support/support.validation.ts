import z from "zod";
import { SUPPORT_STATUSES } from "./support.constant";
import { TSupportStatus } from "./support.interface";

export const dateFormatRegex = /^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const supportValidationSchema = z.object({
    body: z.object({
        title: z
            .string({
                error: (issue) => issue.input === undefined ?
                    "title is required" :
                    "title must be string"
            })
            .trim()
            .min(1, "title is required")
            .max(150, {
                message: "Title must not exceed 150 characters",
            }),
        message: z
            .string({
                error: (issue) => issue.input === undefined ?
                    "message is required" :
                    "message must be string"
            })
            .trim()
            .min(1, "message is required")
            .max(500, {
                message: "Message must not exceed 500 characters",
            }),
    })
});


export const dateZodSchema = z
    .string({
        error: (issue) =>
            issue.input === undefined
                ? "date is required"
                : "date must be a string",
    })
    .superRefine((date, ctx) => {
        // validate date format
        if (!dateFormatRegex.test(date)) {
            ctx.addIssue({
                code: "custom",
                message: "date must be 'YYYY-MM-DD' format",
            });
            return;
        }
    })

export const getAllSupportsValidationSchema = z.object({
    query: z.object({
        searchTerm: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sortOrder: z.string().optional(),
        sortBy: z.string().optional(),
        status: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? "status is required"
                        : `status must be ${Object.values(SUPPORT_STATUSES)
                            .map((type) => `'${type}'`)
                            .join(" or ")}`,
            })
            .refine((val) => Object.values(SUPPORT_STATUSES).includes(val as TSupportStatus), {
                message: `status must be ${Object.values(SUPPORT_STATUSES)
                    .map((type) => `'${type}'`)
                    .join(" or ")}`,
            })
            .optional(),
        date: dateZodSchema.optional(),
    })
});