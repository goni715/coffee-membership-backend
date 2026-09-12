import { Types, Document } from "mongoose";

export interface ISession extends Document {
    userId: Types.ObjectId;
    refreshTokenHash: string;
    ip: string;
    revoked: boolean;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}