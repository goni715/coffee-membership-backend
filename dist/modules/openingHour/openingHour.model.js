"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpeningHourModel = void 0;
const mongoose_1 = require("mongoose");
const openingHourSchema = new mongoose_1.Schema({
    shopId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
    },
    day: {
        type: String,
        required: true
    },
    openTime: {
        type: String,
        required: true
    },
    closeTime: {
        type: String,
        required: true
    },
    isClosed: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
    versionKey: false
});
exports.OpeningHourModel = (0, mongoose_1.model)("OpeningHour", openingHourSchema);
