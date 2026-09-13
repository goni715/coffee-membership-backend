import { Document, Types } from "mongoose";
import { SHOP_STATUSES } from "./shop.constant";

export type TShopStatus = (typeof SHOP_STATUSES)[keyof typeof SHOP_STATUSES];

export interface IShop extends Document {
  ownerId: Types.ObjectId;
  name: string;
  image: string;
  contactNumber: string;
  description: string;
  address: string;
  city: string;
  dailyBenefitDescription?: string;
  activationQrCode: string;
  status: TShopStatus;
  totalActiveCustomers: number;
}
