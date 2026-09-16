import z from 'zod';
import { FAQ_CATEGORIES } from './faq.constant';
import { TFaqCategory } from './faq.interface';
import isNotObjectId from '@/utils/isNotObjectId';

const questionRegex = /^.*\?$/

const questionZodZchema = z
    .string({
        error: (issue) => issue.input === undefined ?
            "question is required" :
            "question must be string"
    })
    .trim()
    .min(1, "question is required")
    .max(500, "question must be at most 500 characters long")
    .regex(questionRegex, {
        message: "Question must end with a question mark (?)",
    });

const answerZodZchema = z
    .string({
        error: (issue) => issue.input === undefined ?
            "answer is required" :
            "answer must be string"
    })
    .trim()
    .min(1, "answer is required")
    .max(500, "answer must be at most 500 characters long")

const categoryZodZchema = z
    .string({
        error: (issue) => issue.input === undefined ?
            "category is required" :
            "category must be string"
    })
    .refine((val) => Object.values(FAQ_CATEGORIES).includes(val as TFaqCategory), {
        message: `category must be one of: ${Object.values(FAQ_CATEGORIES).map((cv) => `'${cv}'`).join(",")}`,
    })

export const createFaqValidationSchema = z.object({
    body: z.object({
        question: questionZodZchema,
        answer: answerZodZchema,
        category: categoryZodZchema
    })
});

export const updateFaqValidationSchema = z.object({
    params: z.object({
        faqId: z.string().refine((id) => !isNotObjectId(id), {
            message: "faqId must be a valid ObjectId",
        }),
    }),
    body: z.object({
        question: questionZodZchema.optional(),
        answer: answerZodZchema.optional(),
        category: categoryZodZchema.optional(),
        isActive: z
            .boolean({
                error: (issue) => issue.input === undefined ?
                    "isActive is required" :
                    "isActive must be boolean"
            })
            .optional()
    })
        .refine((data) => Object.values(data).some((val) => val !== undefined), {
            message: "At least one field must be provided to update",
            path: ["body"],
        })
})


export const deleteFaqValidationSchema = z.object({
    params: z.object({
        faqId: z.string().refine((id) => !isNotObjectId(id), {
            message: "faqId must be a valid ObjectId",
        }),
    }),
})