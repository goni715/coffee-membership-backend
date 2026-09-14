"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sessionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "userId is required"]
    },
    refreshTokenHash: {
        type: String,
        required: [true, "Refresh token hash is required"]
    },
    ip: {
        type: String,
        required: [true, "IP address is required"]
    },
    revoked: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } //(Time-To-Live)-automatic delete
    }
}, {
    timestamps: true,
    versionKey: false
});
const SessionModel = (0, mongoose_1.model)("Session", sessionSchema);
exports.default = SessionModel;
