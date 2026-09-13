import { Schema, model } from "mongoose";
import { IOpeningHour } from "./openingHour.interface";

const openingHourSchema = new Schema<IOpeningHour>(
    {
        shopId: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
        day: {
            type: String,
            required: true
        },
        openTime: {
            type: String,
            required: true
        },
        closeTime: {
            type: String,
            required: true
        },
        isClosed: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true },
);

export const OpeningHourModel = model<IOpeningHour>("OpeningHour", openingHourSchema);
