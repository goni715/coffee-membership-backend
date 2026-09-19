
import { Document } from "mongoose";
import { CONTENT_TYPES } from "./content.constant";

export type TContentType = typeof CONTENT_TYPES[keyof typeof CONTENT_TYPES];

export interface IContent extends Document {
    type: TContentType;
    content: string;
    createdAt: Date;
    updatedAt: Date;
};
