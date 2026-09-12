import { OTP_TYPES } from "./otp.constant";
import { Document, Types } from "mongoose";

export type TOtpType = (typeof OTP_TYPES)[keyof typeof OTP_TYPES];

export interface IOtp extends Document {
  userId: Types.ObjectId;
  email: string;
  otp: string;
  type: TOtpType;
  expiresAt: Date;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
