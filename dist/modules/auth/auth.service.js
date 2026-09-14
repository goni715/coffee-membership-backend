"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConflictError_1 = __importDefault(require("../../errors/ConflictError"));
const ForbiddenError_1 = __importDefault(require("../../errors/ForbiddenError"));
const NotFoundError_1 = __importDefault(require("../../errors/NotFoundError"));
const UnprocessableError_1 = __importDefault(require("../../errors/UnprocessableError"));
const sendVerificationEmail_1 = __importDefault(require("../../utils/email/sendVerificationEmail"));
const generateOTP_1 = __importDefault(require("../../utils/generateOTP"));
const user_model_1 = __importDefault(require("../user/user.model"));
const config_1 = __importDefault(require("../../config"));
const GoneError_1 = __importDefault(require("../../errors/GoneError"));
const makeHash_1 = __importDefault(require("../../utils/makeHash"));
const UnauthorizedError_1 = __importDefault(require("../../errors/UnauthorizedError"));
const isJWTIssuedBeforePassChanged_1 = require("../../utils/isJWTIssuedBeforePassChanged");
const sendForgotEmail_1 = __importDefault(require("../../utils/email/sendForgotEmail"));
const isNotObjectId_1 = __importDefault(require("../../utils/isNotObjectId"));
const BadRequestError_1 = __importDefault(require("../../errors/BadRequestError"));
const session_model_1 = __importDefault(require("../session/session.model"));
const otp_model_1 = __importDefault(require("../otp/otp.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const otp_constant_1 = require("../otp/otp.constant");
const user_constant_1 = require("../user/user.constant");
const JwtHelper_1 = require("../../helpers/JwtHelper");
const PasswordHelper_1 = require("../../helpers/PasswordHelper");
const generateResetToken_1 = require("../../utils/generateResetToken");
const decrypt_1 = __importDefault(require("../../utils/decrypt"));
/*============ register customer  ============*/
const registerCustomer = async (payload) => {
    const { email } = payload;
    //check email
    const user = await user_model_1.default.findOne({ email });
    if (user) {
        //User already exists and but blocked
        if (user.status === user_constant_1.ACCOUNT_STATUSES.BLOCKED) {
            throw new ForbiddenError_1.default("Your account is blocked.");
        }
        //user already active
        if (user.status === user_constant_1.ACCOUNT_STATUSES.ACTIVE) {
            throw new ConflictError_1.default("An account with this email already exists.");
        }
        //User not verified → resend verification
        const otp = (0, generateOTP_1.default)();
        //update otp
        await otp_model_1.default.updateOne({ email, userId: user._id }, { otp, expiresAt: new Date(+new Date() + 600000) }, { upsert: true, runValidators: true });
        //send verification email
        await (0, sendVerificationEmail_1.default)(email, otp.toString());
        return {
            message: "Verification email resent. Please check your inbox.",
        };
    }
    //generate otp
    const otp = (0, generateOTP_1.default)();
    //transaction & rollback
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //create new user
        const newUser = await user_model_1.default.create([{ ...payload, role: user_constant_1.USER_ROLES.CUSTOMER }], { session });
        //create otp
        await otp_model_1.default.create([
            {
                userId: newUser[0]?._id,
                email,
                otp,
            },
        ], { session });
        //transaction success
        await session.commitTransaction();
        //send verification email
        await (0, sendVerificationEmail_1.default)(email, otp.toString());
        return {
            message: "Please check your email to verify",
        };
    }
    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        await session.endSession();
    }
};
/*============ verify account  ============*/
const verifyAccount = async (payload) => {
    const { email, otp } = payload;
    const user = await user_model_1.default.findOne({ email: payload.email });
    if (!user) {
        throw new NotFoundError_1.default("No account found for this email address.");
    }
    //user is alreay verified
    if (user.isEmailVerified) {
        throw new ConflictError_1.default("An account with this email address is already verified.");
    }
    //check otp
    const otpRecord = await otp_model_1.default.findOne({
        userId: user._id,
        email,
        otp,
        type: otp_constant_1.OTP_TYPES.REGISTER,
    });
    if (!otpRecord) {
        throw new UnprocessableError_1.default("Invalid verification code.");
    }
    //check otp expired
    if (otpRecord.expiresAt < new Date()) {
        throw new GoneError_1.default("Expired verification code.");
    }
    //transaction & rollback
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //update the user
        await user_model_1.default.updateOne({ _id: user._id, email: user.email }, { isEmailVerified: true, emailVerifiedAt: new Date(), status: user_constant_1.ACCOUNT_STATUSES.ACTIVE }, { session });
        //delete otp
        await otp_model_1.default.deleteOne({ userId: user._id, email: user.email }, { session });
        //transaction success
        await session.commitTransaction();
        return null;
    }
    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        await session.endSession();
    }
};
/*============ resend verification email  ============*/
const resendVerificationEmail = async (email) => {
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        throw new NotFoundError_1.default(`No account found for this email address.`);
    }
    //check if user is already verified
    if (user.isEmailVerified) {
        throw new ConflictError_1.default("An account with this email address is already verified.");
    }
    const otpRecord = await otp_model_1.default.findOne({
        userId: user._id,
        email,
        type: otp_constant_1.OTP_TYPES.REGISTER,
    });
    // enforce a 1-minute cooldown between OTP resends
    if (otpRecord) {
        const now = Date.now();
        const updated = new Date(otpRecord.updatedAt).getTime();
        const oneMinutes = 1 * 60 * 1000;
        if (now - updated < oneMinutes) {
            throw new ConflictError_1.default("OTP can only be resent after 1 minute");
        }
    }
    const otp = (0, generateOTP_1.default)();
    //update otp
    await otp_model_1.default.updateOne({ userId: user._id, email, type: otp_constant_1.OTP_TYPES.REGISTER }, {
        otp,
        expiresAt: new Date(+new Date() + 600000),
    }, { upsert: true, runValidators: true });
    //send verification email
    await (0, sendVerificationEmail_1.default)(email, otp.toString());
    return {
        resendAvailableAt: new Date(Date.now() + 2 * 60 * 1000), //resend after two minutes
    };
};
/*============ login user  ============*/
const loginUser = async (payload, ip) => {
    const { email, password, isRememberMe } = payload;
    const user = await user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw new NotFoundError_1.default(`No account found for this email address.`);
    }
    //check password
    const isPasswordMatch = await (0, PasswordHelper_1.checkPassword)(password, user.password);
    if (!isPasswordMatch) {
        throw new UnprocessableError_1.default("The password you've entered is incorrect.");
    }
    //check email is not verified
    if (!user.isEmailVerified) {
        throw new ForbiddenError_1.default("Please verify your account.");
    }
    //check user is blocked
    if (user.status === user_constant_1.ACCOUNT_STATUSES.BLOCKED) {
        throw new ForbiddenError_1.default("Your account is blocked.");
    }
    //check you are not customer or owner
    if (!["customer", "owner"].includes(user.role)) {
        throw new ForbiddenError_1.default(`Sorry! You have no access to login.`);
    }
    //transaction & rollback
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //create refreshToken
        const refreshToken = (0, JwtHelper_1.createToken)({
            userId: String(user._id),
            email: user.email,
            tokenVersion: user.tokenVersion,
        }, config_1.default.jwt.jwt_refresh_secret, isRememberMe
            ? config_1.default.jwt.jwt_refresh_expires_in_remember
            : config_1.default.jwt.jwt_refresh_expires_in);
        // check active sessions
        const activeSessions = await session_model_1.default.countDocuments({
            userId: user._id,
            revoked: false,
        }).session(session);
        // delete all sessions if sessions exceed 5 devices
        if (activeSessions >= Number(config_1.default.max_sessions)) {
            await session_model_1.default.deleteMany({
                userId: user._id,
            }, { session });
        }
        //refreshToken exipresAt
        const expiresInMs = isRememberMe
            ? Number(config_1.default.refreshToken.refresh_token_cookie_max_age_remember)
            : Number(config_1.default.refreshToken.refresh_token_cookie_max_age);
        const expireDate = new Date(Date.now() + expiresInMs);
        //set refreshTokenHash or create new session
        const refreshTokenHash = (0, makeHash_1.default)(refreshToken);
        const newSession = await session_model_1.default.create([
            {
                userId: user._id,
                refreshTokenHash,
                ip,
                expiresAt: expireDate
            },
        ], { session });
        //update the lastLoginAt
        await user_model_1.default.updateOne({ _id: user._id }, { lastLoginAt: new Date() }, { session });
        // transaction success
        await session.commitTransaction();
        await session.endSession();
        //create accessToken
        const accessToken = (0, JwtHelper_1.createToken)({
            userId: String(user._id),
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion,
            sessionId: newSession[0]?._id?.toString(),
        }, config_1.default.jwt.jwt_access_secret, config_1.default.jwt.jwt_access_expires_in);
        return {
            accessToken,
            refreshToken,
            userId: user._id,
            email: user.email,
            fullName: user.fullName,
            profileImg: user.profileImg,
            role: user.role
        };
    }
    catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
};
/*============ login admin  ============*/
const loginAdmin = async (payload, ip) => {
    const { email, password, isRememberMe } = payload;
    const user = await user_model_1.default.findOne({
        email,
    }).select("+password");
    if (!user) {
        throw new NotFoundError_1.default(`No account found for this email address.`);
    }
    //check password
    const isPasswordMatch = await (0, PasswordHelper_1.checkPassword)(password, user.password);
    if (!isPasswordMatch) {
        throw new UnprocessableError_1.default("The password you've entered is incorrect.");
    }
    //check email is not verified
    if (!user.isEmailVerified) {
        throw new ForbiddenError_1.default("Please verify your account.");
    }
    //check user is blocked
    if (user.status === user_constant_1.ACCOUNT_STATUSES.BLOCKED) {
        throw new ForbiddenError_1.default("Your account is blocked.");
    }
    //check you are not super_admin or admin
    if (!["admin", "super_admin"].includes(user.role)) {
        throw new ForbiddenError_1.default(`Sorry! You have no access to login.`);
    }
    //transaction & rollback
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //create refreshToken
        const refreshToken = (0, JwtHelper_1.createToken)({
            userId: String(user._id),
            email: user.email,
            tokenVersion: user.tokenVersion,
        }, config_1.default.jwt.jwt_refresh_secret, isRememberMe
            ? config_1.default.jwt.jwt_refresh_expires_in_remember
            : config_1.default.jwt.jwt_refresh_expires_in);
        // check active sessions
        const activeSessions = await session_model_1.default.countDocuments({
            userId: user._id,
            revoked: false,
        }).session(session);
        // delete all sessions if sessions exceed 5 devices
        if (activeSessions >= Number(config_1.default.max_sessions)) {
            await session_model_1.default.deleteMany({
                userId: user._id,
            }, { session });
        }
        //refreshToken exipresAt
        const expiresInMs = isRememberMe
            ? Number(config_1.default.refreshToken.refresh_token_cookie_max_age_remember)
            : Number(config_1.default.refreshToken.refresh_token_cookie_max_age);
        const expireDate = new Date(Date.now() + expiresInMs);
        //set refreshTokenHash or create new session
        const refreshTokenHash = (0, makeHash_1.default)(refreshToken);
        const newSession = await session_model_1.default.create([
            {
                userId: user._id,
                refreshTokenHash,
                ip,
                expiresAt: expireDate,
            },
        ], { session });
        //update the lastLoginAt
        await user_model_1.default.updateOne({ _id: user._id }, { lastLoginAt: new Date() }, { session });
        // transaction success
        await session.commitTransaction();
        await session.endSession();
        //create accessToken
        const accessToken = (0, JwtHelper_1.createToken)({
            userId: String(user._id),
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion,
            sessionId: newSession[0]?._id?.toString(),
        }, config_1.default.jwt.jwt_access_secret, config_1.default.jwt.jwt_access_expires_in);
        return {
            accessToken,
            refreshToken,
            message: `${user.role === "super_admin" ? "Super Admin" : "Admin"} login successfull`,
            userId: user._id,
            email: user.email,
            fullName: user.fullName,
            profileImg: user.profileImg,
            role: user.role,
        };
    }
    catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
};
/*=========== logout ========== */
const logout = async (refreshToken) => {
    //check session is revoked with this refreshToken
    const refreshTokenHash = (0, makeHash_1.default)(refreshToken);
    const session = await session_model_1.default.findOne({
        refreshTokenHash,
        revoked: false,
    });
    if (!session) {
        throw new UnauthorizedError_1.default("Invalid refresh token");
    }
    //update session
    await session_model_1.default.updateOne({ refreshTokenHash }, { revoked: true });
    return null;
};
/*=========== logout from all devices ========== */
const logoutFromAll = async (refreshToken) => {
    //token-verify
    let decoded;
    try {
        decoded = (0, JwtHelper_1.verifyToken)(refreshToken, config_1.default.jwt.jwt_refresh_secret);
    }
    catch (error) {
        throw new UnauthorizedError_1.default("Invalid refresh token");
    }
    //transaction & rollback
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //delete all session
        await session_model_1.default.deleteMany({
            userId: decoded.userId,
        }, { session });
        //update tokenVersion
        await user_model_1.default.updateOne({ _id: decoded.userId }, { $inc: { tokenVersion: 1 } }, { session });
        //transaction success
        await session.commitTransaction();
        await session.endSession();
        return null;
    }
    catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
};
/*============ get all sessions  ============*/
const getAllSessions = async (loginUserId) => {
    const sessions = await session_model_1.default.aggregate([
        {
            $match: {
                userId: new mongoose_2.Types.ObjectId(loginUserId),
                revoked: false,
            },
        },
        {
            $project: {
                ip: 1,
                createdAt: 1,
            },
        },
    ]);
    return sessions;
};
/*============ refresh token  ============*/
const refreshToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new UnauthorizedError_1.default(`You are unauthorized !`);
    }
    let decoded;
    try {
        decoded = (0, JwtHelper_1.verifyToken)(refreshToken, config_1.default.jwt.jwt_refresh_secret);
    }
    catch (error) {
        throw new UnauthorizedError_1.default("Invalid refresh token");
    }
    //check if the user is exist
    const user = await user_model_1.default.findById(decoded.userId);
    if (!user) {
        throw new UnauthorizedError_1.default(`You are unauthorized, user not found`);
    }
    //check logout from all devices
    if (user.tokenVersion !== decoded.tokenVersion) {
        throw new UnauthorizedError_1.default("Session expired. Please login again.");
    }
    //check session is revoked with this refreshToken
    const refreshTokenHash = (0, makeHash_1.default)(refreshToken);
    const session = await session_model_1.default.findOne({
        refreshTokenHash,
    });
    if (!session || session.revoked) {
        throw new UnauthorizedError_1.default("Session expired. Please login again");
    }
    //check if the user is already blocked
    const blockStatus = user.status;
    if (blockStatus === "blocked") {
        throw new UnauthorizedError_1.default(`You are unauthorized, This user is blocked`);
    }
    //check if passwordChangedAt is greater than token iat
    if (user?.passwordChangedAt &&
        (0, isJWTIssuedBeforePassChanged_1.isJWTIssuedBeforePassChanged)(user?.passwordChangedAt, decoded.iat)) {
        throw new UnauthorizedError_1.default("You are unauthorized, Your password has been changed, please login again!");
    }
    //create accessToken
    const accessToken = (0, JwtHelper_1.createToken)({
        userId: String(user._id),
        email: user.email,
        role: user.role,
        tokenVersion: user.tokenVersion,
        sessionId: session._id.toString(),
    }, config_1.default.jwt.jwt_access_secret, config_1.default.jwt.jwt_access_expires_in);
    return {
        accessToken,
    };
};
/*============ change password  ============*/
const changePassword = async (ip, loginUserId, payload) => {
    const { currentPassword, newPassword } = payload;
    const user = await user_model_1.default.findById(loginUserId).select("+password");
    if (!user) {
        throw new NotFoundError_1.default("User not found");
    }
    //checking if the password is not correct
    const isPasswordMatched = await (0, PasswordHelper_1.checkPassword)(currentPassword, user?.password);
    if (!isPasswordMatched) {
        throw new UnprocessableError_1.default("Wrong current password");
    }
    //hash the newPassword
    const hashPass = await (0, PasswordHelper_1.hashedPassword)(newPassword);
    //transaction & rollback
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //update the password
        await user_model_1.default.updateOne({ _id: loginUserId }, { password: hashPass, passwordChangedAt: new Date(Date.now() - 20000) }, { session });
        //create refreshToken
        const refreshToken = (0, JwtHelper_1.createToken)({
            userId: String(user._id),
            email: user.email,
            tokenVersion: user.tokenVersion,
        }, config_1.default.jwt.jwt_refresh_secret, config_1.default.jwt.jwt_refresh_expires_in);
        const refreshTokenHash = (0, makeHash_1.default)(refreshToken);
        const newSession = await session_model_1.default.create([
            {
                userId: user._id,
                refreshTokenHash,
                ip,
            },
        ], { session });
        //transaction success
        await session.commitTransaction();
        await session.endSession();
        //create accessToken
        const accessToken = (0, JwtHelper_1.createToken)({
            userId: String(user._id),
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion,
            sessionId: newSession[0]?._id?.toString(),
        }, config_1.default.jwt.jwt_access_secret, config_1.default.jwt.jwt_access_expires_in);
        return {
            accessToken,
            refreshToken,
        };
    }
    catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
};
/*============ forgot password send otp (step-01)  ============*/
const forgotPasswordSendOtp = async (email) => {
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        throw new NotFoundError_1.default(`No account found for this email address.`);
    }
    //check email is not verified
    if (!user.isEmailVerified) {
        throw new ForbiddenError_1.default("Your account is not verified yet.");
    }
    //check user is blocked
    if (user.status === user_constant_1.ACCOUNT_STATUSES.BLOCKED) {
        throw new ForbiddenError_1.default("Your account is blocked.");
    }
    //check otp--// enforce a 1-minute cooldown between OTP resends
    const otpRecord = await otp_model_1.default.findOne({
        userId: user._id,
        email,
        type: otp_constant_1.OTP_TYPES.RESET_PASSWORD,
    });
    if (otpRecord) {
        const now = Date.now();
        const updated = new Date(otpRecord.updatedAt).getTime();
        const oneMinutes = 1 * 60 * 1000;
        if (now - updated < oneMinutes) {
            throw new ConflictError_1.default("OTP can only be resent after 1 minute.");
        }
    }
    const otp = (0, generateOTP_1.default)();
    //set the forgot otp
    await otp_model_1.default.updateOne({ userId: user._id, email }, {
        otp,
        expires: new Date(+new Date() + 600000),
        type: otp_constant_1.OTP_TYPES.RESET_PASSWORD,
        isVerified: false,
    }, { upsert: true });
    //send otp to the email address
    await (0, sendForgotEmail_1.default)(email, String(otp));
    return {
        resendAvailableAt: new Date(Date.now() + 60 * 1000), //resend after one minute
    };
};
/*============ forgot password verify otp (step-02)  ============*/
const forgotPasswordVerifyOtp = async (payload) => {
    const { email, otp } = payload;
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        throw new NotFoundError_1.default(`No account found for this email address.`);
    }
    //check email is not verified
    if (!user.isEmailVerified) {
        throw new ForbiddenError_1.default("Your account is not verified yet.");
    }
    //check user is blocked
    if (user.status === user_constant_1.ACCOUNT_STATUSES.BLOCKED) {
        throw new ForbiddenError_1.default("Your account is blocked.");
    }
    //check otp doesn't exist
    const otpRecord = await otp_model_1.default.findOne({
        userId: user._id,
        email,
        otp,
        type: otp_constant_1.OTP_TYPES.RESET_PASSWORD,
        isVerified: false,
    });
    if (!otpRecord) {
        throw new UnprocessableError_1.default("Invalid verification code.");
    }
    //check otp expired
    if (otpRecord.expiresAt && otpRecord.expiresAt < new Date()) {
        throw new GoneError_1.default("Expired verification code");
    }
    //delete the otp
    await otp_model_1.default.deleteOne({
        userId: user._id,
        email,
        otp,
        type: otp_constant_1.OTP_TYPES.RESET_PASSWORD,
        isVerified: false,
    });
    //create token
    const resetToken = (0, generateResetToken_1.generateResetToken)(user.email, 5);
    return {
        token: resetToken
    };
};
/*============ forgot password set new password (step-03)  ============*/
const forgotPasswordSetNewPassword = async (payload) => {
    const { token, password } = payload;
    // decrypt and verify the reset token
    let email;
    let expiresAt;
    try {
        const decryptedData = (0, decrypt_1.default)(token); // "user@example.com:1710234567890"
        const parts = decryptedData?.split(":");
        const extractedEmail = parts?.[0];
        const extractedExpiresAt = parts?.[1];
        if (!extractedEmail || !extractedExpiresAt) {
            throw new UnprocessableError_1.default("Invalid reset token.");
        }
        email = extractedEmail;
        expiresAt = extractedExpiresAt;
    }
    catch (error) {
        throw new UnprocessableError_1.default("Invalid reset token.");
    }
    // check token expired
    if (!expiresAt || Number(expiresAt) < Date.now()) {
        throw new GoneError_1.default("Reset token has expired.");
    }
    //check user exist
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        throw new NotFoundError_1.default(`No account found for this email address.`);
    }
    //check email is not verified
    if (!user.isEmailVerified) {
        throw new ForbiddenError_1.default("Your account is not verified yet.");
    }
    //check user is blocked
    if (user.status === user_constant_1.ACCOUNT_STATUSES.BLOCKED) {
        throw new ForbiddenError_1.default("Your account is blocked.");
    }
    //update the password
    const hashPass = await (0, PasswordHelper_1.hashedPassword)(password); //hashedPassword
    const result = await user_model_1.default.updateOne({ email }, { password: hashPass, passwordChangedAt: new Date() });
    return result;
};
/*============ change status  ============*/
const changeStatus = async (userId, status) => {
    if ((0, isNotObjectId_1.default)(userId)) {
        throw new BadRequestError_1.default("userId must be a valid ObjectId");
    }
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new NotFoundError_1.default("userId not found");
    }
    //check user is not verified
    if (!user.isEmailVerified) {
        throw new ConflictError_1.default("This user account is not verified");
    }
    // avoid unnecessary DB update
    if (user.status === status) {
        return {
            message: `User is already ${status}`,
        };
    }
    const result = await user_model_1.default.updateOne({ _id: userId }, { status }, { runValidators: true });
    return result;
};
/*============ change multiple status  ============*/
const changeMultipleStatus = async (payload) => {
    const { userIds, status } = payload;
    //check valid userId
    const findUsersCount = await user_model_1.default.countDocuments({
        _id: { $in: userIds },
    });
    if (findUsersCount !== userIds.length) {
        throw new BadRequestError_1.default("One or more user IDs are invalid");
    }
    //update status
    const result = await user_model_1.default.updateMany({ _id: { $in: userIds } }, { $set: { status } }, { runValidators: true });
    return result;
};
/*============ delete account  ============*/
const deleteAccount = async (loginUserId, password) => {
    const ObjectId = mongoose_2.Types.ObjectId;
    const user = await user_model_1.default.findById(loginUserId).select("+password");
    if (!user) {
        throw new NotFoundError_1.default("Profile not found");
    }
    //check password
    const isPasswordMatch = await (0, PasswordHelper_1.checkPassword)(password, user.password);
    if (!isPasswordMatch) {
        throw new UnprocessableError_1.default("Password is not correct");
    }
    //transaction & rollback
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //delete otp user
        await otp_model_1.default.deleteOne({ userId: new ObjectId(loginUserId) }, { session });
        //delete all sessions
        await session_model_1.default.deleteMany({ userId: new ObjectId(loginUserId) }, { session });
        //delete user
        const result = await user_model_1.default.deleteOne({ _id: new ObjectId(loginUserId) }, { session });
        await session.commitTransaction();
        await session.endSession();
        return result;
    }
    catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
};
const AuthService = {
    registerCustomer,
    verifyAccount,
    resendVerificationEmail,
    loginUser,
    loginAdmin,
    logout,
    logoutFromAll,
    getAllSessions,
    refreshToken,
    changePassword,
    forgotPasswordSendOtp,
    forgotPasswordVerifyOtp,
    forgotPasswordSetNewPassword,
    changeStatus,
    changeMultipleStatus,
    deleteAccount,
};
exports.default = AuthService;
