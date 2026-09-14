"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const otp_constant_1 = require("./otp.constant");
const otpSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        expires: 0 //(Time-To-Live)
    },
    type: {
        type: String,
        enum: Object.values(otp_constant_1.OTP_TYPES),
        required: true,
        default: otp_constant_1.OTP_TYPES.REGISTER
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
const OtpModel = (0, mongoose_1.model)("Otp", otpSchema);
exports.default = OtpModel;
