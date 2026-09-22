import { Types } from "mongoose";
import { TIMEFRAME } from "./redemption.constant";

export interface IRedemption extends Document {
  customerId: Types.ObjectId;
  ownerId: Types.ObjectId;
  shopId: Types.ObjectId;
  qrCode: string;
  isRedeemed: boolean;
  expiresAt: Date;
}

export type TTimeFrame = typeof TIMEFRAME[keyof typeof TIMEFRAME];

export type TRedemptionQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isRedeemed?: 'true' | 'false';
  date?: string;
  timeframe?: TTimeFrame;
};