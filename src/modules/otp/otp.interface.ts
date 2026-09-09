import { OTP_TYPES } from "./otp.constant";
import { Document, Types } from "mongoose";

export type TOtpType = keyof typeof OTP_TYPES;

export interface IOtp extends Document {
  userId: Types.ObjectId;
  email: string;
  otp: string;
  otpExpires: Date;
  type: TOtpType;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
