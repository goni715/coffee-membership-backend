import { model, Schema } from "mongoose";
import { ACCOUNT_STATUSES, USER_ROLES } from "./user.constant";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
    },
    profileImg: {
      type: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(ACCOUNT_STATUSES),
      default: ACCOUNT_STATUSES.PENDING,
    },
    blockedAt: {
      type: Date,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const UserModel = model<IUser>("User", userSchema);
export default UserModel;
