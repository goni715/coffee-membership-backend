"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const auth_service_1 = __importDefault(require("./auth.service"));
const config_1 = __importDefault(require("../../config"));
const NotFoundError_1 = __importDefault(require("../../errors/NotFoundError"));
const session_model_1 = __importDefault(require("../session/session.model"));
const BadRequestError_1 = __importDefault(require("../../errors/BadRequestError"));
const isNotObjectId_1 = __importDefault(require("../../utils/isNotObjectId"));
const registerCustomer = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await auth_service_1.default.registerCustomer(req.body);
    res.status(200).json({
        success: true,
        message: result.message,
        data: null,
    });
});
const verifyAccount = (0, asyncHandler_1.default)(async (req, res) => {
    await auth_service_1.default.verifyAccount(req.body);
    res.status(200).json({
        success: true,
        message: "Your account is verified successfully",
        data: null,
    });
});
const resendVerificationEmail = (0, asyncHandler_1.default)(async (req, res) => {
    const { email } = req.body;
    const result = await auth_service_1.default.resendVerificationEmail(email);
    res.status(200).json({
        success: true,
        message: "Verification email resent. Please check your inbox.",
        data: result,
    });
});
const loginUser = (0, asyncHandler_1.default)(async (req, res) => {
    const ip = req.ip;
    const { accessToken, refreshToken, ...rest } = await auth_service_1.default.loginUser(req.body, ip);
    const refreshTokenMaxAge = req.body.rememberMe
        ? Number(config_1.default.refreshToken.refresh_token_cookie_max_age_remember)
        : Number(config_1.default.refreshToken.refresh_token_cookie_max_age);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        maxAge: refreshTokenMaxAge,
        sameSite: config_1.default.node_env === "production" ? "none" : "lax", // strict: Prevents CSRF attacks
        path: "/",
    });
    res.status(200).json({
        success: true,
        message: "Login successfull",
        data: {
            accessToken,
            refreshToken,
            ...rest,
        },
    });
});
const loginAdmin = (0, asyncHandler_1.default)(async (req, res) => {
    const ip = req.ip;
    const { message, accessToken, refreshToken, ...rest } = await auth_service_1.default.loginAdmin(req.body, ip);
    const refreshTokenMaxAge = req.body.rememberMe
        ? Number(config_1.default.refreshToken.refresh_token_cookie_max_age_remember)
        : Number(config_1.default.refreshToken.refresh_token_cookie_max_age);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        maxAge: refreshTokenMaxAge,
        sameSite: config_1.default.node_env === "production" ? "none" : "lax", // strict: Prevents CSRF attacks
        path: "/",
    });
    res.status(200).json({
        success: true,
        message: message || "Login Success",
        data: {
            accessToken,
            refreshToken,
            ...rest,
        },
    });
});
//logout
const logout = (0, asyncHandler_1.default)(async (req, res) => {
    const { refreshToken } = req.cookies;
    const { refreshToken: refreshTokenByBody } = req.body;
    const finalRefreshToken = refreshToken || refreshTokenByBody;
    const result = await auth_service_1.default.logout(finalRefreshToken);
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: config_1.default.node_env === "production" ? "none" : "lax", // strict: Prevents CSRF attacks
        path: "/",
    });
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
        data: result,
    });
});
//logout from all devices
const logoutAll = (0, asyncHandler_1.default)(async (req, res) => {
    const { refreshToken } = req.cookies;
    const { refreshToken: refreshTokenByBody } = req.body;
    const finalRefreshToken = refreshToken || refreshTokenByBody;
    const result = await auth_service_1.default.logoutFromAll(finalRefreshToken);
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: config_1.default.node_env === "production" ? "none" : "lax", // strict: Prevents CSRF attacks
        path: "/",
    });
    return res.status(200).json({
        success: true,
        message: "Logged out from all devices successfully",
        data: result,
    });
});
//get all sessions
const getAllSessions = (0, asyncHandler_1.default)(async (req, res) => {
    const { userId } = req.headers;
    const result = await auth_service_1.default.getAllSessions(userId);
    res.status(200).json({
        success: true,
        message: "Sessions are retrieved successfully",
        data: result,
    });
});
//revoke session
const revokeSession = (0, asyncHandler_1.default)(async (req, res) => {
    const { sessionId } = req.params;
    const { userId } = req.headers;
    if ((0, isNotObjectId_1.default)(sessionId)) {
        throw new BadRequestError_1.default("sessionId must be a valid ObjectId");
    }
    const session = await session_model_1.default.findOne({
        _id: sessionId,
        userId: userId,
    });
    if (!session) {
        throw new NotFoundError_1.default("Session not found");
    }
    if (session.revoked) {
        return res.status(200).json({
            success: true,
            message: "Session already revoked successfully",
            data: null,
        });
    }
    //update session
    const result = await session_model_1.default.updateOne({
        _id: sessionId,
        userId: userId,
    }, { revoked: true });
    res.clearCookie("refreshToken");
    res.status(200).json({
        success: true,
        message: "Session revoked successfully",
        data: result,
    });
});
const refreshToken = (0, asyncHandler_1.default)(async (req, res) => {
    const { refreshToken } = req.cookies;
    const { refreshToken: refreshTokenByBody } = req.body;
    const result = await auth_service_1.default.refreshToken(refreshToken || refreshTokenByBody);
    res.status(200).json({
        success: true,
        message: "Access token refreshed successfully.",
        data: result,
    });
});
const changePassword = (0, asyncHandler_1.default)(async (req, res) => {
    const ip = req.ip;
    const loginUserId = req.headers.userId;
    const { accessToken, refreshToken } = await auth_service_1.default.changePassword(ip, loginUserId, req.body);
    //remove existing refreshToken
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: config_1.default.node_env === "production" ? "none" : "lax", // strict: Prevents CSRF attacks
        path: "/",
    });
    //set new refreshToken
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        maxAge: Number(config_1.default.refreshToken.refresh_token_cookie_max_age),
        sameSite: config_1.default.node_env === "production" ? "none" : "lax", // strict: Prevents CSRF attacks
        path: "/",
    });
    res.status(200).json({
        success: true,
        message: "Password updated successfully",
        data: {
            accessToken,
            refreshToken,
        },
    });
});
const forgotPasswordSendOtp = (0, asyncHandler_1.default)(async (req, res) => {
    const { email } = req.body;
    const result = await auth_service_1.default.forgotPasswordSendOtp(email);
    res.status(200).json({
        success: true,
        message: "OTP has been sent to your email address.",
        data: result,
    });
});
const forgotPasswordVerifyOtp = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await auth_service_1.default.forgotPasswordVerifyOtp(req.body);
    res.status(200).json({
        success: true,
        message: "OTP is verified successfully.",
        data: result,
    });
});
const forgotPasswordSetNewPassword = (0, asyncHandler_1.default)(async (req, res) => {
    const result = await auth_service_1.default.forgotPasswordSetNewPassword(req.body);
    res.status(200).json({
        success: true,
        message: "Password reset successfully",
        data: result,
    });
});
const changeStatus = (0, asyncHandler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;
    await auth_service_1.default.changeStatus(userId, status);
    res.status(200).json({
        success: true,
        message: `User status updated successfully.`,
        data: null,
    });
});
const changeMultipleStatus = (0, asyncHandler_1.default)(async (req, res) => {
    await auth_service_1.default.changeMultipleStatus(req.body);
    res.status(200).json({
        success: true,
        message: `User status updated successfully.`,
        data: null,
    });
});
const deleteAccount = (0, asyncHandler_1.default)(async (req, res) => {
    const { userId } = req.headers;
    const { password } = req.body;
    await auth_service_1.default.deleteAccount(userId, password);
    res.status(200).json({
        success: true,
        message: `Account deleted successfully.`,
        data: null,
    });
});
const AuthController = {
    registerCustomer,
    verifyAccount,
    resendVerificationEmail,
    loginUser,
    loginAdmin,
    logout,
    logoutAll,
    getAllSessions,
    revokeSession,
    refreshToken,
    changePassword,
    forgotPasswordSendOtp,
    forgotPasswordVerifyOtp,
    forgotPasswordSetNewPassword,
    changeStatus,
    changeMultipleStatus,
    deleteAccount,
};
exports.default = AuthController;
