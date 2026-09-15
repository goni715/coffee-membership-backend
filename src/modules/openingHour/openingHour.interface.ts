import { Types } from "mongoose";

export interface IOpeningHour extends Document {
    ownerId: Types.ObjectId
    shopId: Types.ObjectId;
    day: string;
    slug: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
}
