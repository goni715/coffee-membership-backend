
import { z } from "zod";
import { CONTENT_TYPES } from "./content.constant";
import { TContentType } from "./content.interface";

const typeZodSchema = z
    .string({
        error: (issue) => issue.input === undefined ?
            "type value is required" :
            "type must be a valid string value."
    })
    .refine((val) => Object.values(CONTENT_TYPES).includes(val as TContentType), {
        message: `type must be one of: ${Object.values(CONTENT_TYPES).map((type) => `'${type}'`).join(' or ')}`,
    })

export const contentValidationSchema = z.object({
    body: z.object({
        type: typeZodSchema,
        content: z
            .string({
                error: (issue) => issue.input === undefined ?
                    "content value is required" :
                    "content must be html value"
            })
            .min(1, { message: "content value is required" })
            .refine((val) => /<[^>]+>/.test(val), {
                message: "Content must be HTML format"
            })
    })
});


export const getContentValidationSchema = z.object({
    params: z.object({
        type: typeZodSchema,
    })
});

