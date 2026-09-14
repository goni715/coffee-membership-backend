import { Document, Types } from "mongoose";
import { QRCODE_PREFIX, SHOP_STATUSES } from "./shop.constant";

export type TShopStatus = (typeof SHOP_STATUSES)[keyof typeof SHOP_STATUSES];

export interface IShop extends Document {
  ownerId: Types.ObjectId;
  name: string;
  image: string;
  contactNumber: string;
  description: string;
  address: string;
  dailyBenefitDescription?: string;
  activationQrCode: string;
  status: TShopStatus;
  totalActiveCustomers: number;
}


export type TQrCodePrefix = typeof QRCODE_PREFIX[keyof typeof QRCODE_PREFIX];