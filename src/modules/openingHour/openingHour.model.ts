import { Schema, model } from "mongoose";
import { IOpeningHour } from "./openingHour.interface";

const openingHourSchema = new Schema<IOpeningHour>(
    {
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        shopId: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
        day: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true,
            trim: true,
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
    {
        timestamps: true,
        versionKey: false
    },
);

export const OpeningHourModel = model<IOpeningHour>("OpeningHour", openingHourSchema);
