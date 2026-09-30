import express from "express";
import AuthController from "./auth.controller";
import validationMiddleware from "@/middlewares/validationMiddleware";
import {
  changeMultipleStatusValidationSchema,
  changePasswordValidationSchema,
  changeStatusValidationSchema,
  deleteAccountValidationSchema,
  emailValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
  registerCustomerValidationSchema,
  setNewPasswordValidationSchema,
  verifyOtpValidationSchema,
} from "./auth.validation";
import AuthMiddleware from "@/middlewares/authMiddleware";
import { USER_ROLES } from "@/modules/user/user.constant";
import { authRateLimiter } from "@/middlewares/rateLimiter";

const router = express.Router();

router.post(
  "/register-customer",
  validationMiddleware(registerCustomerValidationSchema),
  AuthController.registerCustomer,
);

router.post(
  "/verify-account",
  authRateLimiter,
  validationMiddleware(verifyOtpValidationSchema),
  AuthController.verifyAccount,
);

router.post(
  "/resend-verification-email",
  validationMiddleware(emailValidationSchema),
  AuthController.resendVerificationEmail,
);

router.post(
  "/login-user",
  authRateLimiter,
  validationMiddleware(loginValidationSchema),
  AuthController.loginUser,
);

router.post(
  "/login-admin",
  authRateLimiter,
  validationMiddleware(loginValidationSchema),
  AuthController.loginAdmin,
);

router.post(
  "/logout",
  AuthMiddleware(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER),
  AuthController.logout,
);
router.post(
  "/logout-all",
  AuthMiddleware(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER),
  AuthController.logoutAll,
);

router.get(
  "/get-all-sessions",
  AuthMiddleware(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER),
  AuthController.getAllSessions,
);


router.patch(
  "/revoke-session/:sessionId",
  AuthMiddleware(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER),
  AuthController.revokeSession,
);

router.post(
  "/refresh-token",
  validationMiddleware(refreshTokenValidationSchema),
  AuthController.refreshToken,
);

router.patch(
  "/change-password",
  AuthMiddleware(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.OWNER),
  validationMiddleware(changePasswordValidationSchema),
  AuthController.changePassword,
);

//forgot-password with otp
router.post(
  "/forgot-password/send-otp",
  authRateLimiter,
  validationMiddleware(emailValidationSchema),
  AuthController.forgotPasswordSendOtp,
);

router.post(
  "/forgot-password/verify-otp",
  validationMiddleware(verifyOtpValidationSchema),
  AuthController.forgotPasswordVerifyOtp,
);

router.post(
  "/forgot-password/set-new-password",
  validationMiddleware(setNewPasswordValidationSchema),
  AuthController.forgotPasswordSetNewPassword,
);

router.patch(
  "/change-status/:userId",
  AuthMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationMiddleware(changeStatusValidationSchema),
  AuthController.changeStatus,
);

router.patch(
  "/change-multiple-status",
  AuthMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationMiddleware(changeMultipleStatusValidationSchema),
  AuthController.changeMultipleStatus,
);

router.delete(
  "/delete-account",
  AuthMiddleware(USER_ROLES.CUSTOMER, USER_ROLES.OWNER),
  validationMiddleware(deleteAccountValidationSchema),
  AuthController.deleteAccount,
);

const AuthRoutes = router;
export default AuthRoutes;
