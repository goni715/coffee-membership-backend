import { Document, Types } from "mongoose";
import { SUPPORT_STATUSES } from "./support.constant";

export type TSupportStatus = typeof SUPPORT_STATUSES[keyof typeof SUPPORT_STATUSES];

export interface ISupport extends Document {
    userId: Types.ObjectId;
    title: string;
    message: string;
    replyMessage?: string;
    replyAt?: Date;
    status: TSupportStatus
};

export type TSupportQuery = {
    searchTerm?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: string,
    date?: string
};