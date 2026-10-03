
import { z } from "zod";
import moment from "moment";
import isNotObjectId from "@/utils/isNotObjectId";
import { requiredStringSchema } from "@/schemas/required.schema";
import { booleanSchema } from "@/schemas/boolean.schema";

// "07:00 AM", "11:30 PM") format validation
const timeFormatRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;

const openTimeZodSchema = requiredStringSchema('openTime')
    .regex(timeFormatRegex, {
        message: "Invalid open time format. Use 'hh:mm AM/PM' (e.g., '09:00 AM')",
    })

const closeTimeZodSchema = requiredStringSchema('closeTime')
    .regex(timeFormatRegex, {
        message: "Invalid close time format. Use 'hh:mm AM/PM' (e.g., '09:00 AM')",
    })

const dayZodSchema = requiredStringSchema('day')
    .min(3, { message: "Day must be at least 3 characters long" })
    .max(60, { message: "Day cannot be more than 10 characters long" })


export const createOpeningHourValidationSchema = z.object({
    body: z
        .object({
            day: dayZodSchema,
            openTime: openTimeZodSchema,
            closeTime: closeTimeZodSchema,
        })
        .refine(
            (data) => {
                const open = moment(data.openTime, "hh:mm A");
                const close = moment(data.closeTime, "hh:mm A");
                // openTime must be earlier than closeTime (returns false if equal or later)
                return open.isBefore(close);
            },
            {
                message: "Open time must be earlier than close time and cannot be the same.",
                path: ["openTime"],
            }
        )
})


const openingIdZodSchema = requiredStringSchema('openingId')
    .refine((id) => !isNotObjectId(id), {
        message: "openingId must be a valid ObjectId",
    });

export const updateOpeningHourValidationSchema = z.object({
    params: z.object({
        openingId: openingIdZodSchema
    }),
    body: z
        .object({
            day: dayZodSchema.optional(),
            openTime: openTimeZodSchema.optional(),
            closeTime: closeTimeZodSchema.optional(),
            isClosed: booleanSchema('isClosed')
                .optional()
                .default(false),
        })
        .refine(
            (data) => Object.values(data).some((val) => val !== undefined),
            {
                message: "At least one field must be provided to update",
            }
        )
        .refine(
            (data) => {
                if (data.openTime && data.closeTime) {
                    const open = moment(data.openTime, "hh:mm A");
                    const close = moment(data.closeTime, "hh:mm A");
                    return open.isBefore(close);
                }
                return true;
            },
            {
                message: "Open time must be earlier than close time and cannot be the same.",
                path: ["openTime"],
            }
        )
});



export const deleteOpeningHourValidationSchema = z.object({
    params: z.object({
        openingId: openingIdZodSchema
    }),
});

