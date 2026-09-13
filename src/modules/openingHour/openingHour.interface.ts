import { Types } from "mongoose";

export interface IOpeningHour extends Document {
    shopId: Types.ObjectId;
    day: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
}
