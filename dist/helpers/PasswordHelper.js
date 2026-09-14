"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashedPassword = exports.checkPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../config"));
class PasswordHelper {
    async checkPassword(plainTextPass, hashPassword) {
        return await bcryptjs_1.default.compare(plainTextPass, hashPassword);
    }
    async hashedPassword(password) {
        const salt = await bcryptjs_1.default.genSalt(Number(config_1.default.bcrypt_salt_rounds));
        return await bcryptjs_1.default.hash(password, salt); //hashedPassword
    }
}
_a = new PasswordHelper(), exports.checkPassword = _a.checkPassword, exports.hashedPassword = _a.hashedPassword;
