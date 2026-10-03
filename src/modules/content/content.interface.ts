
import { Document } from "mongoose";
import { CONTENT_TYPE } from "./content.constant";

export type TContentType = typeof CONTENT_TYPE[keyof typeof CONTENT_TYPE];

export interface IContent extends Document {
    type: TContentType;
    content: string;
    createdAt: Date;
    updatedAt: Date;
};
