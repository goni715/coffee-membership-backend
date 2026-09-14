"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const generateQrCode = (prefix) => {
    const randomHex = crypto_1.default.randomBytes(3).toString('hex').toUpperCase();
    return `HH-${prefix}-${randomHex}`; //HH-SHOP-A9F82B
};
exports.default = generateQrCode;
