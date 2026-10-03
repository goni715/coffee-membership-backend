
import { z } from "zod";
import { enumSchema } from "@/schemas/enum.schema";
import { CONTENT_TYPE_VALUES } from "./content.constant";
import { requiredStringSchema } from "@/schemas/required.schema";

const typeZodSchema = enumSchema("type", CONTENT_TYPE_VALUES);
const contentZodSchema = requiredStringSchema("content")
    .refine((val) => /<[^>]+>/.test(val), {
        message: "Content must be HTML format"
    })

export const contentValidationSchema = z.object({
    body: z.object({
        type: typeZodSchema,
        content: contentZodSchema
    })
});


export const getContentValidationSchema = z.object({
    params: z.object({
        type: typeZodSchema,
    })
});

