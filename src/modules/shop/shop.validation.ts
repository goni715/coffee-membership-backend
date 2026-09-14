import z from "zod";
import { phoneRegex } from "@/modules/auth/auth.validation";
import isNotObjectId from "@/utils/isNotObjectId";


export const contactNumberZodSchema = z
    .string({
        error: (issue) =>
            issue.input === undefined
                ? "Contact number is required"
                : "Contact number must be a string",
    })
    .trim()
    .regex(phoneRegex, {
        message:
            "Please enter a valid contact number (e.g., +1234567890 or 1234567890)",
    });


export const createShopValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? "name is required"
                        : "name must be a string",
            })
            .trim()
            .min(2, "Name must be at least 2 characters long")
            .max(100, "Name must be at most 100 characters long"),
        contactNumber: contactNumberZodSchema,
        description: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? "description is required"
                        : "description must be a string",
            })
            .trim()
            .min(5, "Description must be at least 5 characters long")
            .max(500, "Description must be at most 500 characters long"),
        address: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? "address is required"
                        : "address must be a string",
            })
            .trim()
            .min(3, "Address must be at least 3 characters long")
            .max(200, "Address must be at most 200 characters long"),
    }),
});

export const updateShopValidationSchema = z.object({
    params: z.object({
        shopId: z.string().refine((id) => !isNotObjectId(id), {
            message: "shopId must be a valid ObjectId",
        }),
    }),
    body: z.object({
        name: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? "name is required"
                        : "name must be a string",
            })
            .trim()
            .min(2, "Name must be at least 2 characters long")
            .max(100, "Name must be at most 100 characters long")
            .optional(),
        contactNumber: contactNumberZodSchema.optional(),
        description: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? "description is required"
                        : "description must be a string",
            })
            .trim()
            .min(5, "Description must be at least 5 characters long")
            .max(500, "Description must be at most 500 characters long")
            .optional(),
        dailyBenefitDescription: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? "daily benefit description is required"
                        : "daily benefit description must be a string",
            })
            .trim()
            .min(5, "Daily benefit description must be at least 5 characters long")
            .max(500, "Daily benefit description must be at most 500 characters long")
            .optional(),
        address: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? "address is required"
                        : "address must be a string",
            })
            .trim()
            .min(3, "Address must be at least 3 characters long")
            .max(200, "Address must be at most 200 characters long")
            .optional(),
    })
        .refine((data) => Object.values(data).some((value) => value !== undefined), {
            message: "At least one field must be provided to update",
            path: ["body"],
        })
});
