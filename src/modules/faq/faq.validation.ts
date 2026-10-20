import z from 'zod';
import isNotObjectId from '@/utils/isNotObjectId';
import { requiredStringSchema } from '@/schemas/required.schema';
import { enumSchema } from '@/schemas/enum.schema';
import { FAQ_CATEGORY_VALUES } from './faq.constant';
import { booleanSchema } from '@/schemas/boolean.schema';
import { booleanQuerySchema } from '@/schemas/global.schema';

const questionRegex = /^.*\?$/

const questionZodZchema = requiredStringSchema('question')
    .max(500, "question must be at most 500 characters long")
    .regex(questionRegex, {
        message: "Question must end with a question mark (?)",
    });

const answerZodZchema = requiredStringSchema('answer')
    .max(500, "answer must be at most 500 characters long")

const categoryZodZchema = enumSchema('category', FAQ_CATEGORY_VALUES);

export const createFaqValidationSchema = z.object({
    body: z.object({
        question: questionZodZchema,
        answer: answerZodZchema,
        category: categoryZodZchema,
        isActive: booleanSchema('isActive').optional()
    })
});

const faqIdZodSchema = z.string().refine((id) => !isNotObjectId(id), {
    message: "faqId must be a valid ObjectId",
});

export const updateFaqValidationSchema = z.object({
    params: z.object({
        faqId: faqIdZodSchema,
    }),
    body: z.object({
        question: questionZodZchema.optional(),
        answer: answerZodZchema.optional(),
        category: categoryZodZchema.optional(),
        isActive: booleanSchema('isActive').optional()
    })
        .refine((data) => Object.values(data).some((val) => val !== undefined), {
            message: "At least one field must be provided to update",
            path: ["body"],
        })
})


export const deleteFaqValidationSchema = z.object({
    params: z.object({
        faqId: faqIdZodSchema,
    }),
})

export const getFaqsValidationSchema = z.object({
    query: z.object({
        searchTerm: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: enumSchema("sortOrder", ["asc", "desc"])
            .optional(),
        isActive: booleanQuerySchema("isActive")
            .optional(),
        category: enumSchema("category", FAQ_CATEGORY_VALUES)
            .optional(),
    })
});