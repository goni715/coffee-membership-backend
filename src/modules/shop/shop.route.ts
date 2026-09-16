import express from "express";
import validationMiddleware from "@/middlewares/validationMiddleware";
import authMiddleware from "@/middlewares/authMiddleware";
import { USER_ROLES } from "@/modules/user/user.constant";
import ShopController from "./shop.controller";
import { createShopValidationSchema, getSingleShopValidationSchema, updateShopStatusValidationSchema, updateShopValidationSchema } from "./shop.validation";
import upload from "@/helpers/upload";

const router = express.Router();

router.post(
  "/create-shop",
  authMiddleware(USER_ROLES.OWNER),
  upload.single("image"),
  validationMiddleware(createShopValidationSchema),
  ShopController.createShop,
);

router.get(
  "/get-shops",
  authMiddleware(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  ShopController.getShops,
);

router.get(
  "/customer-shops",
  authMiddleware(USER_ROLES.CUSTOMER),
  ShopController.getCustomerShops,
);

router.get(
  "/single-shop/:shopId",
  authMiddleware(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validationMiddleware(getSingleShopValidationSchema),
  ShopController.getSingleShop,
);

router.get(
  "/single-customer-shop/:shopId",
  authMiddleware(USER_ROLES.CUSTOMER),
  validationMiddleware(getSingleShopValidationSchema),
  ShopController.getSingleCustomerShop,
);

router.get(
  "/my-shop",
  authMiddleware(USER_ROLES.OWNER),
  ShopController.getMyShop,
);

router.patch(
  "/update-shop",
  authMiddleware(USER_ROLES.OWNER),
  upload.single("image"),
  validationMiddleware(updateShopValidationSchema),
  ShopController.updateShop,
);

router.patch(
  "/update-shop-status/:shopId",
  authMiddleware(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validationMiddleware(updateShopStatusValidationSchema),
  ShopController.updateShopStatus,
);

const ShopRoutes = router;
export default ShopRoutes;
