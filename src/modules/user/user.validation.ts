import z from "zod";
import { fullNameZodSchema, phoneNumberZodSchema } from "../auth/auth.validation";


export const updateProfileValidationSchema = z.object({
    body: z.object({
        fullName: fullNameZodSchema.optional(),
        phone: phoneNumberZodSchema.optional(),
    }),
});
