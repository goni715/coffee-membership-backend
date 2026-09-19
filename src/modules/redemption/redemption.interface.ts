import { Types } from "mongoose";

export interface IRedemption extends Document {
  customerId: Types.ObjectId;
  ownerId: Types.ObjectId;
  shopId: Types.ObjectId;
  qrCode: string;
  isUsed: boolean;
  expiresAt: Date;
}


export type TRedemptionQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isUsed?: 'true' | 'false';
};