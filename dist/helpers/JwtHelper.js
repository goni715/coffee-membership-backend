"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtHelper {
    //createToken
    createToken(payload, secretKey, expiresIn) {
        const options = {
            algorithm: "HS256",
            expiresIn, // This can be a number (e.g., 3600) or a string (e.g., "1h", "1m", "1d")
        };
        const token = jsonwebtoken_1.default.sign(payload, secretKey, options);
        return token;
    }
    //verifyToken
    verifyToken(token, secretKey) {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        return decoded;
    }
}
_a = new JwtHelper(), exports.createToken = _a.createToken, exports.verifyToken = _a.verifyToken;
