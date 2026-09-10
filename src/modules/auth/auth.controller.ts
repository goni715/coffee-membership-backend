import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import AuthService from "./auth.service";
import config from "@/config";
import UserModel from "@/modules/user/user.model";
import makeHash from "@/utils/makeHash";
import NotFoundError from "@/errors/NotFoundError";
import SessionModel from "@/modules/session/session.model";
import { Secret } from "jsonwebtoken";
import mongoose from "mongoose";
import UnauthorizedError from "@/errors/UnauthorizedError";
import isNotObjectId from "@/utils/isNotObjectId";
import BadRequestError from "@/errors/BadRequestError";
import { verifyToken } from "@/helpers/JwtHelper";

const registerCustomer = asyncHandler(async (req, res) => {
  const result = await AuthService.registerCustomer(req.body);
  res.status(200).json({
    success: true,
    message: result.message,
    data: null,
  });
});

const verifyAccount = asyncHandler(async (req, res) => {
  await AuthService.verifyAccount(req.body);
  res.status(200).json({
    success: true,
    message: "Your account is verified successfully",
    data: null,
  });
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.resendVerificationEmail(email);
  res.status(200).json({
    success: true,
    message: "Verification email resent. Please check your inbox.",
    data: result,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const ip = req.ip;
  const { accessToken, refreshToken, ...rest } = await AuthService.loginUser(
    req.body,
    ip as string,
  );

  const refreshTokenMaxAge = req.body.rememberMe
    ? Number(config.refreshToken.refresh_token_cookie_max_age_remember)
    : Number(config.refreshToken.refresh_token_cookie_max_age);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    maxAge: refreshTokenMaxAge,
    sameSite: config.node_env === "production" ? "none" : "lax", // strict: Prevents CSRF attacks
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

const loginAdmin = asyncHandler(async (req, res) => {
  const ip = req.ip;
  const { message, accessToken, refreshToken, ...rest } =
    await AuthService.loginAdmin(req.body, ip as string);

  const refreshTokenMaxAge = req.body.rememberMe
    ? Number(config.refreshToken.refresh_token_cookie_max_age_remember)
    : Number(config.refreshToken.refresh_token_cookie_max_age);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    maxAge: refreshTokenMaxAge,
    sameSite: config.node_env === "production" ? "none" : "lax", // strict: Prevents CSRF attacks
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
const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const { refreshToken: refreshTokenByBody } = req.body;
  const finalRefreshToken = refreshToken || refreshTokenByBody;

  //check session is revoked with this refreshToken
  const refreshTokenHash = makeHash(finalRefreshToken);
  const session = await SessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  //update session
  await SessionModel.updateOne({ refreshTokenHash }, { revoked: true });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: config.node_env === "production" ? "none" : "lax", // strict: Prevents CSRF attacks
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
    data: null,
  });
});

//logout from all devices
const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const { refreshToken: refreshTokenByBody } = req.body;
  const finalRefreshToken = refreshToken || refreshTokenByBody;

  //token-verify
  let decoded;

  try {
    decoded = verifyToken(
      finalRefreshToken,
      config.jwt.jwt_refresh_secret as Secret,
    );
  } catch (error) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  //transaction & rollback
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //delete all session
    await SessionModel.deleteMany(
      {
        userId: decoded.userId,
      },
      { session },
    );

    //update tokenVersion
    await UserModel.updateOne(
      { _id: decoded.userId },
      { $inc: { tokenVersion: 1 } },
      { session },
    );

    //transaction success
    await session.commitTransaction();
    await session.endSession();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.node_env === "production",
      sameSite: config.node_env === "production" ? "none" : "lax", // strict: Prevents CSRF attacks
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully",
      data: null,
    });
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
});

//get all sessions
const getAllSessions = asyncHandler(async (req, res) => {
  const { userId } = req.headers;
  const result = await AuthService.getAllSessions(userId as string);
  res.status(200).json({
    success: true,
    message: "Sessions are retrieved successfully",
    data: result,
  });
});

//revoke session
const revokeSession = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { userId } = req.headers;

  if (isNotObjectId(sessionId as string)) {
    throw new BadRequestError("sessionId must be a valid ObjectId");
  }

  const session = await SessionModel.findOne({
    _id: sessionId as string,
    userId: userId!,
  });

  if (!session) {
    throw new NotFoundError("Session not found");
  }

  if (session.revoked) {
    return res.status(200).json({
      success: true,
      message: "Session already revoked successfully",
      data: null,
    });
  }

  //update session
  const result = await SessionModel.updateOne(
    {
      _id: sessionId as string,
      userId: userId!,
    },
    { revoked: true },
  );

  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Session revoked successfully",
    data: result,
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  const { refreshToken: refreshTokenByBody } = req.body;
  const result = await AuthService.refreshToken(refreshToken || refreshTokenByBody);
  res.status(200).json({
    success: true,
    message: "Access token refreshed successfully.",
    data: result,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const ip = req.ip;
  const loginUserId = req.headers.userId;
  const { accessToken, refreshToken } = await AuthService.changePassword(
    ip as string,
    loginUserId as string,
    req.body,
  );

  //remove existing refreshToken
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: config.node_env === "production" ? "none" : "lax", // strict: Prevents CSRF attacks
    path: "/",
  });

  //set new refreshToken
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    maxAge: Number(config.refreshToken.refresh_token_cookie_max_age),
    sameSite: config.node_env === "production" ? "none" : "lax", // strict: Prevents CSRF attacks
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

const forgotPasswordSendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.forgotPasswordSendOtp(email);
  res.status(200).json({
    success: true,
    message: "OTP has been sent to your email address.",
    data: result,
  });
});

const forgotPasswordVerifyOtp = asyncHandler(async (req, res) => {
  const result = await AuthService.forgotPasswordVerifyOtp(req.body);
  res.status(200).json({
    success: true,
    message: "OTP is verified successfully.",
    data: result,
  });
});

const forgotPasswordSetNewPassword = asyncHandler(async (req, res) => {
  const result = await AuthService.forgotPasswordSetNewPassword(req.body);
  res.status(200).json({
    success: true,
    message: "Password reset successfully",
    data: result,
  });
});

const changeStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;
  await AuthService.changeStatus(userId as string, status);
  res.status(200).json({
    success: true,
    message: `User status updated successfully.`,
    data: null,
  });
});

const changeMultipleStatus = asyncHandler(async (req, res) => {
  await AuthService.changeMultipleStatus(req.body);
  res.status(200).json({
    success: true,
    message: `User status updated successfully.`,
    data: null,
  });
});

const deleteAccount = asyncHandler(async (req, res) => {
  const { userId } = req.headers;
  const { password } = req.body;
  await AuthService.deleteAccount(userId as string, password);
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

export default AuthController;
