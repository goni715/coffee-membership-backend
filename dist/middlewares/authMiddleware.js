"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const session_model_1 = __importDefault(require("../modules/session/session.model"));
const JwtHelper_1 = require("../helpers/JwtHelper");
const isJWTIssuedBeforePassChanged_1 = require("../utils/isJWTIssuedBeforePassChanged");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const UnauthorizedError_1 = __importDefault(require("../errors/UnauthorizedError"));
const authMiddleware = (...roles) => (0, asyncHandler_1.default)(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new UnauthorizedError_1.default("You are not authorized.");
    }
    // Bearer prefix check & extract token
    let token;
    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }
    else {
        token = authHeader;
    }
    if (!token) {
        throw new UnauthorizedError_1.default("You are not authorized.");
    }
    let decoded;
    // verify token
    try {
        decoded = (0, JwtHelper_1.verifyToken)(token, config_1.default.jwt.jwt_access_secret);
    }
    catch (err) {
        console.log(err);
        throw new UnauthorizedError_1.default("You are not authorized. Invalid or expired authentication token.");
    }
    // check session
    const session = await session_model_1.default.findById(decoded.sessionId);
    if (!session || session.revoked) {
        throw new UnauthorizedError_1.default("You are not authorized. Session expired. Please login again.");
    }
    // check role
    if (roles.length > 0 && !roles.includes(decoded.role)) {
        throw new UnauthorizedError_1.default(`You are not authorized. Please provide ${roles
            .map((role) => `'${role}'`)
            .join(" or ")} token.`);
    }
    // Find user
    const user = await user_model_1.default.findById(decoded.userId);
    if (!user) {
        throw new UnauthorizedError_1.default("You are not authorized. This user does not exist.");
    }
    // check token version
    if (user.tokenVersion !== decoded.tokenVersion) {
        throw new UnauthorizedError_1.default("You are not authorized. Session expired. Please login again.");
    }
    // check email verification
    if (!user.isEmailVerified) {
        throw new UnauthorizedError_1.default("You are not authorized. Your account is not verified.");
    }
    // check blocked status
    if (user.status === "blocked") {
        throw new UnauthorizedError_1.default("You are not authorized. This user is blocked.");
    }
    // check password changed after token issued
    if (user.passwordChangedAt &&
        (0, isJWTIssuedBeforePassChanged_1.isJWTIssuedBeforePassChanged)(user.passwordChangedAt, decoded.iat)) {
        throw new UnauthorizedError_1.default("You are not authorized. Your password has been changed. Please login again.");
    }
    // attach authenticated user
    req.user = {
        userId: decoded.userId,
        email: decoded.email,
        fullName: user.fullName,
        role: decoded.role,
    };
    // or set user to headers
    req.headers.userId = decoded.userId;
    req.headers.email = decoded.email;
    req.headers.role = decoded.role;
    next();
});
exports.default = authMiddleware;
