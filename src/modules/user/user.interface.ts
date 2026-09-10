import { Document } from "mongoose";
import { ACCOUNT_STATUSES, USER_ROLES } from "./user.constant";

export type TUserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type TAccountStatus = (typeof ACCOUNT_STATUSES)[keyof typeof ACCOUNT_STATUSES];

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: TUserRole;
  profileImg?: string;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date;
  status: TAccountStatus;
  googleId: string;
  appleId: string;
  blockedAt?: Date;
  passwordChangedAt?: Date;
  lastLoginAt?: Date;
  tokenVersion: number;
}
