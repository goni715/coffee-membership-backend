import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import config from "@/config";
import UserModel from "@/modules/user/user.model";
import SessionModel from "@/modules/session/session.model";
import { verifyToken } from "@/helpers/JwtHelper";
import { isJWTIssuedBeforePassChanged } from "@/utils/isJWTIssuedBeforePassChanged";
import asyncHandler from "@/utils/asyncHandler";
import UnauthorizedError from "@/errors/UnauthorizedError";
import { TUserRole } from "@/modules/user/user.interface";

const authMiddleware = (...roles: TUserRole[]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new UnauthorizedError(
        "You are not authorized. Authentication token is required.",
      );
    }

    let decoded;

    // verify token
    try {
      decoded = verifyToken(token, config.jwt.jwt_access_secret as Secret);
    } catch {
      throw new UnauthorizedError(
        "You are not authorized. Invalid or expired authentication token.",
      );
    }

    // check session
    const session = await SessionModel.findById(decoded.sessionId);

    if (!session || session.revoked) {
      throw new UnauthorizedError(
        "You are not authorized. Session expired. Please login again.",
      );
    }

    // check role
    if (roles.length > 0 && !roles.includes(decoded.role)) {
      throw new UnauthorizedError(
        `You are not authorized. Please provide ${roles
          .map((role) => `'${role}'`)
          .join(" or ")} token.`,
      );
    }

    // Find user
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      throw new UnauthorizedError(
        "You are not authorized. This user does not exist.",
      );
    }

    // check token version
    if (user.tokenVersion !== decoded.tokenVersion) {
      throw new UnauthorizedError(
        "You are not authorized. Session expired. Please login again.",
      );
    }

    // check email verification
    if (!user.isEmailVerified) {
      throw new UnauthorizedError(
        "You are not authorized. Your account is not verified.",
      );
    }

    // check blocked status
    if (user.status === "blocked") {
      throw new UnauthorizedError(
        "You are not authorized. This user is blocked.",
      );
    }

    // check password changed after token issued
    if (
      user.passwordChangedAt &&
      isJWTIssuedBeforePassChanged(
        user.passwordChangedAt,
        decoded.iat as number,
      )
    ) {
      throw new UnauthorizedError(
        "You are not authorized. Your password has been changed. Please login again.",
      );
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

export default authMiddleware;
