import express from "express";
import UserController from "./user.controller";
import authMiddleware from "@/middlewares/authMiddleware";
import { USER_ROLES } from "./user.constant";
import validationMiddleware from "@/middlewares/validationMiddleware";
import { getCustomersByShopIdValidationSchema, getMyCustomersValidationSchema, updateProfileValidationSchema } from "./user.validation";
import upload from "@/helpers/upload";

const router = express.Router();

router.get(
    "/customers",
    authMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    UserController.getCustomers
);

router.get(
    "/my-profile",
    authMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.OWNER),
    UserController.getMyProfile
);

router.patch(
    "/update-profile",
    authMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.OWNER),
    upload.single("image"),
    validationMiddleware(updateProfileValidationSchema),
    UserController.updateProfile
);

router.get(
    "/customers/:shopId",
    authMiddleware(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validationMiddleware(getCustomersByShopIdValidationSchema),
    UserController.getCustomersByShopId,
);

router.get(
    "/my-customers",
    authMiddleware(USER_ROLES.OWNER),
    validationMiddleware(getMyCustomersValidationSchema),
    UserController.getMyCustomers,
);

const UserRoutes = router;
export default UserRoutes;