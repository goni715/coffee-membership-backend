import { model, Schema } from "mongoose";
import { OTP_TYPES } from "./otp.constant";
import { IOtp } from "./otp.interface";

const otpSchema = new Schema<IOtp>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 6,
    },
    otpExpires: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
    type: {
      type: String,
      enum: Object.values(OTP_TYPES),
      required: true,
      default: OTP_TYPES.register
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const OtpModel = model<IOtp>("Otp", otpSchema);
export default OtpModel;
