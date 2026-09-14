"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_constant_1 = require("./user.constant");
const PasswordHelper_1 = require("../../helpers/PasswordHelper");
const userSchema = new mongoose_1.Schema({
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
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
    },
    role: {
        type: String,
        enum: Object.values(user_constant_1.USER_ROLES),
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
        enum: Object.values(user_constant_1.ACCOUNT_STATUSES),
        default: user_constant_1.ACCOUNT_STATUSES.PENDING,
    },
    googleId: {
        type: String,
        default: null,
    },
    appleId: {
        type: String,
        default: null,
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
}, {
    timestamps: true,
    versionKey: false,
});
// Hash password before saving
userSchema.pre("save", async function () {
    // `this` refers to the document being saved
    if (!this.isModified("password"))
        return;
    this.password = await (0, PasswordHelper_1.hashedPassword)(this.password);
});
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
