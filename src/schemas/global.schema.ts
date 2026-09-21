import z from "zod";

export const booleanQuerySchema = (name: string) => z.string({
    error: (issue) =>
        issue.input === undefined
            ? `${name} is required`
            : `${name} must be a string`,
})
    .refine((val) => ["true", "false"].includes(val), {
        message: `${name} must be 'true' or 'false'`,
    })
    .transform((val) => val === "true")

