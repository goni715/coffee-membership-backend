import { Types } from "mongoose";

export interface IOpeningHour extends Document {
    shopId: Types.ObjectId;
    day: string;
    slug: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
}
