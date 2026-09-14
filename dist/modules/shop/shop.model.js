"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shop_constant_1 = require("./shop.constant");
const shopSchema = new mongoose_1.Schema({
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "ownerId is required"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    image: {
        type: String,
        required: [true, "image is required"],
    },
    contactNumber: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
    },
    address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
    },
    dailyBenefitDescription: {
        type: String,
        default: "",
    },
    qrCode: {
        type: String,
        required: [true, "QR code is required"],
        unique: true,
        trim: true,
    },
    status: {
        type: String,
        enum: Object.values(shop_constant_1.SHOP_STATUSES),
        default: shop_constant_1.SHOP_STATUSES.INACTIVE,
    },
    totalActiveCustomers: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
});
const ShopModel = (0, mongoose_1.model)("Shop", shopSchema);
exports.default = ShopModel;
