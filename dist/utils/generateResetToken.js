"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetToken = void 0;
const encrypt_1 = __importDefault(require("./encrypt"));
const generateResetToken = (email, expiresInMinutes = 10) => {
    const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
    return (0, encrypt_1.default)(`${email}:${expiresAt}`);
};
exports.generateResetToken = generateResetToken;
