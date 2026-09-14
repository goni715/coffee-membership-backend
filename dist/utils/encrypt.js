"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const crypto_1 = __importDefault(require("crypto"));
const ALGORITHM = 'aes-256-cbc';
const KEY_BUFFER = crypto_1.default
    .createHash('sha256')
    .update(config_1.default.encryption_key)
    .digest();
const encrypt = (text) => {
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, KEY_BUFFER, iv);
    const encrypted = Buffer.concat([
        iv,
        cipher.update(text, 'utf8'),
        cipher.final(),
    ]);
    return encrypted.toString('base64url');
};
exports.default = encrypt;
