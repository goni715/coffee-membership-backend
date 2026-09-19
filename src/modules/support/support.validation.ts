import z from "zod";

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
