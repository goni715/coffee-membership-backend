"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloud_name,
    api_key: config_1.default.cloudinary.cloud_api_key,
    api_secret: config_1.default.cloudinary.cloud_api_secret_key
});
exports.default = cloudinary_1.v2;
