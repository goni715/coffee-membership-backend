import { Types } from "mongoose";

export interface IRedemption extends Document {
  customerId: Types.ObjectId;
  shopId: Types.ObjectId;
  qrCode: string;
  isUsed: boolean;
}