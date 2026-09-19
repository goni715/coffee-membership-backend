
import { z } from "zod";
import { CONTENT_TYPES } from "./content.constant";
import { TContentType } from "./content.interface";


export const contentValidationSchema = z.object({
    type: z.string({
        error: (issue) => issue.input === undefined ?
            "type value is required" :
            "type must be a valid string value."
    })
        .refine((val) => Object.values(CONTENT_TYPES).includes(val as TContentType), {
            message: `type must be one of: ${Object.values(CONTENT_TYPES).map((type) => `'${type}'`).join(' or ')}`,
        }),
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
});

