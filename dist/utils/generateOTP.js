"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
function generateOTP() {
    const length = 6;
    const digits = '0123456789';
    let otp = '';
    const randomBytes = crypto_1.default.randomBytes(length);
    for (let i = 0; i < length; i++) {
        const random = randomBytes[i] ?? 0;
        otp += digits[random % digits.length];
    }
    return otp;
}
exports.default = generateOTP;
