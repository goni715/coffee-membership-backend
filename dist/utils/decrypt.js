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
const decrypt = (encryptedToken) => {
    const buffer = Buffer.from(encryptedToken, 'base64url');
    if (buffer.length < 17) {
        throw new Error('Invalid encrypted token format.');
    }
    const iv = buffer.subarray(0, 16);
    const encryptedData = buffer.subarray(16);
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, KEY_BUFFER, iv);
    const decrypted = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final(),
    ]);
    return decrypted.toString('utf8');
};
exports.default = decrypt;
