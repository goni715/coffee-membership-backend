"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../helpers/cloudinary"));
const uploadToCloudinary = async (path, folder) => {
    try {
        const result = await cloudinary_1.default.uploader.upload(path, {
            folder: `Coffee/${folder}`,
        });
        return {
            img_url: result.secure_url,
            public_id: result.public_id,
        };
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.default = uploadToCloudinary;
