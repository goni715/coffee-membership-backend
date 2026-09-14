import z from "zod";
import { phoneNumberZodSchema } from "@/modules/auth/auth.validation";

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
        contactNumber: phoneNumberZodSchema,
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
